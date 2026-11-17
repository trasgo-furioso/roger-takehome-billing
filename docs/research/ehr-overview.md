# Electronic Health Record (EHR)

An Electronic Health Record (EHR) is a digital system for documenting, storing, retrieving, and sharing a patient's health information across care encounters. It goes beyond a single visit's chart — it's a longitudinal record that follows the patient across providers and settings.

## What an EHR Contains

- **Demographics** — name, DOB, sex, address, insurance info
- **Clinical notes** — visit documentation, assessments, care plans
- **Diagnoses** — active problems, past medical history (ICD-10 codes)
- **Medications** — current prescriptions, allergies, interactions
- **Vital signs** — blood pressure, heart rate, temperature, etc.
- **Orders** — lab tests, imaging, referrals, provider orders
- **Results** — lab values, imaging reports, test outcomes
- **Care plans** — treatment goals, interventions, patient education
- **Billing data** — claims, charges, payer information, remittances

## Key Capabilities

| Capability | Description |
|------------|-------------|
| **Documentation** | Structured and unstructured clinical notes |
| **Order entry (CPOE)** | Computerized provider order entry for labs, meds, referrals |
| **Decision support** | Alerts, reminders, drug interaction checks |
| **Scheduling** | Patient appointments, clinician calendars |
| **Billing & claims** | Charge capture, claim generation, submission, payment posting |
| **Reporting** | Quality measures, compliance, financial analytics |
| **Interoperability** | Data exchange via HL7, FHIR, X12 (837/835) standards |

## EHR in Home Health

Home health EHRs have specialized needs beyond a typical ambulatory or hospital system:

- **Episode/period tracking** — care organized in 60-day episodes (certification periods) and 30-day billing periods under PDGM
- **OASIS assessments** — standardized patient assessments required by CMS at start of care, recertification, resumption, and discharge
- **Visit scheduling & documentation** — nurses/therapists document visits in the field, often on mobile devices
- **Electronic Visit Verification (EVV)** — GPS/time-stamped proof of visit as required by the 21st Century Cures Act
- **Plan of care / 485** — physician-signed orders specifying disciplines, frequency, and duration of services
- **Medicare claims (837I)** — institutional claims submitted on the UB-04 / CMS-1450 format via 837I electronic transactions

## Open-Source EHR Systems

No widely-adopted open-source EHR is purpose-built for U.S. home health. The closest options:

| System | Focus | Home Health Fit |
|--------|-------|-----------------|
| **OpenEMR** | Full EHR + practice management | Has billing features; lacks HH-specific workflows (OASIS, episodes, PDGM) |
| **OpenMRS** | Modular clinical platform | Global health oriented; not turnkey for home health |
| **Bahmni** | OpenMRS + lab/imaging/admin | Hospital-oriented |
| **GNU Health** | Hospital information system | Not U.S. home-health specific |

## Standards & Transactions

| Standard | Purpose |
|----------|---------|
| **HL7 / FHIR** | Clinical data exchange between systems |
| **X12 837I** | Electronic institutional claim submission (the digital version of UB-04) |
| **X12 835** | Electronic remittance advice (ERA) — payment details from payers |
| **X12 270/271** | Eligibility inquiry and response |
| **X12 276/277** | Claim status inquiry and response |
| **ICD-10-CM** | Diagnosis coding |
| **HCPCS / CPT** | Procedure and service coding |
| **HIPPS** | Health Insurance Prospective Payment System rate codes (used in home health PDGM) |

## Sources

- [HealthIT.gov — EHR Overview](https://playbook.healthit.gov/playbook/electronic-health-records/)
- [OpenEMR Features](https://www.open-emr.org/wiki/index.php/OpenEMR_Features)
- [CMS Home Health PPS](https://www.cms.gov/medicare/payment/prospective-payment-systems/home-health)
