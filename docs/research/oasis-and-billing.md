# OASIS & Its Connection to Billing

## What is OASIS?

OASIS (Outcome and Assessment Information Set) is a standardized set of data elements that home health agencies must collect as part of a patient's comprehensive assessment. It is mandated by CMS for all Medicare and Medicaid home health patients, and as of July 2025, for all payers receiving skilled home health services.

OASIS is not the full clinical assessment — it's a specific, structured questionnaire embedded within the agency's broader evaluation. The responses feed into quality measurement, care planning, and critically, Medicare payment determination.

## When OASIS Is Completed

| Assessment Type | Timing | Purpose |
|----------------|--------|---------|
| **Start of Care (SOC)** | Within 5 days of admission | Initial baseline assessment |
| **Resumption of Care (ROC)** | Within 2 days of return from inpatient stay | Re-assess after hospitalization |
| **Recertification** | Within 5 days of start of new certification period | Reassess for continued care |
| **Follow-Up** | Per agency policy | Track changes in condition |
| **Transfer** | At transfer to inpatient facility | Document status at transfer |
| **Discharge** | At discharge from home health | Document outcomes at end of care |

Each assessment type triggers different OASIS items and has different implications for billing.

## What OASIS Collects

### Administrative & Demographic
- Patient identifiers, agency info, payer sources
- Referral date, start of care date, assessment reason

### Clinical Status
- Primary and secondary diagnoses (ICD-10)
- Symptom severity, pain assessment
- Wound/lesion status and characteristics
- Risk factors (hospitalization risk, falls)

### Functional Abilities (Key for Payment)
- **Self-care** — grooming, dressing upper/lower body, bathing, toileting, eating
- **Mobility** — ambulation, transfers, locomotion (wheelchair use)
- **Cognitive** — orientation, memory, decision-making, confusion
- **Behavioral** — anxiety, depression screening (PHQ-2/PHQ-9)

### Service Utilization
- Therapies planned (PT, OT, SLP)
- Skilled nursing needs
- Home health aide needs

## OASIS and PDGM Payment

Under the **Patient-Driven Groupings Model (PDGM)**, Medicare pays home health agencies per **30-day period of care**. Each period is classified into one of **432 case-mix groups** that determine the payment amount.

### The 5 PDGM Dimensions

```
                        432 Case-Mix Groups
                               |
        ┌──────────┬──────────┼──────────┬──────────┐
        |          |          |          |          |
   Admission    Timing    Clinical   Comorbidity  Functional
    Source                 Grouping   Adjustment   Impairment
        |          |          |          |          |
   From claim   From claim  From claim  From claim  From OASIS
```

| Dimension | Values | Data Source |
|-----------|--------|-------------|
| **Admission Source** | Community referral vs. Institutional (post-acute) | Claim data |
| **Timing** | Early (1st 30-day period) vs. Late (2nd+ period) | Claim data |
| **Clinical Grouping** | 12 groups based on principal diagnosis | Claim (ICD-10) |
| **Comorbidity Adjustment** | None, Low, High | Claim (secondary diagnoses) |
| **Functional Impairment** | Low, Medium, High | OASIS responses |

### How OASIS Drives Functional Impairment Level

Specific OASIS items related to self-care and mobility are scored and combined to determine the functional impairment level:

- Higher impairment = higher payment (more resources needed)
- Items include: grooming, dressing, bathing, toileting, transferring, ambulation
- The scoring uses a points-based system that maps to Low / Medium / High

## The Billing Connection

### Assessment-to-Claim Linkage

```
OASIS Assessment ──submitted to──> CMS (via QIES/iQIES system)
                                         |
                                    Accepted? ──No──> Fix & resubmit
                                         |
                                        Yes
                                         |
Claim (837I) ──submitted to──> Medicare (MAC)
                                         |
                              CMS matches claim to OASIS
                                         |
                              HIPPS code validated ──No──> Claim returned (RTP)
                                         |
                                        Yes
                                         |
                              Payment calculated using
                              case-mix weight × base rate
```

### Key Rules

1. **OASIS must be submitted and accepted before the claim** — if CMS cannot find a matching accepted OASIS for a claim, the claim is returned to provider (RTP)
2. **HIPPS rate code on the claim must match** the grouping derived from the OASIS + claim data
3. **Diagnoses must be consistent** between the OASIS assessment and the claim
4. **Assessment timing matters** — a late or missing OASIS can delay or block billing for that period

### HIPPS Rate Code

The HIPPS (Health Insurance Prospective Payment System) code is a 5-character code placed on the claim (Form Locator 44 on the UB-04) that encodes the case-mix group:

- Characters 1-4: Case-mix group derived from the 5 PDGM dimensions
- Character 5: Reserved

This code tells Medicare which payment weight to apply. It is derived from the combination of OASIS functional data and claim-level diagnosis/admission data via CMS grouper software.

## Impact on Billing Workflow

For a billing team, OASIS creates several checkpoints:

| Checkpoint | What to Verify | Risk if Missing |
|------------|---------------|-----------------|
| **OASIS completed** | Assessment done by clinician on time | Cannot generate claim |
| **OASIS submitted** | Transmitted to CMS via iQIES | Claim will be returned |
| **OASIS accepted** | No fatal errors from CMS validation | Must correct and resubmit |
| **Diagnoses consistent** | OASIS dx matches claim dx | Claim rejection or audit risk |
| **HIPPS code correct** | Grouper output matches claim | Incorrect payment or RTP |
| **Functional items accurate** | Clinical documentation supports scores | Audit liability, potential recoupment |

## Practical Implications for the Billing Manager UI

A billing manager should surface:

- **OASIS status per episode/period** — completed, submitted, accepted, or problem
- **Blocking issues** — claims that cannot be sent because OASIS is missing or rejected
- **Diagnosis mismatches** — where OASIS and claim diagnoses don't align
- **HIPPS code** — displayed on the claim for review before submission
- **Assessment timeline** — are assessments being completed on time?

## Sources

- [CMS OASIS-E2 Manual](https://www.cms.gov/files/document/final-oasis-e2-manual-04-01-2026.pdf)
- [CMS PDGM Overview](https://www.cms.gov/medicare/payment/prospective-payment-systems/home-health)
- [CMS PDGM Grouper Documentation](https://www.cms.gov/files/document/pdgmgroupertoolhelpdocument11-6-18pdf)
- [CMS Home Health Billing Manual, Chapter 10](https://www.cms.gov/regulations-and-guidance/guidance/manuals/downloads/clm104c10.pdf)
