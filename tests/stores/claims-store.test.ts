import { describe, it, expect, beforeEach } from 'vitest'
import { useClaimsStore } from '@/stores/claims-store'

// T011: Claims store actions
describe('claims store', () => {
  beforeEach(() => {
    // Reset store to seed data before each test
    useClaimsStore.getState().resetToSeedData()
  })

  it('resetToSeedData loads seed data', () => {
    const state = useClaimsStore.getState()
    expect(state.claims.length).toBeGreaterThan(0)
    expect(state.patients.length).toBeGreaterThan(0)
    expect(state.episodes.length).toBeGreaterThan(0)
    expect(state.billingPeriods.length).toBeGreaterThan(0)
  })

  it('getClaimById returns a claim', () => {
    const state = useClaimsStore.getState()
    const firstClaim = state.claims[0]
    const found = state.getClaimById(firstClaim.id)
    expect(found).toBeDefined()
    expect(found!.id).toBe(firstClaim.id)
  })

  it('getPatientById returns a patient', () => {
    const state = useClaimsStore.getState()
    const firstPatient = state.patients[0]
    const found = state.getPatientById(firstPatient.id)
    expect(found).toBeDefined()
    expect(found!.id).toBe(firstPatient.id)
  })

  describe('submitClaim', () => {
    it('submits a ready claim with all passing readiness', () => {
      const state = useClaimsStore.getState()
      const readyClaim = state.claims.find(
        (c) => c.status === 'Ready for Review' && c.readiness.allPassing,
      )
      expect(readyClaim).toBeDefined()

      state.submitClaim(readyClaim!.id)

      const updated = useClaimsStore.getState().getClaimById(readyClaim!.id)!
      expect(updated.status).toBe('Submitted')
      expect(updated.submissionDate).toBeTruthy()
      expect(updated.timeline.some((e) => e.eventType === 'Submitted')).toBe(true)
    })

    it('throws on claim with failing readiness', () => {
      const state = useClaimsStore.getState()
      const failingClaim = state.claims.find(
        (c) => c.status === 'Ready for Review' && !c.readiness.allPassing,
      )
      expect(failingClaim).toBeDefined()

      expect(() => state.submitClaim(failingClaim!.id)).toThrow()
    })

    it('creates Resubmitted event for previously rejected claim', () => {
      const state = useClaimsStore.getState()
      const rejectedClaim = state.claims.find(
        (c) => c.status === 'Rejected' && c.readiness.allPassing,
      )
      if (!rejectedClaim) return // skip if no such claim in seed data

      state.submitClaim(rejectedClaim.id)

      const updated = useClaimsStore.getState().getClaimById(rejectedClaim.id)!
      expect(updated.status).toBe('Submitted')
      expect(updated.timeline.some((e) => e.eventType === 'Resubmitted')).toBe(true)
    })
  })

  describe('postPayment', () => {
    it('posts payment on a Submitted claim', () => {
      const state = useClaimsStore.getState()
      const submittedClaim = state.claims.find((c) => c.status === 'Submitted')
      expect(submittedClaim).toBeDefined()

      const remittance = {
        paymentAmount: 3200,
        contractualAdjustment: 642,
        deductibleAmount: 0,
        otherAdjustment: 0,
        checkEftReference: 'EFT-123',
        claimControlNumber: 'DCN-TEST-001',
        remittanceDate: '2026-11-15',
      }
      state.postPayment(submittedClaim!.id, remittance)

      const updated = useClaimsStore.getState().getClaimById(submittedClaim!.id)!
      expect(updated.status).toBe('Paid')
      expect(updated.remittance).toEqual(remittance)
      expect(updated.timeline.some((e) => e.eventType === 'Paid')).toBe(true)
    })

    it('throws on non-Submitted claim', () => {
      const state = useClaimsStore.getState()
      const nonSubmitted = state.claims.find((c) => c.status === 'Ready for Review')!
      const remittance = {
        paymentAmount: 100,
        contractualAdjustment: 0,
        deductibleAmount: 0,
        otherAdjustment: 0,
        checkEftReference: 'X',
        claimControlNumber: 'DCN-TEST-002',
        remittanceDate: '2026-11-15',
      }
      expect(() => state.postPayment(nonSubmitted.id, remittance)).toThrow()
    })
  })

  describe('writeOffClaim', () => {
    it('writes off a Denied claim', () => {
      const state = useClaimsStore.getState()
      const deniedClaim = state.claims.find((c) => c.status === 'Denied')
      expect(deniedClaim).toBeDefined()

      state.writeOffClaim(deniedClaim!.id)

      const updated = useClaimsStore.getState().getClaimById(deniedClaim!.id)!
      expect(updated.status).toBe('Written Off')
      expect(updated.timeline.some((e) => e.eventType === 'Written Off')).toBe(true)
    })

    it('throws on non-Denied claim', () => {
      const state = useClaimsStore.getState()
      const submittedClaim = state.claims.find((c) => c.status === 'Submitted')!
      expect(() => state.writeOffClaim(submittedClaim.id)).toThrow()
    })
  })

  describe('updateClaimField', () => {
    it('updates a field and adds Edited timeline event', () => {
      const state = useClaimsStore.getState()
      const claim = state.claims[0]
      const originalTimelineLength = claim.timeline.length

      state.updateClaimField(claim.id, 'attendingPhysicianNpi', '9999999999')

      const updated = useClaimsStore.getState().getClaimById(claim.id)!
      expect(updated.attendingPhysicianNpi).toBe('9999999999')
      expect(updated.timeline.length).toBe(originalTimelineLength + 1)
      expect(updated.timeline[updated.timeline.length - 1].eventType).toBe('Edited')
    })
  })

  describe('groupByStatus', () => {
    it('groups claims by status with all statuses present', () => {
      const state = useClaimsStore.getState()
      const grouped = state.groupByStatus({})
      expect(grouped.size).toBe(6)
      expect(grouped.has('Ready for Review')).toBe(true)
      expect(grouped.has('Submitted')).toBe(true)
      expect(grouped.has('Rejected')).toBe(true)
      expect(grouped.has('Denied')).toBe(true)
      expect(grouped.has('Paid')).toBe(true)
      expect(grouped.has('Written Off')).toBe(true)

      // Total should match all claims
      const total = Array.from(grouped.values()).reduce((sum, arr) => sum + arr.length, 0)
      expect(total).toBe(state.claims.length)
    })

    it('sorts claims within each status by statusChangedAt ascending (oldest first)', () => {
      const state = useClaimsStore.getState()
      const grouped = state.groupByStatus({})
      for (const claims of grouped.values()) {
        for (let i = 1; i < claims.length; i++) {
          expect(new Date(claims[i].statusChangedAt).getTime()).toBeGreaterThanOrEqual(
            new Date(claims[i - 1].statusChangedAt).getTime(),
          )
        }
      }
    })

    it('respects patient filter', () => {
      const state = useClaimsStore.getState()
      const patient = state.patients[0]
      const grouped = state.groupByStatus({ patient: patient.firstName })
      const total = Array.from(grouped.values()).reduce((sum, arr) => sum + arr.length, 0)
      const expected = state.claims.filter((c) => c.patientId === patient.id).length
      expect(total).toBe(expected)
    })
  })

  describe('resetToSeedData', () => {
    it('restores state to initial seed data', () => {
      const state = useClaimsStore.getState()
      const originalCount = state.claims.length

      // Mutate state
      const claim = state.claims.find((c) => c.status === 'Submitted')!
      state.postPayment(claim.id, {
        paymentAmount: 100,
        contractualAdjustment: 0,
        deductibleAmount: 0,
        otherAdjustment: 0,
        checkEftReference: 'X',
        remittanceDate: '2026-11-15',
      })

      // Reset
      useClaimsStore.getState().resetToSeedData()
      const reset = useClaimsStore.getState()

      expect(reset.claims.length).toBe(originalCount)
      const restored = reset.getClaimById(claim.id)!
      expect(restored.status).toBe('Submitted')
    })
  })
})
