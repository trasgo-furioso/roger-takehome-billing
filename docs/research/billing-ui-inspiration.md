# Billing UI Inspiration & Patterns

Research into existing home health and general healthcare billing UIs for design inspiration.

## Key UI Patterns Across Billing Software

### 1. Dashboard-First Navigation

The landing page is an **operational dashboard** with summary tiles showing counts and dollars by status. Every number is clickable — it drills into the claim list behind it.

```
┌─────────────────────────────────────────────────────────┐
│  BILLING DASHBOARD                                      │
│                                                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │ Ready to │ │ Submitted│ │ Rejected │ │  Denied  │  │
│  │  Bill    │ │          │ │          │ │          │  │
│  │   12     │ │    34    │ │     3    │ │     5    │  │
│  │ $48,200  │ │ $142,500 │ │  $12,800 │ │  $18,900 │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
│                                                         │
│  AR Aging        0-30: $89K  31-60: $42K  61-90: $18K  │
│  ───────────────────────────────────────────────────── │
└─────────────────────────────────────────────────────────┘
```

**Used by**: Axxess, athenahealth

### 2. Filterable Claim Worklist

The core workspace is a **dense, scannable table** — not cards. Each row shows the essential info at a glance. Filters sit above or alongside.

```
┌─────────────────────────────────────────────────────────────────┐
│ Filters: [Payer ▼] [Status ▼] [Date Range] [Branch ▼] [Search]│
├─────────────────────────────────────────────────────────────────┤
│ Patient        │ Period      │ Payer    │ Status    │ Amount   │
│────────────────┼─────────────┼──────────┼───────────┼──────────│
│ Smith, John    │ 10/1-10/30  │ Medicare │ Ready     │ $3,842   │
│ Garcia, Maria  │ 10/1-10/30  │ Medicare │ Hold      │ $4,120   │
│ Chen, Wei      │ 9/15-10/14  │ Aetna    │ Submitted │ $3,560   │
│ Johnson, Pat   │ 9/1-9/30    │ Medicare │ Denied    │ $4,890   │
└─────────────────────────────────────────────────────────────────┘
```

**Key columns**: Patient, period dates, payer, claim status, amount, issue/hold reason, assigned to, days in status

**Design principles**:
- One queue item per claim, one clear current reason
- Direct path from row → claim detail → resolution
- Bulk actions for safe, repeatable tasks (submit batch, mark reviewed)
- Consequential actions (write-off, appeal) require review

### 3. Readiness Checklist Before Submission

Before a claim can be generated/submitted, the system shows what's complete and what's missing. Users resolve blockers inline.

```
┌───────────────────────────────────────────┐
│ CLAIM READINESS — Smith, John             │
│ Period: 10/01/2026 – 10/30/2026           │
│                                           │
│ ✓ OASIS submitted and accepted            │
│ ✓ Plan of Care signed                     │
│ ✓ All visits documented (8 visits)        │
│ ✗ Missing attending physician NPI         │
│ ✓ Diagnoses coded (ICD-10)               │
│ ✓ HIPPS code generated: 2AFKH            │
│ ✓ Revenue codes valid                     │
│                                           │
│ Status: HOLD — 1 issue to resolve         │
│                                           │
│ [Resolve Issues]  [Generate Claim]        │
└───────────────────────────────────────────┘
```

**Used by**: Axxess (verification step before claim generation)

### 4. Claim Detail / Editor View

A claim detail screen shows all claim data organized in sections, mirroring the UB-04 structure. Editable fields where corrections are allowed.

```
┌───────────────────────────────────────────────────────┐
│ CLAIM DETAIL — CLM-2026-00142                         │
│ Patient: Smith, John  │  MBI: 1EG4-TE5-MK72          │
│ Period: 10/01 – 10/30/2026  │  Type of Bill: 0322    │
├───────────────────────────────────────────────────────┤
│ DIAGNOSES                                             │
│  Principal: M54.5 — Low back pain                     │
│  Secondary: E11.9 — Type 2 diabetes                   │
│  Secondary: I10 — Essential hypertension              │
├───────────────────────────────────────────────────────┤
│ SERVICE LINES                                         │
│  Rev  │ HCPCS/HIPPS │ Dates     │ Units │ Charges    │
│  0023 │ 2AFKH       │           │   1   │ $3,842.00  │
│  0551 │ G0299       │ 10/2-10/28│   8   │ $1,200.00  │
│  0421 │ 97110       │ 10/5-10/26│   6   │ $   900.00 │
│  0001 │ TOTAL       │           │       │ $3,842.00  │
├───────────────────────────────────────────────────────┤
│ PAYER                                                 │
│  Primary: Medicare  │  Plan ID: 12345                 │
│  Attending: Dr. Rivera, NPI 1234567890                │
├───────────────────────────────────────────────────────┤
│ HISTORY                                               │
│  Created: 10/31  │  Submitted: 11/01  │  Status: Paid│
│  Payment: $3,420.00  │  Adjustment: $422.00          │
├───────────────────────────────────────────────────────┤
│ [Edit] [Resubmit] [Appeal] [Print UB-04] [Notes]     │
└───────────────────────────────────────────────────────┘
```

### 5. Submission & Response Tracking

Track the claim through the clearinghouse pipeline with timestamps and responses.

```
┌───────────────────────────────────────────────┐
│ CLAIM TIMELINE — CLM-2026-00142               │
│                                               │
│ ● Created ─────────────── 10/31 2:15 PM       │
│ │                                             │
│ ● Submitted to clearinghouse ── 11/01 9:00 AM │
│ │                                             │
│ ● 999 Accepted (syntax OK) ─── 11/01 9:02 AM │
│ │                                             │
│ ● 277CA Accepted by MAC ────── 11/01 3:15 PM  │
│ │                                             │
│ ● 835 Payment received ─────── 11/14 10:30 AM │
│   Payment: $3,420.00                          │
│   Adjustment: -$422.00 (contractual)          │
└───────────────────────────────────────────────┘
```

### 6. Denial Management

Denied claims get their own focused view: what was denied, why, what to do next.

```
┌───────────────────────────────────────────────────────┐
│ DENIALS WORKLIST                              5 items │
├───────────────────────────────────────────────────────┤
│ Patient      │ Denial Reason         │ $ At Risk │Age│
│──────────────┼───────────────────────┼───────────┼───│
│ Johnson, Pat │ CO-4: Missing info    │ $4,890    │12d│
│ Lee, Sandra  │ CO-16: Missing OASIS  │ $3,200    │ 8d│
│ Brown, Tim   │ PR-1: Deductible      │ $  220    │ 5d│
│ Davis, Ann   │ CO-197: Auth required │ $5,100    │22d│
│ Wilson, Ray  │ CO-29: Filing limit   │ $3,800    │45d│
├───────────────────────────────────────────────────────┤
│ For each: [View Claim] [Correct] [Appeal] [Write Off]│
└───────────────────────────────────────────────────────┘
```

**Key denial UX principles**:
- Answer 4 questions fast: What denied? Why? What's needed? What's the next action + deadline?
- Show denial codes (CARC/RARC) with plain-language explanations
- Distinguish data corrections from clinical appeals
- Track appeal deadlines prominently

### 7. AR Aging Dashboard

```
┌──────────────────────────────────────────────────────┐
│ ACCOUNTS RECEIVABLE AGING                            │
│                                                      │
│  ████████████████████░░░░░░░░░░░░  $312K total       │
│  ├── 0-30 days ────── $189K (61%)                    │
│  ├── 31-60 days ───── $ 72K (23%)                    │
│  ├── 61-90 days ───── $ 33K (11%)                    │
│  └── 90+ days ─────── $ 18K  (6%)                    │
│                                                      │
│  By Payer:                                           │
│  Medicare ──── $198K │ Medicaid ──── $52K             │
│  Aetna ─────── $34K │ BCBS ──────── $28K             │
│                                                      │
│  [View by Payer] [View by Age] [View by Status]      │
└──────────────────────────────────────────────────────┘
```

## Axxess (Home Health Specific)

The most documented home health billing UI. Key patterns:

- **Dashboard tiles**: Outstanding claims panel with shortcuts to RAPs, finals, all claims
- **Billing Center**: Central hub with filterable claim lists by status, payer, date, location
- **Generate → Review → Submit flow**: Select completed claims, review, submit electronically or download
- **Claims History**: Follow-through workspace for reviewing prior claims and their status
- **Separate payer workflows**: Medicare PPS vs managed care vs other insurance
- **Verification step**: Readiness checks before claim generation

**References**:
- [Billing Center Manual (PDF)](https://www.axxess.com/help/wp-content/uploads/sites/2/2021/09/Home-Health-Billing-Center-Medicare-Manual-July-2021.pdf)
- [Billing Quick Reference (PDF)](https://www.axxess.com/help/wp-content/uploads/sites/2/2022/10/Home-Health-Billing-QRG-September-2022.pdf)
- [Medicare Billing Flow Chart (PDF)](https://www.axxess.com/help/wp-content/uploads/sites/2/2022/10/Home-Health-Billing-Flow-Chart-October-2022.pdf)
- [Training Videos](https://www.axxess.com/help/agencycore/training-webinars/training-videos/)

## athenahealth (General Practice, Strong Billing UX)

Best-documented general billing UX patterns:

- **Workflow Dashboard**: Real-time totals that open associated claim lists, configurable columns and department filters
- **Claim Worklists**: Organized by workflow-specific reasons, routed to teams
- **Claim Action Page**: Review claims in hold, correct details, appeal or resubmit — all from one screen
- **Team-based assignment**: Configurable worklists with manager-level assignment and visibility
- **Notes and documentation**: Attached to claim resolution workflow

**References**:
- [Workflow Dashboard](https://help.athenahealth.com/Ohelp/Content/Workflow_Dashboard_PH.htm)
- [Claim Worklist](https://help.athenahealth.com/Ohelp/Content/Claim_Worklist_Dashboard_PH.htm)
- [Billing Workflow](https://help.athenahealth.com/Ohelp/Content/Features/Billing_Workflow_A.htm)
- [Claim Action Page](https://help.athenahealth.com/Ohelp/Content/Claim_Action_PH.htm)

## OpenEMR (Open Source)

- **Billing Manager screen**: Claim screening and submission functions
- [Walkthrough with screenshots](https://www.open-emr.org/wiki/index.php/OpenEMR_v6+_Walkthrough)
- [Live demo](https://demo.openemr.io/b/openemr/interface/login/login.php?site=default)

## Design Principles for Our Prototype

Based on this research, the billing manager UI should follow these principles:

1. **Dashboard as launchpad** — summary metrics that link to actionable worklists
2. **Table-first, not card-first** — dense, scannable rows for the claim worklist
3. **Status-driven navigation** — organize by what needs action, not alphabetically
4. **Readiness gates** — show what's blocking a claim before submission
5. **One-click depth** — from dashboard → list → detail without losing context
6. **Plain language** — translate codes into readable descriptions for non-tech users
7. **Minimal text** — icons, status badges, color coding over paragraphs
8. **Batch + single actions** — bulk submit for ready claims, individual review for problems
9. **Timeline/audit trail** — show claim history as a visual timeline
10. **Urgency signals** — flag deadlines, aging claims, and high-dollar denials

## Sources

- [Axxess Billing Documentation](https://www.axxess.com/help/agencycore/billing/overview/)
- [athenahealth Workflow Dashboard](https://help.athenahealth.com/Ohelp/Content/Workflow_Dashboard_PH.htm)
- [OpenEMR Walkthrough](https://www.open-emr.org/wiki/index.php/OpenEMR_v6+_Walkthrough)
