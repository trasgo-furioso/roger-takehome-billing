# Data Model: Home Health Billing Manager

**Feature**: 001-billing-manager | **Date**: 2026-11-17

## Entity Relationship Overview

```
Patient 1──* Episode 1──* BillingPeriod 1──1 Claim 1──* ServiceLine
                                              │  1──* Diagnosis
                                              │  1──* TimelineEvent
                                              │  1──? Remittance
                                              │  1──1 ReadinessCheck
                                              └──1 OasisAssessment
```

## Entities

### Patient

| Field | Type | Description |
|---|---|---|
| id | `string` | Unique patient identifier |
| firstName | `string` | Patient first name |
| lastName | `string` | Patient last name |
| dateOfBirth | `string` (ISO date) | Date of birth |
| sex | `'M' \| 'F'` | Biological sex |
| address | `Address` | Street, city, state, zip |
| mbi | `string` | Medicare Beneficiary Identifier (11 chars) |
| coverageActive | `boolean` | Whether Medicare coverage is currently active |

**Validation**:
- MBI format: 1 digit, 1 alpha, 1 alphanumeric, 1 digit, 1 alpha, 1 alphanumeric, 1 digit, 2 alpha, 2 digits
- All name fields required, non-empty

### Episode (Certification Period)

| Field | Type | Description |
|---|---|---|
| id | `string` | Unique episode identifier |
| patientId | `string` | FK to Patient |
| startDate | `string` (ISO date) | Episode start date |
| endDate | `string` (ISO date) | Episode end date (startDate + 60 days) |
| certifyingPhysicianName | `string` | Certifying physician name |
| certifyingPhysicianNpi | `string` | 10-digit NPI |
| planOfCareSigned | `boolean` | Whether Form 485 is signed |

**Validation**:
- endDate must be exactly startDate + 60 days
- NPI: exactly 10 digits

### BillingPeriod

| Field | Type | Description |
|---|---|---|
| id | `string` | Unique billing period identifier |
| episodeId | `string` | FK to Episode |
| patientId | `string` | FK to Patient |
| fromDate | `string` (ISO date) | Period start date |
| throughDate | `string` (ISO date) | Period end date (fromDate + 29 days) |
| timing | `'Early' \| 'Late'` | 1st or 2nd 30-day period within episode |

**Validation**:
- throughDate must be exactly fromDate + 29 days
- "Early" = first 30 days of episode, "Late" = second 30 days

### Claim

The central entity. Represents one UB-04/837I institutional claim for a 30-day billing period.

| Field | Type | Description |
|---|---|---|
| id | `string` | Unique claim identifier |
| billingPeriodId | `string` | FK to BillingPeriod |
| patientId | `string` | FK to Patient |
| status | `ClaimStatus` | Current lifecycle status |
| typeOfBill | `string` | Always `'032X'` for HHA |
| fromDate | `string` (ISO date) | Service period start |
| throughDate | `string` (ISO date) | Service period end |
| attendingPhysicianName | `string` | Attending physician name |
| attendingPhysicianNpi | `string` | Attending physician NPI |
| payerName | `string` | Payer name (e.g., "Medicare") |
| payerId | `string` | Payer identifier |
| totalCharges | `number` | Sum of all service line charges |
| expectedAmount | `number` | Expected reimbursement amount |
| hippsCode | `string \| null` | 5-char HIPPS code on revenue line 0023 |
| diagnoses | `Diagnosis[]` | Principal + secondary diagnoses |
| serviceLines | `ServiceLine[]` | Revenue code line items |
| readiness | `ReadinessCheck` | Readiness checklist state |
| opiAssessment | `OasisAssessment` | Linked OASIS assessment |
| submissionDate | `string \| null` (ISO datetime) | When claim was submitted |
| rejectionReason | `RejectionReason \| null` | If rejected |
| denialReason | `DenialReason \| null` | If denied |
| remittance | `Remittance \| null` | Payment details if paid |
| timeline | `TimelineEvent[]` | Audit log of state transitions |
| createdAt | `string` (ISO datetime) | Claim creation timestamp |
| statusChangedAt | `string` (ISO datetime) | Last status change timestamp |

### ClaimStatus (Enum)

```typescript
type ClaimStatus =
  | 'Ready for Review'
  | 'Submitted'
  | 'Rejected'
  | 'Denied'
  | 'Paid'
  | 'Written Off'
```

### State Transitions

```
Ready for Review ──[Submit]──> Submitted
Submitted ──[Pay]──────────> Paid
Submitted ──[Reject]───────> Rejected
Submitted ──[Deny]─────────> Denied
Rejected ──[Fix+Submit]───> Submitted
Denied ──[Appeal+Submit]──> Submitted
Denied ──[Write Off]──────> Written Off
```

**Transition rules**:
- `Ready for Review → Submitted`: All readiness checks must pass
- `Submitted → Paid`: Requires payment amount and adjustment data
- `Submitted → Rejected`: System sets rejectionReason
- `Submitted → Denied`: System sets denialReason
- `Rejected → Submitted`: All readiness checks must pass (re-validated after corrections)
- `Denied → Submitted`: All readiness checks must pass (re-validated after corrections)
- `Denied → Written Off`: Always allowed

### ServiceLine

| Field | Type | Description |
|---|---|---|
| id | `string` | Unique line identifier |
| revenueCode | `string` | 4-digit revenue code (e.g., "0551", "0421", "0023") |
| revenueCodeDescription | `string` | Plain-language description |
| hcpcsCode | `string \| null` | HCPCS code or HIPPS code (for rev 0023) |
| serviceFromDate | `string` (ISO date) | Service start date |
| serviceThroughDate | `string` (ISO date) | Service end date |
| units | `number` | Number of units |
| charges | `number` | Dollar amount for this line |

### Diagnosis

| Field | Type | Description |
|---|---|---|
| id | `string` | Unique diagnosis identifier |
| icd10Code | `string` | ICD-10-CM code (e.g., "I10", "E11.9") |
| description | `string` | Plain-language description |
| isPrincipal | `boolean` | True for the principal diagnosis |
| sequence | `number` | Display order (1 = principal) |

**Validation**:
- Exactly one diagnosis must have `isPrincipal: true`
- Principal diagnosis must have `sequence: 1`

### ReadinessCheck

| Field | Type | Description |
|---|---|---|
| oasisAccepted | `boolean` | OASIS assessment submitted and accepted |
| planOfCareSigned | `boolean` | Physician-signed Plan of Care on file |
| allVisitsDocumented | `boolean` | All visits in period have completed documentation |
| attendingPhysicianNpi | `boolean` | Attending physician NPI on file |
| diagnosesCoded | `boolean` | At least one diagnosis with ICD-10 code |
| hippsCodeGenerated | `boolean` | HIPPS code generated on revenue line 0023 |
| revenueCodesValid | `boolean` | All revenue codes are valid for HHA claims |

**Computed**:
- `allPassing`: All 7 fields are `true`

### OasisAssessment

| Field | Type | Description |
|---|---|---|
| id | `string` | Assessment identifier |
| assessmentType | `string` | e.g., "Start of Care", "Recertification" |
| status | `'Pending' \| 'Submitted' \| 'Accepted' \| 'Rejected'` | Submission status |
| completionDate | `string \| null` (ISO date) | Date completed |

### RejectionReason

| Field | Type | Description |
|---|---|---|
| code | `string` | Rejection reason code |
| description | `string` | Plain-language description |

### DenialReason

| Field | Type | Description |
|---|---|---|
| carcCode | `string` | Claim Adjustment Reason Code |
| carcDescription | `string` | CARC plain-language description |
| rarcCode | `string \| null` | Remittance Advice Remark Code |
| rarcDescription | `string \| null` | RARC plain-language description |
| amountAtRisk | `number` | Dollar amount at risk of non-payment |
| denialDate | `string` (ISO date) | Date denial was received |

### Remittance (Payment)

| Field | Type | Description |
|---|---|---|
| paymentAmount | `number` | Amount paid |
| contractualAdjustment | `number` | Contractual adjustment amount |
| deductibleAmount | `number` | Patient deductible amount |
| otherAdjustment | `number` | Other adjustment amount |
| checkEftReference | `string` | Check or EFT reference number |
| remittanceDate | `string` (ISO date) | Date payment was received |

### TimelineEvent

| Field | Type | Description |
|---|---|---|
| id | `string` | Unique event identifier |
| eventType | `TimelineEventType` | What happened |
| timestamp | `string` (ISO datetime) | When it happened |
| details | `string \| null` | Contextual info (rejection reason, payment amount, etc.) |

```typescript
type TimelineEventType =
  | 'Created'
  | 'Submitted'
  | 'Accepted'
  | 'Rejected'
  | 'Denied'
  | 'Resubmitted'
  | 'Paid'
  | 'Written Off'
  | 'Edited'
```

### Address

| Field | Type | Description |
|---|---|---|
| street | `string` | Street address |
| city | `string` | City |
| state | `string` | 2-letter state code |
| zip | `string` | 5-digit ZIP code |

## Computed / Derived Values

These are not stored but computed at render time:

| Value | Derivation |
|---|---|
| `daysInCurrentStatus` | `today - claim.statusChangedAt` |
| `daysSinceDenial` | `today - claim.denialReason.denialDate` |
| `arAgingBucket` | Based on `daysInCurrentStatus`: 0-30, 31-60, 61-90, 90+ |
| `readiness.allPassing` | All 7 readiness booleans are `true` |
| `cardAction` | Determined by status + readiness (see state transitions) |
| `dashboardCounts` | Aggregated from claims array by status and aging bucket |
| `outstandingAR` | Sum of `expectedAmount` for non-terminal claims |
