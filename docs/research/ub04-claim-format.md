# UB-04 / CMS-1450 Claim Format

## Overview

The UB-04 (also called CMS-1450) is the standard paper form used by institutional providers — hospitals, skilled nursing facilities, and home health agencies — to bill insurance payers. The **837I** (Institutional) is its electronic equivalent, used for HIPAA-compliant electronic claim submission.

For home health agencies billing Medicare, every 30-day period of care generates one 837I claim containing all visits and services for that period.

## Type of Bill for Home Health

The Type of Bill (FL 4) is a 4-digit code. For home health:

```
0  3  2  X
│  │  │  └── Frequency (X = sequence digit)
│  │  └───── Classification: Home Health (non-hospice)
│  └──────── Type of Facility: Home Health
└─────────── Leading zero (ignored by CMS)
```

| Code | Meaning |
|------|---------|
| **0321** | Admit through discharge (single period, complete episode) |
| **0322** | Interim — first claim (first 30-day period) |
| **0323** | Interim — continuing claim (subsequent period) |
| **0324** | Interim — last claim (final period before discharge) |
| **0329** | Adjustment of prior claim |

## Form Locators — Home Health Essentials

The UB-04 has 81 Form Locators (FLs). Below are the ones most relevant to home health billing, organized by section.

### Provider Information

| FL | Name | Required | Content |
|----|------|----------|---------|
| **1** | Billing Provider | Yes | Agency name, address, ZIP, phone |
| **4** | Type of Bill | Yes | 032X (see above) |
| **5** | Federal Tax Number | Yes | Agency EIN (NN-NNNNNNN) |
| **56** | Billing Provider NPI | Yes | Agency's 10-digit NPI |

### Dates & Period

| FL | Name | Required | Content |
|----|------|----------|---------|
| **6** | Statement Covers Period | Yes | From/Through dates of the 30-day period (MMDDYY) |
| **12** | Admission / Start of Care | Yes | SOC date — same as submitted on the initial assessment |

### Patient Information

| FL | Name | Required | Content |
|----|------|----------|---------|
| **8** | Patient Name | Yes | Last, First, MI |
| **9** | Patient Address | Yes | Street, city, state, ZIP |
| **10** | Patient Birth Date | Yes | MMDDCCYY |
| **11** | Patient Sex | Yes | M or F |
| **17** | Patient Discharge Status | Yes | Status as of the "through" date (e.g., 01=discharged home, 30=still patient) |

### Condition Codes (FL 18-28)

Situational codes that describe special circumstances. Home health examples:

| Code | Meaning |
|------|---------|
| **07** | Treatment of nonterminal condition for hospice patient |
| **D4** | Patient is HMO enrollee |
| **DR** | Disaster-related claim |

### Occurrence Codes & Dates (FL 31-34)

Situational. Record specific events related to the billing period.

| Code | Meaning |
|------|---------|
| **27** | Date of hospice certification or recertification |
| **A3** | Benefits exhausted |

### Value Codes & Amounts (FL 39-41)

Required. Report monetary or unit values needed for processing.

| Code | Meaning |
|------|---------|
| **61** | MSP amount — primary payer payment |
| **17** | Outlier amount |
| **A1** | Deductible payer A |
| **A2** | Coinsurance payer A |

### Revenue Codes & Service Lines (FL 42-49)

This is the heart of the claim — each line represents a category of services provided during the period.

| FL | Name | Content |
|----|------|---------|
| **42** | Revenue Code | 4-digit code identifying the service category |
| **43** | Revenue Description | Narrative or HCPCS description |
| **44** | HCPCS / HIPPS Code | Procedure code or HIPPS rate code |
| **45** | Service Date | Date of each visit (MMDDYY) |
| **46** | Units of Service | Number of visits or units |
| **47** | Total Charges | Charges for this revenue line |
| **48** | Non-Covered Charges | Charges not covered by this payer |

#### Common Home Health Revenue Codes

| Revenue Code | Description |
|-------------|-------------|
| **0023** | Prospective payment — used for the HIPPS code line |
| **0270** | Medical/surgical supplies |
| **0421** | Physical therapy (PT) — visits |
| **0431** | Occupational therapy (OT) — visits |
| **0441** | Speech-language pathology (SLP) — visits |
| **0551** | Skilled nursing (SN) — visits |
| **0571** | Home health aide (HHA) — visits |
| **0572** | Home health aide — hourly |
| **0623** | Surgical dressings |
| **0001** | Total — grand total of all charges (always last line) |

#### The HIPPS Code Line

One special revenue line uses revenue code **0023** with the **HIPPS rate code** in FL 44. This line communicates the PDGM case-mix group to Medicare for payment calculation:

```
FL 42: 0023          (revenue code — prospective payment)
FL 44: 2AFKH         (HIPPS code — encodes the 432 case-mix group)
FL 46: 1             (units = 1 period)
FL 47: [charges]     (total charges for the period)
```

### Payer Information (FL 50-65)

| FL | Name | Required | Content |
|----|------|----------|---------|
| **50** | Payer Name | Yes | "Medicare" on line A if primary |
| **51** | Health Plan ID | Yes | Medicare plan number |
| **52** | Release of Information | Yes | "Y" — signed release on file |
| **58** | Insured's Name | Yes | Beneficiary name |
| **59** | Patient's Relationship to Insured | Yes | 01=self, 18=spouse, etc. |
| **60** | Insured's Unique ID | Yes | Medicare Beneficiary Identifier (MBI) |

For secondary/tertiary payers, the same fields are repeated on lines B and C.

### Diagnosis Codes (FL 66-67)

| FL | Name | Required | Content |
|----|------|----------|---------|
| **66** | ICD Version Indicator | Yes | 0 = ICD-10 |
| **67** | Principal Diagnosis | Yes | ICD-10-CM code — condition chiefly responsible for care |
| **67A-67Q** | Other Diagnoses | Situational | Up to 24 additional ICD-10 codes |

Diagnosis coding directly affects PDGM payment:
- **Principal diagnosis** → determines 1 of 12 clinical groupings
- **Secondary diagnoses** → determine comorbidity adjustment (none, low, high)

### Attending Provider (FL 76)

| FL | Name | Required | Content |
|----|------|----------|---------|
| **76** | Attending Provider | Yes | Physician NPI + name — the certifying/ordering physician |

## Claim Submission Flow

```
Agency EHR                Clearinghouse              Medicare MAC
    │                          │                          │
    ├── Generate 837I ────────>│                          │
    │                          ├── Validate syntax ──────>│
    │                          │                          │
    │   <── 999 (accepted) ───┤                          │
    │   or  TA1 (rejected)    │                          │
    │                          │   <── 277CA ────────────┤
    │   <── 277CA forwarded ──┤   (accepted/rejected     │
    │                          │    into adjudication)    │
    │                          │                          │
    │                          │   MAC processes claim    │
    │                          │   applies PDGM grouper   │
    │                          │   calculates payment     │
    │                          │                          │
    │   <── 835 (ERA) ────────┤   <── 835 ──────────────┤
    │   Payment + explanation  │   Remittance advice      │
```

### Key Electronic Transactions

| Transaction | Purpose | Direction |
|-------------|---------|-----------|
| **837I** | Institutional claim submission | Agency → MAC |
| **999** | Functional acknowledgment (syntax check) | Clearinghouse → Agency |
| **277CA** | Claim acknowledgment (accepted into adjudication or rejected) | MAC → Agency |
| **835** | Electronic Remittance Advice (payment details) | MAC → Agency |
| **276/277** | Claim status inquiry/response | Agency ↔ MAC |
| **270/271** | Eligibility inquiry/response | Agency ↔ MAC |

## Validation Checks Before Submission

A billing manager should enforce these before allowing a claim to be sent:

| Category | Checks |
|----------|--------|
| **Patient** | Name, DOB, sex, address, MBI all present and valid |
| **Provider** | Agency NPI, attending physician NPI present |
| **Period** | From/through dates valid, within certification period |
| **OASIS** | Matching assessment submitted and accepted by CMS |
| **Diagnoses** | Principal dx present, ICD-10 valid, consistent with OASIS |
| **HIPPS** | Rate code present on revenue line 0023 |
| **Services** | At least one skilled visit, revenue codes valid, dates within period |
| **Charges** | Line charges sum to total (revenue code 0001), no negatives |
| **Plan of Care** | Signed 485 on file for the certification period |
| **Type of Bill** | Correct 032X frequency code for the claim sequence |
| **Prior claims** | No duplicate submission for same period |

## Sources

- [CMS Claims Processing Manual, Chapter 25 — UB-04 Data Set](https://www.cms.gov/regulations-and-guidance/guidance/manuals/downloads/clm104c25.pdf)
- [CMS Claims Processing Manual, Chapter 10 — HHA Billing](https://www.cms.gov/regulations-and-guidance/guidance/manuals/downloads/clm104c10.pdf)
- [CMS PDGM Overview](https://www.cms.gov/medicare/payment/prospective-payment-systems/home-health)
