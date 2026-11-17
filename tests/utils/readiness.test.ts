import { describe, it, expect } from 'vitest'
import { computeReadiness } from '@/utils/readiness'
import type { Claim, Episode } from '@/models'

function makeClaim(overrides: Partial<Claim> = {}): Claim {
  return {
    id: 'c1',
    billingPeriodId: 'bp1',
    patientId: 'p1',
    status: 'Ready for Review',
    typeOfBill: '032X',
    fromDate: '2026-10-01',
    throughDate: '2026-10-30',
    attendingPhysicianName: 'Dr. Smith',
    attendingPhysicianNpi: '1234567890',
    payerName: 'Medicare',
    payerId: 'MCR001',
    totalCharges: 5000,
    expectedAmount: 4200,
    hippsCode: '1AFKS',
    diagnoses: [
      { id: 'd1', icd10Code: 'I10', description: 'Hypertension', isPrincipal: true, sequence: 1 },
    ],
    serviceLines: [
      { id: 'sl1', revenueCode: '0023', hcpcsCode: '1AFKS', serviceFromDate: '2026-10-01', serviceThroughDate: '2026-10-30', units: 1, charges: 4200 },
      { id: 'sl2', revenueCode: '0551', hcpcsCode: null, serviceFromDate: '2026-10-01', serviceThroughDate: '2026-10-15', units: 6, charges: 800 },
    ],
    readiness: { oasisAccepted: true, planOfCareSigned: true, allVisitsDocumented: true, attendingPhysicianNpi: true, diagnosesCoded: true, hippsCodeGenerated: true, revenueCodesValid: true, allPassing: true },
    opiAssessment: { id: 'oa1', assessmentType: 'Start of Care', status: 'Accepted', completionDate: '2026-09-28' },
    submissionDate: null,
    rejectionReason: null,
    denialReason: null,
    remittance: null,
    timeline: [],
    createdAt: '2026-10-01T00:00:00Z',
    statusChangedAt: '2026-10-01T00:00:00Z',
    ...overrides,
  }
}

function makeEpisode(overrides: Partial<Episode> = {}): Episode {
  return {
    id: 'e1',
    patientId: 'p1',
    startDate: '2026-10-01',
    endDate: '2026-11-30',
    certifyingPhysicianName: 'Dr. Jones',
    certifyingPhysicianNpi: '0987654321',
    planOfCareSigned: true,
    ...overrides,
  }
}

// T010: Readiness computation
describe('computeReadiness', () => {
  it('OASIS Accepted → oasisAccepted: true', () => {
    const result = computeReadiness(makeClaim(), makeEpisode())
    expect(result.oasisAccepted).toBe(true)
  })

  it('OASIS Pending → oasisAccepted: false', () => {
    const result = computeReadiness(
      makeClaim({ opiAssessment: { id: 'oa1', assessmentType: 'Start of Care', status: 'Pending', completionDate: null } }),
      makeEpisode(),
    )
    expect(result.oasisAccepted).toBe(false)
  })

  it('planOfCareSigned from episode', () => {
    const result = computeReadiness(makeClaim(), makeEpisode({ planOfCareSigned: true }))
    expect(result.planOfCareSigned).toBe(true)

    const result2 = computeReadiness(makeClaim(), makeEpisode({ planOfCareSigned: false }))
    expect(result2.planOfCareSigned).toBe(false)
  })

  it('non-empty NPI → attendingPhysicianNpi: true', () => {
    const result = computeReadiness(makeClaim({ attendingPhysicianNpi: '1234567890' }), makeEpisode())
    expect(result.attendingPhysicianNpi).toBe(true)
  })

  it('empty NPI → attendingPhysicianNpi: false', () => {
    const result = computeReadiness(makeClaim({ attendingPhysicianNpi: '' }), makeEpisode())
    expect(result.attendingPhysicianNpi).toBe(false)
  })

  it('at least one diagnosis → diagnosesCoded: true', () => {
    const result = computeReadiness(makeClaim(), makeEpisode())
    expect(result.diagnosesCoded).toBe(true)
  })

  it('no diagnoses → diagnosesCoded: false', () => {
    const result = computeReadiness(makeClaim({ diagnoses: [] }), makeEpisode())
    expect(result.diagnosesCoded).toBe(false)
  })

  it('HIPPS code on rev 0023 → hippsCodeGenerated: true', () => {
    const result = computeReadiness(makeClaim(), makeEpisode())
    expect(result.hippsCodeGenerated).toBe(true)
  })

  it('no HIPPS code → hippsCodeGenerated: false', () => {
    const result = computeReadiness(makeClaim({ hippsCode: null }), makeEpisode())
    expect(result.hippsCodeGenerated).toBe(false)
  })

  it('all revenue codes valid → revenueCodesValid: true', () => {
    const result = computeReadiness(makeClaim(), makeEpisode())
    expect(result.revenueCodesValid).toBe(true)
  })

  it('invalid revenue code → revenueCodesValid: false', () => {
    const claim = makeClaim({
      serviceLines: [
        { id: 'sl1', revenueCode: '9999', hcpcsCode: null, serviceFromDate: '2026-10-01', serviceThroughDate: '2026-10-30', units: 1, charges: 100 },
      ],
    })
    const result = computeReadiness(claim, makeEpisode())
    expect(result.revenueCodesValid).toBe(false)
  })

  it('allPassing is true only when all 7 booleans are true', () => {
    const result = computeReadiness(makeClaim(), makeEpisode())
    expect(result.allPassing).toBe(true)
  })

  it('allPassing is false when any boolean is false', () => {
    const result = computeReadiness(makeClaim({ attendingPhysicianNpi: '' }), makeEpisode())
    expect(result.allPassing).toBe(false)
  })
})
