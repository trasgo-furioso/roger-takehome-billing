# Axxess Home Health Billing Flow Charts (October 2022)

ASCII renderings of the Axxess billing flow chart PDF.

---

## 1. Billing Center — Medicare / Medicare HMO

Path: `Billing / Billing Center`

```
┌──────────────┐     ┌──────────────┐     ┌──────────────────┐
│   Billing    │────>│  View Claims │────>│  Verify Claims*  │
│   Center     │     │              │     │                  │
└──────────────┘     └──────────────┘     └────────┬─────────┘
                            │                      │
                  Filter by:                       │ After billable visit
                  - Location                       │ confirmed (green check),
                  - Date range                     │ Open Claim becomes a
                  - Claim status                   │ hyperlink. Select Verify
                  - Type (NOA/RAP or Final)        │ at bottom of page.
                  - Payer                          │
                                                   ▼
                                          ┌──────────────────┐
                                          │  Generate Claims  │
                                          │                  │
                                          │ Select checkbox  │
                                          │ + Generate       │
                                          │ Selected, or     │
                                          │ Generate All     │
                                          │ Completed        │
                                          └───────┬──────────┘
                                                  │
                              ┌────────────────────┼────────────────────┐
                              ▼                    ▼                    ▼
                    ┌──────────────┐    ┌───────────────────┐  ┌──────────────┐
                    │  Download    │    │ Mark Claim(s) As  │  │   Submit     │
                    │  Claim(s)   │    │ Submitted and Exit│  │  Claim(s)   │
                    │             │    │                   │  │  and Exit   │
                    └──────────────┘    └───────────────────┘  └──────────────┘
                    Save to computer    Changes status in       Claims sent to
                    then upload to      Billing Center after    Medicare via
                    Medicare via        download + upload       electronic
                    preferred portal    is completed            billing
```

\* Select any red X in Orders column to view outstanding orders on Finals.
  Select any red X or green check in Visits column to see Billable Visits window.

---

## 2. Verifying Final Claims (4-Step Process)

```
┌────────────────┐     ┌────────────────┐     ┌────────────────┐     ┌────────────────┐
│    Step 1:     │     │    Step 2:     │     │    Step 3:     │     │    Step 4:     │
│ Demographics   │────>│ Verify Visits  │────>│ Verify Supplies│────>│   Summary      │
│                │     │                │     │                │     │                │
│ Verify patient │     │ Billable visits│     │ Add/remove     │     │ Confirm all    │
│ info. Sections │     │ Missed visits  │     │ billable/non-  │     │ previously     │
│ marked with *  │     │ Incomplete     │     │ billable       │     │ entered info   │
│ must be correct│     │ visits         │     │ supplies, or   │     │ is correct     │
│                │     │                │     │ mark checkbox  │     │                │
└────────────────┘     └────────────────┘     │ if not billing │     └───────┬────────┘
                                              │ supplies       │             │
       Select "Verify and Next" between each step             │             ▼
                                              └────────────────┘    ┌────────────────┐
                                                                    │    Complete     │
                                                                    │ Verification   │
                                                                    └────────────────┘
```

---

## 3. Pending Claims

Path: `Billing / Pending Claims`

```
┌──────────────────────────────────────────────────────────────┐
│                      PENDING CLAIMS                          │
│                                                              │
│  Manage all Medicare and Managed Care claims with            │
│  outstanding balances.                                       │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐     │
│  │              AGING METRICS                          │     │
│  │  Calculated from claim's bill date to current date  │     │
│  │                                                     │     │
│  │  [0-7 days] [8-30 days] [31-60] [61-90] [90+ days] │     │
│  │   (click any bucket to filter the list below)       │     │
│  └─────────────────────────────────────────────────────┘     │
│                                                              │
│  Filters: Branch | From/Through Date | Status | Type |       │
│           Payer | Search | Patient Status                    │
│                                                              │
│  Columns: Age | Patient Name | MRN | Insurance ID |          │
│           Billing Period | Payer | Status | Claim Amount |   │
│           Total Payments | +Adj | -Adj | Balance | Notes     │
└──────────────────────────────────────────────────────────────┘
                              │
                        Select Edit
                              │
                              ▼
        ┌─────────────────────────────────────────┐
        │  EDIT CLAIM BALANCE                     │
        │                                         │
        │  Verify: Bill Status, Payer, Date       │
        │  Enter: Check Number, Check Amount      │
        │                                         │
        │  ┌─────────────┐  ┌──────────────────┐  │
        │  │  Payments   │  │  Adjustments     │  │
        │  │             │  │                  │  │
        │  │ Select Add  │  │ Select Add       │  │
        │  │ Enter Amount│  │ Enter Amount     │  │
        │  │ (comment    │  │ Choose Code      │  │
        │  │  optional)  │  │ (comment optional│  │
        │  │             │  │                  │  │
        │  └──────┬──────┘  └────────┬─────────┘  │
        │         └──────┬───────────┘             │
        │                ▼                         │
        │         [    Save    ]                   │
        └─────────────────────────────────────────┘
```

---

## 4. Claims History — Medicare / Medicare HMO

Path: `Billing / Medicare_Medicare HMO (PPS) / Billing_Claims History`

```
┌──────────────────────────────────────────────────────────┐
│                    CLAIMS HISTORY                         │
│                                                          │
│  Select a patient from the list                          │
│  Select an individual claim to view                      │
│                                                          │
│  ┌────────────────────┐     ┌─────────────────────────┐  │
│  │   Post Payment     │     │   Post Adjustment       │  │
│  │                    │     │                         │  │
│  │  Enter Details:    │     │  Enter Details:         │  │
│  │  - Payment amount  │     │  - Adjustment amount    │  │
│  │  - Payment date    │     │  - Date (auto-today)    │  │
│  │  - Check RA#       │     │  - Adjustment code      │  │
│  │  - Check amount    │     │  - Comment              │  │
│  │  - Comment         │     │                         │  │
│  │                    │     │  Custom codes:          │  │
│  │  [     Save     ]  │     │  Admin/Lists/Adjustment │  │
│  │                    │     │  Codes/New Code         │  │
│  └────────────────────┘     │                         │  │
│                             │  [ Post Adjustment ]    │  │
│                             └─────────────────────────┘  │
│                                                          │
│  Quick Reports (right side):                             │
│  - Remittance         - View Payments                    │
│  - View Adjustments   - Activity Logs                    │
│  - Deleted Claims                                        │
└──────────────────────────────────────────────────────────┘
```

---

## 5. Remittance Advice

Path: `Billing / Remittance Advice`

Agency must be billing through Axxess to receive Remittance Advice.

### Download Files

```
┌────────────┐     ┌────────────┐     ┌────────────┐     ┌────────────┐
│ Choose the │────>│ Choose the │────>│ Select the │────>│  Select    │
│ Date Range │     │ Insurance  │     │ EDI Files  │     │  Download  │
│            │     │            │     │            │     │            │
│ Payment or │     │            │     │ 277 tab or │     │ Or select  │
│ remittance │     │            │     │ 835 tab    │     │ checkboxes │
│ date       │     │            │     │            │     │ + Download │
│            │     │            │     │            │     │ Selected   │
└────────────┘     └────────────┘     └────────────┘     └────────────┘
```

### Upload Files

```
┌────────────┐     ┌────────────┐     ┌────────────┐
│ Select     │────>│ Find File  │────>│  Select    │
│ Choose     │     │ on the     │     │  Upload    │
│ File       │     │ Computer   │     │            │
└────────────┘     └────────────┘     └────────────┘
```

---

## 6. Managed Care / Other Insurances

### New Claim

Path: `Billing / Managed Care_Other Insurances / Create Claims`

```
Option A: Create All
┌────────────┐     ┌────────────┐     ┌────────────┐     ┌────────────┐
│ Select     │────>│ Choose the │────>│ Choose the │────>│ Select     │
│ Create All │     │ Branch     │     │ Insurance  │     │ Create     │
│ Claims     │     │            │     │            │     │ Claims     │
└────────────┘     └────────────┘     └────────────┘     └────────────┘

Option B: New Claim from Claims History
┌────────────┐     ┌────────────┐     ┌────────────┐     ┌────────────┐
│ Select New │────>│ Choose the │────>│ Choose the │────>│ Select Add │
│ Claim      │     │ Insurance  │     │ Date Range │     │ Claim      │
└────────────┘     └────────────┘     └────────────┘     └────────────┘
```

### Verify Claim (5-Step Process for Managed Care)

Path: `Billing / Managed Care_Other Insurances / Create Claims`

```
Find claim ──> Select Patient's Name
                       │
                       ▼
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│ Step 1:  │  │ Step 2:  │  │ Step 3:  │  │ Step 4:  │  │ Step 5:  │
│ Demo-    │─>│ Verify   │─>│ Verify   │─>│ Verify   │─>│ Summary  │
│ graphics │  │ Insurance│  │ Visits   │  │ Supplies │  │          │
│          │  │          │  │          │  │          │  │ Confirm  │
│          │  │ Reload   │  │ Billable │  │ Add/edit/│  │ all info │
│          │  │ Insurance│  │ Missed   │  │ delete   │  │ correct  │
│          │  │ to update│  │ Incompl. │  │ supplies │  │          │
└──────────┘  └──────────┘  └──────────┘  └──────────┘  └────┬─────┘
                                                             │
       Select "Verify and Next" between each step            ▼
                                                    ┌────────────────┐
                                                    │   Complete     │
                                                    │ Verification   │
                                                    └────────────────┘
```

### Send / Download Claims

```
                    ┌────────────────┐
                    │ Select         │
                    │ Checkboxes     │
                    └───────┬────────┘
                            │
                            ▼
                    ┌────────────────┐
                    │ Select         │
                    │ Generate       │
                    │ Selected       │
                    │ (or Generate   │
                    │ All Completed) │
                    └───────┬────────┘
                            │
              ┌─────────────┴─────────────┐
              │                           │
        Electronically                Manually
              │                           │
              ▼                           ▼
    ┌──────────────────┐       ┌──────────────────┐
    │ Select Submit    │       │ Select Download  │
    │ Electronically   │       │ Claim(s)         │
    └──────────────────┘       └────────┬─────────┘
                                        │
                                        ▼
                               ┌──────────────────┐
                               │ Save to Computer │
                               └────────┬─────────┘
                                        │
                                        ▼
                               ┌──────────────────┐
                               │ Upload to Payer  │
                               └────────┬─────────┘
                                        │
                                        ▼
                               ┌──────────────────┐
                               │ Select Mark      │
                               │ Claim(s) as      │
                               │ Submitted        │
                               └──────────────────┘
```

---

## Key Differences: Medicare vs Managed Care

| Aspect | Medicare / Medicare HMO | Managed Care / Other |
|--------|------------------------|---------------------|
| **Claim types** | NOA/RAP + Final | Single claim |
| **Verification steps** | 4 steps (Demographics, Visits, Supplies, Summary) | 5 steps (adds Verify Insurance) |
| **Submission** | Electronic via Axxess or download | Electronic or manual download |
| **Remittance** | Via Axxess (277/835 EDI files) | Manual posting |
| **Claims History path** | `Billing/Medicare_Medicare HMO (PPS)` | `Billing/Managed Care_Other Insurances` |

---

Source: Axxess Home Health Billing Flow Chart, October 2022
