import type { DenialReason, RejectionReason, Remittance } from './remittance'
import type { TimelineEvent } from './timeline'

export type ClaimStatus =
  | 'Ready for Review'
  | 'Submitted'
  | 'Rejected'
  | 'Denied'
  | 'Paid'
  | 'Written Off'

export interface ServiceLine {
  id: string
  revenueCode: string
  hcpcsCode: string | null
  serviceFromDate: string
  serviceThroughDate: string
  units: number
  charges: number
}

export interface Diagnosis {
  id: string
  icd10Code: string
  description: string
  isPrincipal: boolean
  sequence: number
}

export interface ReadinessCheck {
  oasisAccepted: boolean
  planOfCareSigned: boolean
  allVisitsDocumented: boolean
  attendingPhysicianNpi: boolean
  diagnosesCoded: boolean
  hippsCodeGenerated: boolean
  revenueCodesValid: boolean
  allPassing: boolean
}

export interface OasisAssessment {
  id: string
  assessmentType: string
  status: 'Pending' | 'Submitted' | 'Accepted' | 'Rejected'
  completionDate: string | null
}

export interface Claim {
  id: string
  billingPeriodId: string
  patientId: string
  status: ClaimStatus
  typeOfBill: string
  fromDate: string
  throughDate: string
  attendingPhysicianName: string
  attendingPhysicianNpi: string
  payerName: string
  payerId: string
  totalCharges: number
  expectedAmount: number
  hippsCode: string | null
  diagnoses: Diagnosis[]
  serviceLines: ServiceLine[]
  readiness: ReadinessCheck
  opiAssessment: OasisAssessment
  submissionDate: string | null
  rejectionReason: RejectionReason | null
  denialReason: DenialReason | null
  remittance: Remittance | null
  timeline: TimelineEvent[]
  createdAt: string
  statusChangedAt: string
}
