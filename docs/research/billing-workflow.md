# Home Health Billing Workflow

## Overview

Home health billing revolves around **30-day periods of care** within **60-day certification periods**. Unlike office visits where a single encounter generates a single claim, home health billing aggregates multiple visits across a period into a single institutional claim (837I / UB-04).

The billing team's job is to ensure every billable period moves through the pipeline: documentation complete, claim validated, submitted, paid. When things go wrong — rejections, denials, underpayments — they investigate and resolve.

## Episode & Period Structure

```
Certification Period (60 days)
├── Period 1 (30 days) ─── "Early" ─── generates 1 claim
└── Period 2 (30 days) ─── "Late"  ─── generates 1 claim

Recertification (next 60 days)
├── Period 3 (30 days) ─── "Early" ─── generates 1 claim
└── Period 4 (30 days) ─── "Late"  ─── generates 1 claim
```

- Each 30-day period = 1 claim to Medicare
- "Early" vs "Late" timing is one of the 5 PDGM payment dimensions
- A patient can have multiple consecutive certification periods
- Each certification period requires a physician-signed Plan of Care (Form 485)

## The Billing Pipeline

### Stage 1: Admission & Setup

**Who**: Intake / clinical staff
**What happens**:
- Patient referred to home health
- Eligibility verified with payer (270/271 transaction)
- Patient admitted; Start of Care (SOC) date established
- SOC OASIS assessment completed within 5 days
- Plan of Care (485) created with orders, diagnoses, disciplines, frequency
- Physician signs the plan

**Billing team watches for**:
- Missing or unsigned Plan of Care
- Incomplete OASIS
- Eligibility issues (no active coverage, auth required)

### Stage 2: Ongoing Care & Documentation

**Who**: Clinicians (nurses, therapists, aides)
**What happens**:
- Visits performed per the plan of care
- Each visit documented with notes, time, services provided
- EVV data captured (location, time in/out)
- Condition changes trigger reassessment

**Billing team watches for**:
- Missing visit notes (can't bill for undocumented visits)
- Visits outside authorized frequency
- Gaps in care that may affect period eligibility

### Stage 3: Period Close & Coding Review

**Who**: Billing / coding staff
**What happens**:
- 30-day period ends (or patient is discharged/transferred)
- All visit documentation finalized
- OASIS assessment completed and submitted to CMS via iQIES
- Diagnoses reviewed and coded (ICD-10)
  - Principal diagnosis determines clinical grouping
  - Secondary diagnoses determine comorbidity adjustment
- HIPPS rate code generated via PDGM grouper software
- Revenue codes and service lines assembled

**Key validations**:

| Check | Description |
|-------|-------------|
| **OASIS accepted** | CMS has accepted the matching assessment |
| **Diagnoses consistent** | OASIS dx matches claim dx |
| **Plan of Care signed** | Physician signature on file |
| **All visits documented** | No missing notes for billed visits |
| **Service dates within period** | Visit dates fall within the 30-day period |
| **HIPPS code valid** | Grouper output matches period data |
| **Type of Bill correct** | 0322 (HHA, home health, interim) or 0329 (final) etc. |
| **Patient info complete** | Name, DOB, sex, address, Medicare ID |
| **Provider NPI on file** | Attending physician NPI present |

### Stage 4: Claim Generation & Submission

**Who**: Billing staff
**What happens**:
- Claim generated in UB-04 / 837I format
- Pre-submission edits run (internal scrubbing)
- Claim reviewed for completeness
- Submitted electronically to Medicare Administrative Contractor (MAC) via clearinghouse

**Claim contains** (key UB-04 fields):

| Field | UB-04 FL | Content |
|-------|----------|---------|
| Provider info | FL 1 | Agency name, address, NPI |
| Type of Bill | FL 4 | 032X for home health |
| Statement period | FL 6 | 30-day period from/through dates |
| Patient info | FL 8-11 | Name, address, DOB, sex |
| Start of Care | FL 12 | SOC date |
| Condition codes | FL 18-28 | Situational codes |
| Revenue codes | FL 42 | Service categories (e.g., 0551 skilled nursing, 0421 PT) |
| HIPPS code | FL 44 | PDGM payment group code |
| Service dates | FL 45 | Visit dates per revenue line |
| Units | FL 46 | Visit count or hours |
| Total charges | FL 47 | Charges per revenue line |
| Payer info | FL 50-55 | Medicare or other payer |
| Insured ID | FL 60 | Medicare Beneficiary Identifier (MBI) |
| Diagnoses | FL 67 | Principal + other ICD-10 codes |
| Attending provider | FL 76 | Physician NPI and name |

### Stage 5: Acknowledgment & Response

**Who**: Billing staff
**What happens**:
- Clearinghouse sends acknowledgment (999/TA1) — syntactically valid or not
- MAC sends claim acknowledgment (277CA) — accepted into adjudication or rejected
- If rejected: identify error, correct, resubmit

**Common rejection reasons**:
- Missing or invalid OASIS
- Invalid Medicare Beneficiary Identifier
- Duplicate claim
- Dates outside coverage period
- Missing physician NPI
- Invalid Type of Bill

### Stage 6: Adjudication & Payment

**Who**: Medicare MAC (automated)
**What happens**:
- MAC processes claim through edits and pricing
- PDGM case-mix weight applied to base payment rate
- Adjustments: LUPA (low utilization), outlier, partial episode
- Payment or denial decision made
- Remittance Advice (835/ERA) sent to agency

**Payment types**:

| Type | Description |
|------|-------------|
| **Full PDGM payment** | Standard case-mix adjusted payment for the 30-day period |
| **LUPA** | Low Utilization Payment Adjustment — fewer visits than threshold; paid per-visit instead |
| **PEP** | Partial Episode Payment — patient transferred or discharged early |
| **Outlier** | Additional payment for unusually high-cost cases |

### Stage 7: Payment Posting & Reconciliation

**Who**: Billing / accounting staff
**What happens**:
- ERA (835) received and parsed
- Payment posted to patient account / period
- Contractual adjustments recorded
- Patient responsibility identified (if any)
- Payment reconciled against expected amount

**Watch for**:
- Underpayments vs expected PDGM rate
- Unexpected adjustments or recoupments
- Payments applied to wrong period

### Stage 8: Denials & Follow-Up

**Who**: Billing / AR staff
**What happens**:
- Denied claims identified from remittance
- Denial reason analyzed (CARC/RARC codes)
- Corrective action determined:

| Action | When |
|--------|------|
| **Correct & resubmit** | Data error (wrong code, missing info) |
| **Appeal** | Clinical disagreement (medical necessity, coverage) |
| **Adjust & rebill** | Partial denial, need to split or modify |
| **Write off** | Non-recoverable (timely filing, non-covered) |

- Appeals tracked with deadlines (typically 120 days for Medicare redetermination)
- Follow-up tasks assigned and monitored

## Claim Lifecycle Statuses

A claim moves through these statuses in the billing system:

```
Documentation Pending
       │
       ▼
  Ready for Review ──── Hold (missing info)
       │                     │
       ▼                     ▼
  Claim Generated      Returns to Ready
       │                when resolved
       ▼
   Submitted
       │
       ├──── Rejected ──── Corrected ──── Resubmitted
       │
       ▼
   Accepted (in adjudication)
       │
       ├──── Denied ──── Appeal / Correct / Write Off
       │
       ▼
     Paid
       │
       ├──── Underpaid ──── Follow up
       │
       ▼
    Closed
```

## Key Metrics for Billing Teams

| Metric | What It Measures |
|--------|-----------------|
| **Days in AR** | Average time from submission to payment |
| **Clean claim rate** | % of claims accepted on first submission |
| **Denial rate** | % of claims denied |
| **LUPA rate** | % of periods paid at LUPA (indicates visit shortfalls) |
| **Unbilled periods** | Periods past end date without a claim submitted |
| **Timely filing** | Claims approaching filing deadline |
| **Collection rate** | % of expected revenue actually collected |

## Sources

- [CMS Claims Processing Manual, Chapter 10 — HHA Billing](https://www.cms.gov/regulations-and-guidance/guidance/manuals/downloads/clm104c10.pdf)
- [CMS PDGM Overview](https://www.cms.gov/medicare/payment/prospective-payment-systems/home-health)
- [CMS UB-04 Manual, Chapter 25](https://www.cms.gov/regulations-and-guidance/guidance/manuals/downloads/clm104c25.pdf)
