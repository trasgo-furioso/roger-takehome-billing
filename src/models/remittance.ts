export interface Remittance {
  paymentAmount: number
  contractualAdjustment: number
  deductibleAmount: number
  otherAdjustment: number
  checkEftReference: string
  claimControlNumber: string
  remittanceDate: string
}

export interface RejectionReason {
  code: string
  description: string
}

export interface DenialReason {
  carcCode: string
  carcDescription: string
  rarcCode: string | null
  rarcDescription: string | null
  amountAtRisk: number
  denialDate: string
  appealDeadlineDate: string
}
