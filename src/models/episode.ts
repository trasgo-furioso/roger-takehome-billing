export interface Episode {
  id: string
  patientId: string
  startDate: string
  endDate: string
  certifyingPhysicianName: string
  certifyingPhysicianNpi: string
  planOfCareSigned: boolean
}

export interface BillingPeriod {
  id: string
  episodeId: string
  patientId: string
  fromDate: string
  throughDate: string
  timing: 'Early' | 'Late'
}
