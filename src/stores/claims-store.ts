import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Claim, Patient, Episode, BillingPeriod, Remittance, ClaimStatus } from '@/models'
import { seedData } from '@/data/seed'
import { computeReadiness } from '@/utils/readiness'

interface ClaimSearchParams {
  status?: ClaimStatus
  payer?: string
  dateFrom?: string
  dateTo?: string
  patient?: string
  aging?: string
}

interface ClaimsState {
  claims: Claim[]
  patients: Patient[]
  episodes: Episode[]
  billingPeriods: BillingPeriod[]

  getClaimById: (id: string) => Claim | undefined
  getPatientById: (id: string) => Patient | undefined
  getEpisodeByClaimId: (claimId: string) => Episode | undefined
  getClaimsFiltered: (params: ClaimSearchParams) => Claim[]
  groupByStatus: (params: ClaimSearchParams) => Map<ClaimStatus, Claim[]>
  updateClaimField: (claimId: string, field: string, value: unknown) => void
  submitClaim: (claimId: string) => void
  postPayment: (claimId: string, remittance: Remittance) => void
  writeOffClaim: (claimId: string) => void
  resetToSeedData: () => void
}

function daysAgo(dateStr: string): number {
  const now = new Date()
  const then = new Date(dateStr)
  return Math.floor((now.getTime() - then.getTime()) / (1000 * 60 * 60 * 24))
}

function agingBucket(days: number): string {
  if (days <= 30) return '0-30'
  if (days <= 60) return '31-60'
  if (days <= 90) return '61-90'
  return '90+'
}

export const useClaimsStore = create<ClaimsState>()(
  persist(
    (set, get) => ({
      ...structuredClone(seedData),

      getClaimById: (id) => get().claims.find((c) => c.id === id),

      getPatientById: (id) => get().patients.find((p) => p.id === id),

      getEpisodeByClaimId: (claimId) => {
        const claim = get().claims.find((c) => c.id === claimId)
        if (!claim) return undefined
        const bp = get().billingPeriods.find((b) => b.id === claim.billingPeriodId)
        if (!bp) return undefined
        return get().episodes.find((e) => e.id === bp.episodeId)
      },

      getClaimsFiltered: (params) => {
        let result = get().claims
        if (params.status) {
          result = result.filter((c) => c.status === params.status)
        }
        if (params.payer) {
          result = result.filter((c) => c.payerName === params.payer)
        }
        if (params.dateFrom) {
          result = result.filter((c) => c.fromDate >= params.dateFrom!)
        }
        if (params.dateTo) {
          result = result.filter((c) => c.fromDate <= params.dateTo!)
        }
        if (params.patient) {
          const search = params.patient.toLowerCase()
          result = result.filter((c) => {
            const patient = get().patients.find((p) => p.id === c.patientId)
            if (!patient) return false
            const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase()
            return fullName.includes(search)
          })
        }
        if (params.aging) {
          result = result.filter((c) => {
            const days = daysAgo(c.statusChangedAt)
            return agingBucket(days) === params.aging
          })
        }
        return result
      },

      groupByStatus: (params) => {
        const filtered = get().getClaimsFiltered(params)
        const statuses: ClaimStatus[] = ['Ready for Review', 'Submitted', 'Rejected', 'Denied', 'Paid', 'Written Off']
        const grouped = new Map<ClaimStatus, Claim[]>()
        for (const status of statuses) {
          const claims = filtered
            .filter((c) => c.status === status)
            .sort((a, b) => new Date(a.statusChangedAt).getTime() - new Date(b.statusChangedAt).getTime())
          grouped.set(status, claims)
        }
        return grouped
      },

      updateClaimField: (claimId, field, value) => {
        set((state) => ({
          claims: state.claims.map((c) => {
            if (c.id !== claimId) return c
            return {
              ...c,
              [field]: value,
              timeline: [
                ...c.timeline,
                {
                  id: `tl-${Date.now()}`,
                  eventType: 'Edited' as const,
                  timestamp: new Date().toISOString(),
                  details: `Updated ${field}`,
                },
              ],
            }
          }),
        }))
      },

      submitClaim: (claimId) => {
        const state = get()
        const claim = state.claims.find((c) => c.id === claimId)
        if (!claim) throw new Error(`Claim ${claimId} not found`)

        // Re-compute readiness
        const episode = state.getEpisodeByClaimId(claimId)
        const readiness = episode ? computeReadiness(claim, episode) : claim.readiness
        if (!readiness.allPassing) {
          throw new Error('Cannot submit: not all readiness checks are passing')
        }

        const wasRejectedOrDenied = claim.status === 'Rejected' || claim.status === 'Denied'
        const eventType = wasRejectedOrDenied ? 'Resubmitted' : 'Submitted'
        const now = new Date().toISOString()

        set((state) => ({
          claims: state.claims.map((c) => {
            if (c.id !== claimId) return c
            return {
              ...c,
              status: 'Submitted' as const,
              submissionDate: now,
              statusChangedAt: now,
              readiness,
              rejectionReason: null,
              denialReason: null,
              timeline: [
                ...c.timeline,
                { id: `tl-${Date.now()}`, eventType, timestamp: now, details: null },
              ],
            }
          }),
        }))
      },

      postPayment: (claimId, remittance) => {
        const claim = get().claims.find((c) => c.id === claimId)
        if (!claim) throw new Error(`Claim ${claimId} not found`)
        if (claim.status !== 'Submitted') {
          throw new Error('Cannot post payment: claim is not in Submitted status')
        }

        const now = new Date().toISOString()
        set((state) => ({
          claims: state.claims.map((c) => {
            if (c.id !== claimId) return c
            return {
              ...c,
              status: 'Paid' as const,
              remittance,
              statusChangedAt: now,
              timeline: [
                ...c.timeline,
                {
                  id: `tl-${Date.now()}`,
                  eventType: 'Paid' as const,
                  timestamp: now,
                  details: `Payment received: $${remittance.paymentAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })} | Check/EFT: ${remittance.checkEftReference} | ICN: ${remittance.claimControlNumber}`,
                },
              ],
            }
          }),
        }))
      },

      writeOffClaim: (claimId) => {
        const claim = get().claims.find((c) => c.id === claimId)
        if (!claim) throw new Error(`Claim ${claimId} not found`)
        if (claim.status !== 'Denied') {
          throw new Error('Cannot write off: claim is not in Denied status')
        }

        const now = new Date().toISOString()
        set((state) => ({
          claims: state.claims.map((c) => {
            if (c.id !== claimId) return c
            return {
              ...c,
              status: 'Written Off' as const,
              statusChangedAt: now,
              timeline: [
                ...c.timeline,
                { id: `tl-${Date.now()}`, eventType: 'Written Off' as const, timestamp: now, details: null },
              ],
            }
          }),
        }))
      },

      resetToSeedData: () => {
        set(structuredClone(seedData))
      },
    }),
    {
      name: 'billing-claims',
      version: 1,
      partialize: (state) => ({
        claims: state.claims,
        patients: state.patients,
        episodes: state.episodes,
        billingPeriods: state.billingPeriods,
      }),
    },
  ),
)
