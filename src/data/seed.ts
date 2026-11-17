import type { Patient, Episode, BillingPeriod, Claim } from '@/models'

// 6 patients
export const seedPatients: Patient[] = [
  {
    id: 'p1',
    firstName: 'Margaret',
    lastName: 'Thompson',
    dateOfBirth: '1942-03-15',
    sex: 'F',
    address: { street: '124 Oak Lane', city: 'Springfield', state: 'IL', zip: '62701' },
    mbi: '1A9BC2D34EF',
    coverageActive: true,
  },
  {
    id: 'p2',
    firstName: 'Robert',
    lastName: 'Garcia',
    dateOfBirth: '1938-07-22',
    sex: 'M',
    address: { street: '890 Maple Dr', city: 'Chicago', state: 'IL', zip: '60601' },
    mbi: '2B8CD3E45FG',
    coverageActive: true,
  },
  {
    id: 'p3',
    firstName: 'Dorothy',
    lastName: 'Williams',
    dateOfBirth: '1945-11-08',
    sex: 'F',
    address: { street: '456 Pine St', city: 'Peoria', state: 'IL', zip: '61602' },
    mbi: '3C7DE4F56GH',
    coverageActive: true,
  },
  {
    id: 'p4',
    firstName: 'James',
    lastName: 'Anderson',
    dateOfBirth: '1940-01-30',
    sex: 'M',
    address: { street: '321 Elm Ave', city: 'Rockford', state: 'IL', zip: '61101' },
    mbi: '4D6EF5G67HI',
    coverageActive: true,
  },
  {
    id: 'p5',
    firstName: 'Helen',
    lastName: 'Martinez',
    dateOfBirth: '1948-09-12',
    sex: 'F',
    address: { street: '789 Cedar Blvd', city: 'Naperville', state: 'IL', zip: '60540' },
    mbi: '5E5FG6H78IJ',
    coverageActive: true,
  },
  {
    id: 'p6',
    firstName: 'William',
    lastName: 'Johnson',
    dateOfBirth: '1935-05-20',
    sex: 'M',
    address: { street: '567 Birch Rd', city: 'Champaign', state: 'IL', zip: '61820' },
    mbi: '6F4GH7I89JK',
    coverageActive: true,
  },
]

export const seedEpisodes: Episode[] = [
  { id: 'e1', patientId: 'p1', startDate: '2026-09-15', endDate: '2026-11-14', certifyingPhysicianName: 'Dr. Sarah Chen', certifyingPhysicianNpi: '1234567890', planOfCareSigned: true },
  { id: 'e2', patientId: 'p2', startDate: '2026-09-01', endDate: '2026-10-31', certifyingPhysicianName: 'Dr. Michael Brown', certifyingPhysicianNpi: '2345678901', planOfCareSigned: true },
  { id: 'e3', patientId: 'p3', startDate: '2026-08-20', endDate: '2026-10-19', certifyingPhysicianName: 'Dr. Emily Davis', certifyingPhysicianNpi: '3456789012', planOfCareSigned: true },
  { id: 'e4', patientId: 'p4', startDate: '2026-07-01', endDate: '2026-08-30', certifyingPhysicianName: 'Dr. James Wilson', certifyingPhysicianNpi: '4567890123', planOfCareSigned: true },
  { id: 'e5', patientId: 'p5', startDate: '2026-08-01', endDate: '2026-09-30', certifyingPhysicianName: 'Dr. Lisa Park', certifyingPhysicianNpi: '5678901234', planOfCareSigned: true },
  { id: 'e6', patientId: 'p6', startDate: '2026-06-01', endDate: '2026-07-31', certifyingPhysicianName: 'Dr. David Kim', certifyingPhysicianNpi: '6789012345', planOfCareSigned: true },
  { id: 'e7', patientId: 'p1', startDate: '2026-10-01', endDate: '2026-11-30', certifyingPhysicianName: 'Dr. Sarah Chen', certifyingPhysicianNpi: '1234567890', planOfCareSigned: true },
  { id: 'e8', patientId: 'p2', startDate: '2026-10-01', endDate: '2026-11-30', certifyingPhysicianName: 'Dr. Michael Brown', certifyingPhysicianNpi: '2345678901', planOfCareSigned: true },
  // Episode with unsigned POC for failing readiness
  { id: 'e9', patientId: 'p3', startDate: '2026-10-20', endDate: '2026-12-19', certifyingPhysicianName: 'Dr. Emily Davis', certifyingPhysicianNpi: '3456789012', planOfCareSigned: false },
]

export const seedBillingPeriods: BillingPeriod[] = [
  { id: 'bp1', episodeId: 'e1', patientId: 'p1', fromDate: '2026-09-15', throughDate: '2026-10-14', timing: 'Early' },
  { id: 'bp2', episodeId: 'e2', patientId: 'p2', fromDate: '2026-09-01', throughDate: '2026-09-30', timing: 'Early' },
  { id: 'bp3', episodeId: 'e3', patientId: 'p3', fromDate: '2026-08-20', throughDate: '2026-09-18', timing: 'Early' },
  { id: 'bp4', episodeId: 'e4', patientId: 'p4', fromDate: '2026-07-01', throughDate: '2026-07-30', timing: 'Early' },
  { id: 'bp5', episodeId: 'e5', patientId: 'p5', fromDate: '2026-08-01', throughDate: '2026-08-30', timing: 'Early' },
  { id: 'bp6', episodeId: 'e6', patientId: 'p6', fromDate: '2026-06-01', throughDate: '2026-06-30', timing: 'Early' },
  { id: 'bp7', episodeId: 'e1', patientId: 'p1', fromDate: '2026-10-15', throughDate: '2026-11-13', timing: 'Late' },
  { id: 'bp8', episodeId: 'e2', patientId: 'p2', fromDate: '2026-10-01', throughDate: '2026-10-30', timing: 'Late' },
  { id: 'bp9', episodeId: 'e7', patientId: 'p1', fromDate: '2026-10-01', throughDate: '2026-10-30', timing: 'Early' },
  { id: 'bp10', episodeId: 'e8', patientId: 'p2', fromDate: '2026-10-01', throughDate: '2026-10-30', timing: 'Early' },
  { id: 'bp11', episodeId: 'e3', patientId: 'p3', fromDate: '2026-09-19', throughDate: '2026-10-18', timing: 'Late' },
  { id: 'bp12', episodeId: 'e4', patientId: 'p4', fromDate: '2026-07-31', throughDate: '2026-08-29', timing: 'Late' },
  { id: 'bp13', episodeId: 'e5', patientId: 'p5', fromDate: '2026-08-31', throughDate: '2026-09-29', timing: 'Late' },
  { id: 'bp14', episodeId: 'e6', patientId: 'p6', fromDate: '2026-07-01', throughDate: '2026-07-30', timing: 'Late' },
  { id: 'bp15', episodeId: 'e9', patientId: 'p3', fromDate: '2026-10-20', throughDate: '2026-11-18', timing: 'Early' },
  // Extra periods for 18 claims
  { id: 'bp16', episodeId: 'e7', patientId: 'p1', fromDate: '2026-10-31', throughDate: '2026-11-29', timing: 'Late' },
  { id: 'bp17', episodeId: 'e4', patientId: 'p4', fromDate: '2026-07-01', throughDate: '2026-07-30', timing: 'Early' },
  { id: 'bp18', episodeId: 'e5', patientId: 'p5', fromDate: '2026-08-01', throughDate: '2026-08-30', timing: 'Early' },
]

function makeServiceLines(hippsCode: string | null): Claim['serviceLines'] {
  const lines: Claim['serviceLines'] = []
  if (hippsCode) {
    lines.push({ id: `sl-${Math.random().toString(36).slice(2, 8)}`, revenueCode: '0023', hcpcsCode: hippsCode, serviceFromDate: '2026-10-01', serviceThroughDate: '2026-10-30', units: 1, charges: 0 })
  }
  lines.push(
    { id: `sl-${Math.random().toString(36).slice(2, 8)}`, revenueCode: '0551', hcpcsCode: null, serviceFromDate: '2026-10-01', serviceThroughDate: '2026-10-15', units: 6, charges: 960 },
    { id: `sl-${Math.random().toString(36).slice(2, 8)}`, revenueCode: '0421', hcpcsCode: null, serviceFromDate: '2026-10-01', serviceThroughDate: '2026-10-20', units: 4, charges: 640 },
    { id: `sl-${Math.random().toString(36).slice(2, 8)}`, revenueCode: '0571', hcpcsCode: null, serviceFromDate: '2026-10-05', serviceThroughDate: '2026-10-25', units: 8, charges: 480 },
  )
  return lines
}

const allPassingReadiness: Claim['readiness'] = {
  oasisAccepted: true, planOfCareSigned: true, allVisitsDocumented: true,
  attendingPhysicianNpi: true, diagnosesCoded: true, hippsCodeGenerated: true,
  revenueCodesValid: true, allPassing: true,
}

const failingReadiness: Claim['readiness'] = {
  oasisAccepted: true, planOfCareSigned: false, allVisitsDocumented: true,
  attendingPhysicianNpi: true, diagnosesCoded: true, hippsCodeGenerated: true,
  revenueCodesValid: true, allPassing: false,
}

// 18 claims across all statuses
export const seedClaims: Claim[] = [
  // --- 3 Ready for Review (2 all-passing, 1 failing) ---
  {
    id: 'clm-001', billingPeriodId: 'bp9', patientId: 'p1', status: 'Ready for Review',
    typeOfBill: '032X', fromDate: '2026-10-01', throughDate: '2026-10-30',
    attendingPhysicianName: 'Dr. Sarah Chen', attendingPhysicianNpi: '1234567890',
    payerName: 'Medicare', payerId: 'MCR001', totalCharges: 4842, expectedAmount: 4200,
    hippsCode: '1AFKS', diagnoses: [
      { id: 'd1', icd10Code: 'I10', description: 'Essential (primary) hypertension', isPrincipal: true, sequence: 1 },
      { id: 'd2', icd10Code: 'E11.9', description: 'Type 2 diabetes mellitus without complications', isPrincipal: false, sequence: 2 },
    ],
    serviceLines: makeServiceLines('1AFKS'),
    readiness: allPassingReadiness,
    opiAssessment: { id: 'oa1', assessmentType: 'Start of Care', status: 'Accepted', completionDate: '2026-09-28' },
    submissionDate: null, rejectionReason: null, denialReason: null, remittance: null,
    timeline: [{ id: 'tl1', eventType: 'Created', timestamp: '2026-10-01T08:00:00Z', details: null }],
    createdAt: '2026-10-01T08:00:00Z', statusChangedAt: '2026-11-10T10:00:00Z',
  },
  {
    id: 'clm-002', billingPeriodId: 'bp10', patientId: 'p2', status: 'Ready for Review',
    typeOfBill: '032X', fromDate: '2026-10-01', throughDate: '2026-10-30',
    attendingPhysicianName: 'Dr. Michael Brown', attendingPhysicianNpi: '2345678901',
    payerName: 'Medicare', payerId: 'MCR001', totalCharges: 5120, expectedAmount: 4500,
    hippsCode: '2BGLT', diagnoses: [
      { id: 'd3', icd10Code: 'I50.9', description: 'Heart failure, unspecified', isPrincipal: true, sequence: 1 },
      { id: 'd4', icd10Code: 'I10', description: 'Essential (primary) hypertension', isPrincipal: false, sequence: 2 },
      { id: 'd5', icd10Code: 'E78.5', description: 'Dyslipidemia, unspecified', isPrincipal: false, sequence: 3 },
    ],
    serviceLines: makeServiceLines('2BGLT'),
    readiness: allPassingReadiness,
    opiAssessment: { id: 'oa2', assessmentType: 'Recertification', status: 'Accepted', completionDate: '2026-09-25' },
    submissionDate: null, rejectionReason: null, denialReason: null, remittance: null,
    timeline: [{ id: 'tl2', eventType: 'Created', timestamp: '2026-10-01T09:00:00Z', details: null }],
    createdAt: '2026-10-01T09:00:00Z', statusChangedAt: '2026-11-12T14:00:00Z',
  },
  {
    id: 'clm-003', billingPeriodId: 'bp15', patientId: 'p3', status: 'Ready for Review',
    typeOfBill: '032X', fromDate: '2026-10-20', throughDate: '2026-11-18',
    attendingPhysicianName: 'Dr. Emily Davis', attendingPhysicianNpi: '3456789012',
    payerName: 'Medicare', payerId: 'MCR001', totalCharges: 3900, expectedAmount: 3400,
    hippsCode: '3CHMU', diagnoses: [
      { id: 'd6', icd10Code: 'J44.1', description: 'COPD with acute exacerbation', isPrincipal: true, sequence: 1 },
    ],
    serviceLines: makeServiceLines('3CHMU'),
    readiness: failingReadiness, // Plan of Care not signed
    opiAssessment: { id: 'oa3', assessmentType: 'Start of Care', status: 'Accepted', completionDate: '2026-10-18' },
    submissionDate: null, rejectionReason: null, denialReason: null, remittance: null,
    timeline: [{ id: 'tl3', eventType: 'Created', timestamp: '2026-10-20T10:00:00Z', details: null }],
    createdAt: '2026-10-20T10:00:00Z', statusChangedAt: '2026-11-14T08:00:00Z',
  },

  // --- 4 Submitted (various ages: 5d, 25d, 50d, 95d) ---
  {
    id: 'clm-004', billingPeriodId: 'bp1', patientId: 'p1', status: 'Submitted',
    typeOfBill: '032X', fromDate: '2026-09-15', throughDate: '2026-10-14',
    attendingPhysicianName: 'Dr. Sarah Chen', attendingPhysicianNpi: '1234567890',
    payerName: 'Medicare', payerId: 'MCR001', totalCharges: 4500, expectedAmount: 3842,
    hippsCode: '1AFKS', diagnoses: [
      { id: 'd7', icd10Code: 'I10', description: 'Essential (primary) hypertension', isPrincipal: true, sequence: 1 },
      { id: 'd8', icd10Code: 'N18.3', description: 'Chronic kidney disease, stage 3', isPrincipal: false, sequence: 2 },
    ],
    serviceLines: makeServiceLines('1AFKS'),
    readiness: allPassingReadiness,
    opiAssessment: { id: 'oa4', assessmentType: 'Start of Care', status: 'Accepted', completionDate: '2026-09-13' },
    submissionDate: '2026-11-12T14:30:00Z', rejectionReason: null, denialReason: null, remittance: null,
    timeline: [
      { id: 'tl4a', eventType: 'Created', timestamp: '2026-09-15T08:00:00Z', details: null },
      { id: 'tl4b', eventType: 'Submitted', timestamp: '2026-11-12T14:30:00Z', details: null },
    ],
    createdAt: '2026-09-15T08:00:00Z', statusChangedAt: '2026-11-12T14:30:00Z', // ~5 days ago
  },
  {
    id: 'clm-005', billingPeriodId: 'bp2', patientId: 'p2', status: 'Submitted',
    typeOfBill: '032X', fromDate: '2026-09-01', throughDate: '2026-09-30',
    attendingPhysicianName: 'Dr. Michael Brown', attendingPhysicianNpi: '2345678901',
    payerName: 'Medicare', payerId: 'MCR001', totalCharges: 5200, expectedAmount: 4600,
    hippsCode: '2BGLT', diagnoses: [
      { id: 'd9', icd10Code: 'I63.9', description: 'Cerebral infarction, unspecified', isPrincipal: true, sequence: 1 },
    ],
    serviceLines: makeServiceLines('2BGLT'),
    readiness: allPassingReadiness,
    opiAssessment: { id: 'oa5', assessmentType: 'Start of Care', status: 'Accepted', completionDate: '2026-08-28' },
    submissionDate: '2026-10-23T10:00:00Z', rejectionReason: null, denialReason: null, remittance: null,
    timeline: [
      { id: 'tl5a', eventType: 'Created', timestamp: '2026-09-01T08:00:00Z', details: null },
      { id: 'tl5b', eventType: 'Submitted', timestamp: '2026-10-23T10:00:00Z', details: null },
    ],
    createdAt: '2026-09-01T08:00:00Z', statusChangedAt: '2026-10-23T10:00:00Z', // ~25 days
  },
  {
    id: 'clm-006', billingPeriodId: 'bp3', patientId: 'p3', status: 'Submitted',
    typeOfBill: '032X', fromDate: '2026-08-20', throughDate: '2026-09-18',
    attendingPhysicianName: 'Dr. Emily Davis', attendingPhysicianNpi: '3456789012',
    payerName: 'Medicare', payerId: 'MCR001', totalCharges: 3800, expectedAmount: 3200,
    hippsCode: '3CHMU', diagnoses: [
      { id: 'd10', icd10Code: 'M17.11', description: 'Primary osteoarthritis, right knee', isPrincipal: true, sequence: 1 },
    ],
    serviceLines: makeServiceLines('3CHMU'),
    readiness: allPassingReadiness,
    opiAssessment: { id: 'oa6', assessmentType: 'Start of Care', status: 'Accepted', completionDate: '2026-08-18' },
    submissionDate: '2026-09-28T09:00:00Z', rejectionReason: null, denialReason: null, remittance: null,
    timeline: [
      { id: 'tl6a', eventType: 'Created', timestamp: '2026-08-20T08:00:00Z', details: null },
      { id: 'tl6b', eventType: 'Submitted', timestamp: '2026-09-28T09:00:00Z', details: null },
    ],
    createdAt: '2026-08-20T08:00:00Z', statusChangedAt: '2026-09-28T09:00:00Z', // ~50 days
  },
  {
    id: 'clm-007', billingPeriodId: 'bp4', patientId: 'p4', status: 'Submitted',
    typeOfBill: '032X', fromDate: '2026-07-01', throughDate: '2026-07-30',
    attendingPhysicianName: 'Dr. James Wilson', attendingPhysicianNpi: '4567890123',
    payerName: 'Medicare', payerId: 'MCR001', totalCharges: 6100, expectedAmount: 5400,
    hippsCode: '4DINV', diagnoses: [
      { id: 'd11', icd10Code: 'S72.001A', description: 'Fracture of neck of right femur, initial', isPrincipal: true, sequence: 1 },
      { id: 'd12', icd10Code: 'Z96.641', description: 'Presence of right artificial hip joint', isPrincipal: false, sequence: 2 },
    ],
    serviceLines: makeServiceLines('4DINV'),
    readiness: allPassingReadiness,
    opiAssessment: { id: 'oa7', assessmentType: 'Start of Care', status: 'Accepted', completionDate: '2026-06-28' },
    submissionDate: '2026-08-14T11:00:00Z', rejectionReason: null, denialReason: null, remittance: null,
    timeline: [
      { id: 'tl7a', eventType: 'Created', timestamp: '2026-07-01T08:00:00Z', details: null },
      { id: 'tl7b', eventType: 'Submitted', timestamp: '2026-08-14T11:00:00Z', details: null },
    ],
    createdAt: '2026-07-01T08:00:00Z', statusChangedAt: '2026-08-14T11:00:00Z', // ~95 days
  },

  // --- 3 Rejected (different rejection codes) ---
  {
    id: 'clm-008', billingPeriodId: 'bp5', patientId: 'p5', status: 'Rejected',
    typeOfBill: '032X', fromDate: '2026-08-01', throughDate: '2026-08-30',
    attendingPhysicianName: 'Dr. Lisa Park', attendingPhysicianNpi: '5678901234',
    payerName: 'Medicare', payerId: 'MCR001', totalCharges: 4100, expectedAmount: 3600,
    hippsCode: '2BGLT', diagnoses: [
      { id: 'd13', icd10Code: 'G20', description: 'Parkinson disease', isPrincipal: true, sequence: 1 },
    ],
    serviceLines: makeServiceLines('2BGLT'),
    readiness: allPassingReadiness,
    opiAssessment: { id: 'oa8', assessmentType: 'Start of Care', status: 'Accepted', completionDate: '2026-07-28' },
    submissionDate: '2026-09-10T10:00:00Z',
    rejectionReason: { code: 'MISSING-NPI', description: 'Attending physician NPI is missing or invalid' },
    denialReason: null, remittance: null,
    timeline: [
      { id: 'tl8a', eventType: 'Created', timestamp: '2026-08-01T08:00:00Z', details: null },
      { id: 'tl8b', eventType: 'Submitted', timestamp: '2026-09-10T10:00:00Z', details: null },
      { id: 'tl8c', eventType: 'Rejected', timestamp: '2026-09-15T14:00:00Z', details: 'Attending physician NPI is missing or invalid' },
    ],
    createdAt: '2026-08-01T08:00:00Z', statusChangedAt: '2026-09-15T14:00:00Z',
  },
  {
    id: 'clm-009', billingPeriodId: 'bp6', patientId: 'p6', status: 'Rejected',
    typeOfBill: '032X', fromDate: '2026-06-01', throughDate: '2026-06-30',
    attendingPhysicianName: 'Dr. David Kim', attendingPhysicianNpi: '6789012345',
    payerName: 'Medicare', payerId: 'MCR001', totalCharges: 3500, expectedAmount: 2900,
    hippsCode: '1AFKS', diagnoses: [
      { id: 'd14', icd10Code: 'E11.9', description: 'Type 2 diabetes mellitus without complications', isPrincipal: true, sequence: 1 },
      { id: 'd15', icd10Code: 'Z79.4', description: 'Long term (current) use of insulin', isPrincipal: false, sequence: 2 },
    ],
    serviceLines: makeServiceLines('1AFKS'),
    readiness: allPassingReadiness,
    opiAssessment: { id: 'oa9', assessmentType: 'Start of Care', status: 'Accepted', completionDate: '2026-05-28' },
    submissionDate: '2026-07-15T09:00:00Z',
    rejectionReason: { code: 'DUP-CLAIM', description: 'Duplicate claim — a claim for this period was already processed' },
    denialReason: null, remittance: null,
    timeline: [
      { id: 'tl9a', eventType: 'Created', timestamp: '2026-06-01T08:00:00Z', details: null },
      { id: 'tl9b', eventType: 'Submitted', timestamp: '2026-07-15T09:00:00Z', details: null },
      { id: 'tl9c', eventType: 'Rejected', timestamp: '2026-07-20T16:00:00Z', details: 'Duplicate claim — a claim for this period was already processed' },
    ],
    createdAt: '2026-06-01T08:00:00Z', statusChangedAt: '2026-07-20T16:00:00Z',
  },
  {
    id: 'clm-010', billingPeriodId: 'bp7', patientId: 'p1', status: 'Rejected',
    typeOfBill: '032X', fromDate: '2026-10-15', throughDate: '2026-11-13',
    attendingPhysicianName: 'Dr. Sarah Chen', attendingPhysicianNpi: '1234567890',
    payerName: 'Medicare', payerId: 'MCR001', totalCharges: 4300, expectedAmount: 3700,
    hippsCode: '1AFKS', diagnoses: [
      { id: 'd16', icd10Code: 'I10', description: 'Essential (primary) hypertension', isPrincipal: true, sequence: 1 },
    ],
    serviceLines: makeServiceLines('1AFKS'),
    readiness: allPassingReadiness,
    opiAssessment: { id: 'oa10', assessmentType: 'Recertification', status: 'Accepted', completionDate: '2026-10-12' },
    submissionDate: '2026-11-01T10:00:00Z',
    rejectionReason: { code: 'INVALID-TOB', description: 'Type of Bill code is invalid for this claim type' },
    denialReason: null, remittance: null,
    timeline: [
      { id: 'tl10a', eventType: 'Created', timestamp: '2026-10-15T08:00:00Z', details: null },
      { id: 'tl10b', eventType: 'Submitted', timestamp: '2026-11-01T10:00:00Z', details: null },
      { id: 'tl10c', eventType: 'Rejected', timestamp: '2026-11-05T12:00:00Z', details: 'Type of Bill code is invalid for this claim type' },
    ],
    createdAt: '2026-10-15T08:00:00Z', statusChangedAt: '2026-11-05T12:00:00Z',
  },

  // --- 2 Denied (different CARC/RARC codes, one >90 days) ---
  {
    id: 'clm-011', billingPeriodId: 'bp8', patientId: 'p2', status: 'Denied',
    typeOfBill: '032X', fromDate: '2026-10-01', throughDate: '2026-10-30',
    attendingPhysicianName: 'Dr. Michael Brown', attendingPhysicianNpi: '2345678901',
    payerName: 'Medicare', payerId: 'MCR001', totalCharges: 5500, expectedAmount: 4800,
    hippsCode: '2BGLT', diagnoses: [
      { id: 'd17', icd10Code: 'I50.9', description: 'Heart failure, unspecified', isPrincipal: true, sequence: 1 },
    ],
    serviceLines: makeServiceLines('2BGLT'),
    readiness: allPassingReadiness,
    opiAssessment: { id: 'oa11', assessmentType: 'Start of Care', status: 'Accepted', completionDate: '2026-09-28' },
    submissionDate: '2026-10-20T10:00:00Z', rejectionReason: null,
    denialReason: { carcCode: 'CO-50', carcDescription: 'Non-covered service because it is not deemed a medical necessity.', rarcCode: 'N386', rarcDescription: 'This decision was based on a National Coverage Determination (NCD).', amountAtRisk: 4800, denialDate: '2026-10-30' },
    remittance: null,
    timeline: [
      { id: 'tl11a', eventType: 'Created', timestamp: '2026-10-01T08:00:00Z', details: null },
      { id: 'tl11b', eventType: 'Submitted', timestamp: '2026-10-20T10:00:00Z', details: null },
      { id: 'tl11c', eventType: 'Denied', timestamp: '2026-10-30T15:00:00Z', details: 'CO-50: Non-covered service — not deemed a medical necessity' },
    ],
    createdAt: '2026-10-01T08:00:00Z', statusChangedAt: '2026-10-30T15:00:00Z',
  },
  {
    id: 'clm-012', billingPeriodId: 'bp12', patientId: 'p4', status: 'Denied',
    typeOfBill: '032X', fromDate: '2026-07-31', throughDate: '2026-08-29',
    attendingPhysicianName: 'Dr. James Wilson', attendingPhysicianNpi: '4567890123',
    payerName: 'Medicare', payerId: 'MCR001', totalCharges: 4900, expectedAmount: 4200,
    hippsCode: '4DINV', diagnoses: [
      { id: 'd18', icd10Code: 'M79.3', description: 'Panniculitis, unspecified', isPrincipal: true, sequence: 1 },
    ],
    serviceLines: makeServiceLines('4DINV'),
    readiness: allPassingReadiness,
    opiAssessment: { id: 'oa12', assessmentType: 'Recertification', status: 'Accepted', completionDate: '2026-07-28' },
    submissionDate: '2026-08-20T09:00:00Z', rejectionReason: null,
    denialReason: { carcCode: 'CO-27', carcDescription: 'Expenses incurred after coverage terminated.', rarcCode: null, rarcDescription: null, amountAtRisk: 4200, denialDate: '2026-08-10' },
    remittance: null,
    timeline: [
      { id: 'tl12a', eventType: 'Created', timestamp: '2026-07-31T08:00:00Z', details: null },
      { id: 'tl12b', eventType: 'Submitted', timestamp: '2026-08-20T09:00:00Z', details: null },
      { id: 'tl12c', eventType: 'Denied', timestamp: '2026-08-10T14:00:00Z', details: 'CO-27: Expenses incurred after coverage terminated' },
    ],
    createdAt: '2026-07-31T08:00:00Z', statusChangedAt: '2026-08-10T14:00:00Z', // >90 days
  },

  // --- 4 Paid ---
  {
    id: 'clm-013', billingPeriodId: 'bp11', patientId: 'p3', status: 'Paid',
    typeOfBill: '032X', fromDate: '2026-09-19', throughDate: '2026-10-18',
    attendingPhysicianName: 'Dr. Emily Davis', attendingPhysicianNpi: '3456789012',
    payerName: 'Medicare', payerId: 'MCR001', totalCharges: 4200, expectedAmount: 3600,
    hippsCode: '3CHMU', diagnoses: [
      { id: 'd19', icd10Code: 'I10', description: 'Essential (primary) hypertension', isPrincipal: true, sequence: 1 },
    ],
    serviceLines: makeServiceLines('3CHMU'),
    readiness: allPassingReadiness,
    opiAssessment: { id: 'oa13', assessmentType: 'Recertification', status: 'Accepted', completionDate: '2026-09-16' },
    submissionDate: '2026-10-25T10:00:00Z', rejectionReason: null, denialReason: null,
    remittance: { paymentAmount: 3400, contractualAdjustment: 200, deductibleAmount: 0, otherAdjustment: 0, checkEftReference: 'EFT-20261101-001', remittanceDate: '2026-11-01' },
    timeline: [
      { id: 'tl13a', eventType: 'Created', timestamp: '2026-09-19T08:00:00Z', details: null },
      { id: 'tl13b', eventType: 'Submitted', timestamp: '2026-10-25T10:00:00Z', details: null },
      { id: 'tl13c', eventType: 'Paid', timestamp: '2026-11-01T16:00:00Z', details: 'Payment received: $3,400.00' },
    ],
    createdAt: '2026-09-19T08:00:00Z', statusChangedAt: '2026-11-01T16:00:00Z',
  },
  {
    id: 'clm-014', billingPeriodId: 'bp13', patientId: 'p5', status: 'Paid',
    typeOfBill: '032X', fromDate: '2026-08-31', throughDate: '2026-09-29',
    attendingPhysicianName: 'Dr. Lisa Park', attendingPhysicianNpi: '5678901234',
    payerName: 'Medicare', payerId: 'MCR001', totalCharges: 3900, expectedAmount: 3300,
    hippsCode: '2BGLT', diagnoses: [
      { id: 'd20', icd10Code: 'G20', description: 'Parkinson disease', isPrincipal: true, sequence: 1 },
      { id: 'd21', icd10Code: 'I10', description: 'Essential (primary) hypertension', isPrincipal: false, sequence: 2 },
    ],
    serviceLines: makeServiceLines('2BGLT'),
    readiness: allPassingReadiness,
    opiAssessment: { id: 'oa14', assessmentType: 'Recertification', status: 'Accepted', completionDate: '2026-08-28' },
    submissionDate: '2026-10-05T09:00:00Z', rejectionReason: null, denialReason: null,
    remittance: { paymentAmount: 3300, contractualAdjustment: 0, deductibleAmount: 0, otherAdjustment: 0, checkEftReference: 'EFT-20261020-002', remittanceDate: '2026-10-20' },
    timeline: [
      { id: 'tl14a', eventType: 'Created', timestamp: '2026-08-31T08:00:00Z', details: null },
      { id: 'tl14b', eventType: 'Submitted', timestamp: '2026-10-05T09:00:00Z', details: null },
      { id: 'tl14c', eventType: 'Paid', timestamp: '2026-10-20T12:00:00Z', details: 'Payment received: $3,300.00' },
    ],
    createdAt: '2026-08-31T08:00:00Z', statusChangedAt: '2026-10-20T12:00:00Z',
  },
  {
    id: 'clm-015', billingPeriodId: 'bp14', patientId: 'p6', status: 'Paid',
    typeOfBill: '032X', fromDate: '2026-07-01', throughDate: '2026-07-30',
    attendingPhysicianName: 'Dr. David Kim', attendingPhysicianNpi: '6789012345',
    payerName: 'Medicare', payerId: 'MCR001', totalCharges: 4800, expectedAmount: 4100,
    hippsCode: '1AFKS', diagnoses: [
      { id: 'd22', icd10Code: 'J44.1', description: 'COPD with acute exacerbation', isPrincipal: true, sequence: 1 },
    ],
    serviceLines: makeServiceLines('1AFKS'),
    readiness: allPassingReadiness,
    opiAssessment: { id: 'oa15', assessmentType: 'Start of Care', status: 'Accepted', completionDate: '2026-06-28' },
    submissionDate: '2026-08-05T10:00:00Z', rejectionReason: null, denialReason: null,
    remittance: { paymentAmount: 3900, contractualAdjustment: 200, deductibleAmount: 0, otherAdjustment: 0, checkEftReference: 'CHK-20260820-003', remittanceDate: '2026-08-20' },
    timeline: [
      { id: 'tl15a', eventType: 'Created', timestamp: '2026-07-01T08:00:00Z', details: null },
      { id: 'tl15b', eventType: 'Submitted', timestamp: '2026-08-05T10:00:00Z', details: null },
      { id: 'tl15c', eventType: 'Paid', timestamp: '2026-08-20T15:00:00Z', details: 'Payment received: $3,900.00' },
    ],
    createdAt: '2026-07-01T08:00:00Z', statusChangedAt: '2026-08-20T15:00:00Z',
  },
  // Paid claim with multi-step timeline (submitted → rejected → resubmitted → paid)
  {
    id: 'clm-016', billingPeriodId: 'bp16', patientId: 'p1', status: 'Paid',
    typeOfBill: '032X', fromDate: '2026-10-31', throughDate: '2026-11-29',
    attendingPhysicianName: 'Dr. Sarah Chen', attendingPhysicianNpi: '1234567890',
    payerName: 'Medicare', payerId: 'MCR001', totalCharges: 4600, expectedAmount: 4000,
    hippsCode: '1AFKS', diagnoses: [
      { id: 'd23', icd10Code: 'I10', description: 'Essential (primary) hypertension', isPrincipal: true, sequence: 1 },
      { id: 'd24', icd10Code: 'E11.9', description: 'Type 2 diabetes mellitus without complications', isPrincipal: false, sequence: 2 },
    ],
    serviceLines: makeServiceLines('1AFKS'),
    readiness: allPassingReadiness,
    opiAssessment: { id: 'oa16', assessmentType: 'Recertification', status: 'Accepted', completionDate: '2026-10-28' },
    submissionDate: '2026-10-10T09:00:00Z', rejectionReason: null, denialReason: null,
    remittance: { paymentAmount: 3800, contractualAdjustment: 200, deductibleAmount: 0, otherAdjustment: 0, checkEftReference: 'EFT-20261105-004', remittanceDate: '2026-11-05' },
    timeline: [
      { id: 'tl16a', eventType: 'Created', timestamp: '2026-09-15T08:00:00Z', details: null },
      { id: 'tl16b', eventType: 'Submitted', timestamp: '2026-09-20T10:00:00Z', details: null },
      { id: 'tl16c', eventType: 'Rejected', timestamp: '2026-09-25T14:00:00Z', details: 'Missing patient MBI' },
      { id: 'tl16d', eventType: 'Resubmitted', timestamp: '2026-10-10T09:00:00Z', details: null },
      { id: 'tl16e', eventType: 'Paid', timestamp: '2026-11-05T16:00:00Z', details: 'Payment received: $3,800.00' },
    ],
    createdAt: '2026-09-15T08:00:00Z', statusChangedAt: '2026-11-05T16:00:00Z',
  },

  // --- 2 Written Off ---
  {
    id: 'clm-017', billingPeriodId: 'bp17', patientId: 'p4', status: 'Written Off',
    typeOfBill: '032X', fromDate: '2026-07-01', throughDate: '2026-07-30',
    attendingPhysicianName: 'Dr. James Wilson', attendingPhysicianNpi: '4567890123',
    payerName: 'Medicare', payerId: 'MCR001', totalCharges: 3200, expectedAmount: 2700,
    hippsCode: '4DINV', diagnoses: [
      { id: 'd25', icd10Code: 'M79.3', description: 'Panniculitis, unspecified', isPrincipal: true, sequence: 1 },
    ],
    serviceLines: makeServiceLines('4DINV'),
    readiness: allPassingReadiness,
    opiAssessment: { id: 'oa17', assessmentType: 'Start of Care', status: 'Accepted', completionDate: '2026-06-28' },
    submissionDate: '2026-08-01T10:00:00Z', rejectionReason: null,
    denialReason: { carcCode: 'CO-29', carcDescription: 'The time limit for filing has expired.', rarcCode: null, rarcDescription: null, amountAtRisk: 2700, denialDate: '2026-08-15' },
    remittance: null,
    timeline: [
      { id: 'tl17a', eventType: 'Created', timestamp: '2026-07-01T08:00:00Z', details: null },
      { id: 'tl17b', eventType: 'Submitted', timestamp: '2026-08-01T10:00:00Z', details: null },
      { id: 'tl17c', eventType: 'Denied', timestamp: '2026-08-15T14:00:00Z', details: 'CO-29: Time limit for filing expired' },
      { id: 'tl17d', eventType: 'Written Off', timestamp: '2026-09-01T09:00:00Z', details: null },
    ],
    createdAt: '2026-07-01T08:00:00Z', statusChangedAt: '2026-09-01T09:00:00Z',
  },
  {
    id: 'clm-018', billingPeriodId: 'bp18', patientId: 'p5', status: 'Written Off',
    typeOfBill: '032X', fromDate: '2026-08-01', throughDate: '2026-08-30',
    attendingPhysicianName: 'Dr. Lisa Park', attendingPhysicianNpi: '5678901234',
    payerName: 'Medicare', payerId: 'MCR001', totalCharges: 2800, expectedAmount: 2300,
    hippsCode: '2BGLT', diagnoses: [
      { id: 'd26', icd10Code: 'G20', description: 'Parkinson disease', isPrincipal: true, sequence: 1 },
    ],
    serviceLines: makeServiceLines('2BGLT'),
    readiness: allPassingReadiness,
    opiAssessment: { id: 'oa18', assessmentType: 'Recertification', status: 'Accepted', completionDate: '2026-07-28' },
    submissionDate: '2026-09-01T10:00:00Z', rejectionReason: null,
    denialReason: { carcCode: 'CO-16', carcDescription: 'Claim/service lacks information or has submission/billing error(s).', rarcCode: 'MA130', rarcDescription: 'Your claim contains incomplete and/or invalid information.', amountAtRisk: 2300, denialDate: '2026-09-10' },
    remittance: null,
    timeline: [
      { id: 'tl18a', eventType: 'Created', timestamp: '2026-08-01T08:00:00Z', details: null },
      { id: 'tl18b', eventType: 'Submitted', timestamp: '2026-09-01T10:00:00Z', details: null },
      { id: 'tl18c', eventType: 'Denied', timestamp: '2026-09-10T15:00:00Z', details: 'CO-16: Claim lacks information or has billing errors' },
      { id: 'tl18d', eventType: 'Written Off', timestamp: '2026-09-20T10:00:00Z', details: null },
    ],
    createdAt: '2026-08-01T08:00:00Z', statusChangedAt: '2026-09-20T10:00:00Z',
  },
]

export const seedData = {
  patients: seedPatients,
  episodes: seedEpisodes,
  billingPeriods: seedBillingPeriods,
  claims: seedClaims,
}
