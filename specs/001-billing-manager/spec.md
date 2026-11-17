# Feature Specification: Home Health Billing Manager

**Feature Branch**: `001-billing-manager`

**Created**: 2026-11-17

**Status**: Draft

**Input**: User description: "Build a functional prototype of a Billing Manager UI for a home health EHR system. Billing teams use it to track system-generated Medicare home healthcare claims, verify claim readiness, submit claims to payers, and track payment success or failure. The system assumes existing patient and episode data."

## User Scenarios & Testing

### User Story 1 - Browse and Filter Claim List (Priority: P1)

A billing staff member navigates to the claim list — a scrollable list of stacked claim cards. Each card uses visual hierarchy (positioning, color, text size, whitespace) to make key information instantly readable for non-tech-savvy users. Each card shows the patient name prominently, billing period dates, payer, a color-coded status badge, expected amount, and days in current status. Users can filter by payer, claim status, date range, and patient name. This view replaces the spreadsheets billing teams currently use — it must feel approachable, not like a data grid.

**Why this priority**: The claim list is the core workspace where billing staff spend most of their time. Without the ability to find and browse claims, no downstream actions (review, submit, follow-up) are possible.

**Independent Test**: Can be fully tested by loading the claim list with sample claims and verifying filters narrow results correctly, cards display the right data, and the visual design is readable at a glance.

**Acceptance Scenarios**:

1. **Given** claims exist in various statuses and ages, **When** a billing staff member opens the claim list, **Then** claims are displayed as stacked cards, each showing: patient name (prominent), period dates, payer, color-coded status badge, amount, and days in current status.
2. **Given** claims exist in various statuses and ages **And** the claim list is displayed, **When** the user selects a filter (e.g., Status = "Ready for Review"), **Then** the system navigates to a new page showing only matching claims with the active filter visible in the filter controls.
3. **Given** claims exist in various statuses and ages **And** the claim list is displayed, **When** the user selects multiple filters (e.g., Status = "Submitted" and Payer = "Medicare"), **Then** only claims matching all active filters are shown.
4. **Given** claims exist in various statuses and ages **And** the claim list is displayed, **When** the user searches by patient name, **Then** only claims for matching patients are shown, combined with any other active filters.
5. **Given** claims exist in various statuses and ages **And** the claim list is displayed **And** multiple filters are active, **When** the user clears one filter, **Then** the list updates to reflect the remaining active filters.
6. **Given** claims exist in various statuses and ages **And** the claim list is displayed **And** multiple filters are active, **When** the user clears all filters, **Then** the full unfiltered claim list is restored.

---

### User Story 2 - View and Edit Claim Detail (Priority: P1)

A billing staff member clicks on a claim card to open the claim detail page — a modern CRUD edit view. The page shows all UB-04-relevant information organized in editable sections: patient demographics (name, DOB, MBI), billing period dates, Type of Bill, diagnoses (principal + secondary with ICD-10 codes and plain-language descriptions), service lines (revenue code, HCPCS/HIPPS, dates, units, charges), payer information, and attending provider. Changes are auto-saved with contextual success notifications. For claims that pass all readiness checks, a "Submit" action is available on the detail page, following the same rules as the claim cards.

**Why this priority**: The detail/edit view is the CRUD backbone for reviewing, correcting, and understanding individual claims. It supports the rejection and denial correction workflows.

**Independent Test**: Can be fully tested by opening a claim, verifying all sections display correct data, editing a field, and confirming the auto-save notification appears.

**Acceptance Scenarios**:

1. **Given** claims exist in various statuses and ages **And** the claim list is displayed, **When** the user clicks on a claim card, **Then** the system navigates to the claim detail page showing editable sections for patient info, period, diagnoses, service lines, payer, and provider.
2. **Given** claims exist in various statuses and ages **And** the claim detail page is displayed, **When** the user modifies a field (e.g., attending physician NPI), **Then** the change is saved automatically and a contextual success notification appears next to the field.
3. **Given** claims exist in various statuses and ages **And** the claim detail page is displayed **And** the claim has ICD-10 diagnosis codes, **When** the user views the diagnoses section, **Then** each code is shown with its plain-language description.

---

### User Story 3 - Verify Claim Readiness (Priority: P2)

A billing staff member sees a "Ready for Review" claim card in the claim list. The card shows a "Review" action. Clicking "Review" expands the card inline to reveal a readiness checklist showing pass/fail status for each requirement: OASIS submitted and accepted, Plan of Care signed, all visits documented, attending physician NPI on file, diagnoses coded, HIPPS code generated, and revenue codes valid. When all checklist items are passing, the card's action changes from "Review" to "Submit".

**Why this priority**: Submitting incomplete claims leads to rejections, rework, and delayed payment. The readiness checklist is the critical quality gate that ensures clean claim submission — the single most impactful step for billing efficiency.

**Independent Test**: Can be fully tested by viewing claims with varying readiness states (all complete, some missing) and verifying the checklist accurately reflects the claim's status and the card action reflects readiness.

**Acceptance Scenarios**:

1. **Given** claims exist in various statuses and ages **And** the claim list is displayed **And** a claim is in "Ready for Review" status, **When** the user clicks "Review", **Then** the card expands inline to show a readiness checklist with pass/fail indicators for each required item (OASIS accepted, Plan of Care signed, visits documented, physician NPI, diagnoses coded, HIPPS code, revenue codes valid).
2. **Given** claims exist in various statuses and ages **And** the claim list is displayed **And** a claim is in "Ready for Review" status **And** all checklist items are passing, **When** the user views the card, **Then** the card action shows "Submit".
3. **Given** claims exist in various statuses and ages **And** the claim list is displayed **And** a claim is in "Ready for Review" status **And** one or more checklist items are failing, **When** the user views the card, **Then** the card action shows "Review".

---

### User Story 4 - Submit Claim to Payer (Priority: P2)

A billing staff member submits a verified claim to Medicare using the "Submit" action on the claim card — the same button that appeared after all readiness checks passed in US3. Clicking "Submit" sends the claim and updates its status.

**Why this priority**: Submission is the revenue-generating action — claims don't get paid until they're sent. It depends on the readiness verification being in place first.

**Independent Test**: Can be fully tested by clicking "Submit" on a ready claim card and confirming the status change and timestamp.

**Acceptance Scenarios**:

1. **Given** claims exist in various statuses and ages **And** the claim list is displayed **And** a claim card shows the "Submit" action (all readiness checks passing), **When** the user clicks "Submit", **Then** the claim status changes to "Submitted", the submission date/time is recorded on the card, and the "Submit" action is no longer available.

---

### User Story 5 - Handle Rejected Claims (Priority: P2)

A billing staff member sees rejected claim cards in the claim list. Each rejected card shows the rejection reason in plain language alongside the original code, and a "Fix" action button. Clicking "Fix" navigates to the claim detail/edit view where the user corrects the data (auto-saved). The edit view displays a "Submit" action following the same readiness rules as the claim cards — when all checks pass, the user can resubmit, changing the status back to "Submitted".

**Why this priority**: Rejections are the most common billing problem and must be resolved quickly to avoid payment delays. This depends on the submission and detail views being in place.

**Independent Test**: Can be fully tested by viewing a rejected claim card, clicking "Fix", correcting data in the edit view, and resubmitting.

**Acceptance Scenarios**:

1. **Given** claims exist in various statuses and ages **And** the claim list is displayed **And** a claim is in "Rejected" status, **When** the user views the claim card, **Then** the card shows the rejection reason in plain language alongside the original code and a "Fix" action.
2. **Given** claims exist in various statuses and ages **And** the claim list is displayed **And** a claim is in "Rejected" status, **When** the user clicks "Fix", **Then** the system navigates to the claim detail/edit view.
3. **Given** claims exist in various statuses and ages **And** the claim detail page is displayed for a rejected claim **And** the user has corrected the issue **And** all readiness checks are passing, **When** the user clicks "Submit", **Then** the claim status changes back to "Submitted" and the submission date/time is recorded.

---

### User Story 6 - Post Payment (Priority: P2)

A billing staff member posts payment against a submitted claim to close the billing loop. Submitted claim cards show a "Pay" action. Clicking "Pay" expands the card inline to reveal editable fields for payment amount and adjustments (contractual, deductible). A "Confirm Payment" button below the fields posts the payment and changes the claim status to "Paid".

**Why this priority**: Payment posting closes the revenue cycle loop. It depends on claims being submitted, making it a later-stage workflow.

**Independent Test**: Can be fully tested by clicking "Pay" on a submitted claim card, entering payment details, confirming, and verifying the status change.

**Acceptance Scenarios**:

1. **Given** claims exist in various statuses and ages **And** the claim list is displayed **And** a claim is in "Submitted" status, **When** the user views the claim card, **Then** the card shows a "Pay" action.
2. **Given** claims exist in various statuses and ages **And** the claim list is displayed **And** a claim is in "Submitted" status, **When** the user clicks "Pay", **Then** the card expands inline to show editable fields for payment amount and adjustments.
3. **Given** claims exist in various statuses and ages **And** the claim list is displayed **And** a claim card is expanded showing payment fields **And** the user has entered payment details, **When** the user clicks "Confirm Payment", **Then** the claim status changes to "Paid" and the card reflects the paid status with billed amount, payment received, and adjustments.

---

### User Story 7 - Billing Dashboard (Priority: P3)

A billing team member opens the Billing Manager and sees an operational dashboard summarizing their workload. Summary tiles show how many claims are in each status and AR aging bucket, with total dollar amounts. Each tile links to the claim list with a filter in the URL. The dashboard is a convenience layer on top of the claim list — the list works independently with any filters passed via URL.

**Why this priority**: The dashboard provides a helpful overview but is not essential — billing staff can work directly from the claim list with filters. It's an aggregation view that adds value once the core list and card interactions are in place.

**Independent Test**: Can be fully tested by loading the dashboard with sample claim data and verifying that tiles show correct counts and dollar amounts, and that clicking a tile navigates to the claim list with the correct filter in the URL.

**Acceptance Scenarios**:

1. **Given** claims exist in various statuses and ages, **When** a billing staff member opens the dashboard, **Then** they see summary tiles showing count and total dollar amount for each dimension: claim status tiles (Ready for Review, Submitted, Rejected, Denied, Paid) and AR aging tiles (0-30 days, 31-60 days, 61-90 days, 90+ days outstanding).
2. **Given** claims exist in various statuses and ages **And** the dashboard is displayed, **When** the user clicks any tile (e.g., "Rejected - 3 claims" or "31-60 days - $42K"), **Then** the system navigates to the claim list with the corresponding filter in the URL.

---

### User Story 8 - Manage Denied Claims (Priority: P3)

A billing staff member sees denied claim cards in the claim list. Each denied card shows the denial reason (CARC/RARC codes translated to plain language), the dollar amount at risk, and days since denial. The card offers two actions: "Appeal" (navigates to the edit view to correct and resubmit) and "Write Off" (removes the amount from outstanding AR). This follows the same card-based interaction pattern as other claim statuses.

**Why this priority**: Denial management recovers revenue that would otherwise be lost. It's important but less frequent than the core submission pipeline, and builds on the existing claim detail and correction flows.

**Independent Test**: Can be fully tested by viewing denied claim cards, verifying denial reasons and amounts display correctly, and confirming each action updates the claim appropriately.

**Acceptance Scenarios**:

1. **Given** claims exist in various statuses and ages **And** the claim list is displayed **And** a claim is in "Denied" status, **When** the user views the claim card, **Then** the card shows the denial reason (CARC/RARC code with plain-language translation), dollar amount at risk, days since denial, and "Appeal" and "Write Off" actions.
2. **Given** claims exist in various statuses and ages **And** the claim list is displayed **And** a claim is in "Denied" status, **When** the user clicks "Appeal", **Then** the system navigates to the claim detail/edit view where the user can correct and resubmit.
3. **Given** claims exist in various statuses and ages **And** the claim list is displayed **And** a claim is in "Denied" status, **When** the user clicks "Write Off", **Then** the claim status changes to "Written Off" and the amount is removed from outstanding AR.

---

### User Story 9 - Claim Lifecycle Timeline (Priority: P3)

A billing staff member views the timeline section on the claim detail page to see the full audit log of every state transition the claim has gone through. Each entry shows what happened, when it happened, and relevant details (e.g., rejection reason, payment amount). The timeline is an append-only log — every status change from creation through final resolution is recorded and visible.

**Why this priority**: The timeline provides transparency and auditability for the claim's history. It supports troubleshooting, dispute resolution, and compliance. It depends on the detail view (US2) and the status-changing flows (US4, US5, US6, US8) being in place.

**Independent Test**: Can be fully tested by taking a claim through multiple state transitions and verifying each event appears in the timeline with correct details.

**Acceptance Scenarios**:

1. **Given** claims exist in various statuses and ages **And** the claim detail page is displayed, **When** the user views the timeline section, **Then** each state transition is shown as an entry with event type, date/time, and chronological order (newest first).
2. **Given** claims exist in various statuses and ages **And** the claim detail page is displayed **And** the claim was submitted, **When** the user views the timeline section, **Then** the timeline includes a "Submitted" entry with the submission date/time.
3. **Given** claims exist in various statuses and ages **And** the claim detail page is displayed **And** the claim was rejected, **When** the user views the timeline section, **Then** the timeline includes a "Rejected" entry with the rejection reason in plain language alongside the original code.
4. **Given** claims exist in various statuses and ages **And** the claim detail page is displayed **And** the claim was paid, **When** the user views the timeline section, **Then** the timeline includes a "Paid" entry with payment amount and adjustments.
5. **Given** claims exist in various statuses and ages **And** the claim detail page is displayed **And** the claim was resubmitted after rejection, **When** the user views the timeline section, **Then** the timeline shows both the original rejection and the resubmission as separate entries.

---

## Requirements

### Functional Requirements

**Claim List (US1)**
- **FR-001**: System MUST display claims as stacked cards, each showing patient name (prominent), period dates, payer, color-coded status badge, amount, and days in current status.
- **FR-002**: System MUST support filtering the claim list by payer, claim status, date range, and patient name search, with filters combinable and individually clearable.
- **FR-003**: Selecting a filter MUST navigate to a new page with the filter applied and visible in the filter controls.

**Claim Detail (US2)**
- **FR-004**: System MUST display claim detail organized by UB-04 sections: patient demographics (name, DOB, sex, address, MBI), period dates, Type of Bill, diagnoses (ICD-10 with plain-language descriptions), service lines (revenue code, HCPCS/HIPPS, dates, units, charges), payer info, and attending provider.
- **FR-005**: System MUST auto-save field changes and show a contextual success notification next to the modified field.

**Readiness & Submission (US3, US4)**
- **FR-006**: "Ready for Review" claim cards MUST show a "Review" action that expands the card inline to display a readiness checklist with pass/fail indicators for: OASIS accepted, Plan of Care signed, visits documented, physician NPI, diagnoses coded, HIPPS code, revenue codes valid.
- **FR-007**: Card action MUST show "Submit" when all checklist items pass, and "Review" when any item fails.
- **FR-008**: Clicking "Submit" MUST change the claim status to "Submitted", record the submission date/time, and remove the "Submit" action from the card.

**Rejected Claims (US5)**
- **FR-009**: Rejected claim cards MUST display the rejection reason in plain language alongside the original code and a "Fix" action.
- **FR-010**: Clicking "Fix" MUST navigate to the claim detail/edit view where corrections are auto-saved.
- **FR-011**: The detail view MUST display a "Submit" action following the same readiness rules, allowing resubmission after corrections.

**Payment (US6)**
- **FR-012**: Submitted claim cards MUST show a "Pay" action that expands the card inline to show editable fields for payment amount and adjustments.
- **FR-013**: Clicking "Confirm Payment" MUST change the claim status to "Paid" and display billed amount, payment received, and adjustments on the card.

**Dashboard (US7)**
- **FR-014**: System MUST display a billing dashboard with summary tiles showing claim count and total dollar amount for: status tiles (Ready for Review, Submitted, Rejected, Denied, Paid) and AR aging tiles (0-30, 31-60, 61-90, 90+ days).
- **FR-015**: Each dashboard tile MUST link to the claim list with the corresponding filter in the URL.

**Denied Claims (US8)**
- **FR-016**: Denied claim cards MUST display the denial reason (CARC/RARC code with plain-language translation), dollar amount at risk, days since denial, and "Appeal" and "Write Off" actions.
- **FR-017**: Clicking "Write Off" MUST change the claim status to "Written Off" and remove the amount from outstanding AR.

**Timeline (US9)**
- **FR-018**: The claim detail page MUST display a timeline showing each state transition as an entry with event type, date/time, and chronological order (newest first).
- **FR-019**: Timeline entries MUST include relevant details per event type (e.g., rejection reason, payment amount).

### Key Entities

- **Patient**: A home health care recipient. Key attributes: name, date of birth, sex, address, Medicare Beneficiary Identifier (MBI), active coverage status.
- **Episode (Certification Period)**: A 60-day period of authorized home health care. Contains a signed Plan of Care (Form 485), certifying physician, start/end dates. Each episode contains up to two 30-day billing periods.
- **Billing Period**: A 30-day segment within an episode that generates one claim. Key attributes: from date, through date, timing (Early/Late), associated episode, OASIS assessment status.
- **Claim**: The central billing entity representing one 837I/UB-04 institutional claim for a 30-day period. Key attributes: claim ID, Type of Bill (032X), status, submission date, expected amount, service lines, diagnoses, HIPPS code, payer, attending provider NPI. Statuses: Ready for Review, Submitted, Rejected, Denied, Paid, Written Off.
- **Service Line**: A line item on a claim representing a category of services. Key attributes: revenue code (e.g., 0551 for skilled nursing, 0421 for PT), HCPCS/HIPPS code, service dates, units, charges.
- **Diagnosis**: An ICD-10-CM code assigned to a claim. The principal diagnosis determines PDGM clinical grouping; secondary diagnoses affect comorbidity adjustment.
- **OASIS Assessment**: A standardized CMS-mandated patient assessment linked to a billing period. Key attributes: assessment type, submission status (pending, submitted, accepted, rejected), completion date.
- **Remittance (Payment)**: Payment response from the payer. Key attributes: payment amount, adjustment amounts and codes, check/EFT reference, remittance date.

## Success Criteria

### Measurable Outcomes

- **SC-002**: Billing staff can find a specific patient's claim within 30 seconds using search/filters.
- **SC-003**: 100% of claims submitted through the system have passed all readiness checks (zero incomplete claims submitted).
- **SC-004**: Billing staff can review a claim's full detail and readiness status within one click from the worklist.
- **SC-006**: Rejection and denial reasons are understandable without looking up codes in external references.

## Assumptions

- The prototype uses realistic but mock/seed data for patients, episodes, claims, and payments — no live backend integration.
- The EHR system already has patient records, episode data, completed visits, and OASIS assessment data; the billing manager reads from this existing data.
- Medicare is the primary payer for the prototype; managed care and other insurance workflows are out of scope.
- The prototype focuses on the billing team's workflows; clinical documentation workflows (visit notes, OASIS completion) are handled elsewhere in the EHR.
- Claim generation (assembling the UB-04 data from episode/visit records) is assumed to be system-driven; the billing manager reviews and submits the generated claim, not builds it from scratch.
- Electronic submission is simulated — the prototype models the submission action and status transitions without actual clearinghouse/MAC integration.
- A single-agency, single-branch setup is assumed (no multi-location filtering needed).
- Users access the system via desktop web browser; mobile support is out of scope.
- English is the primary interface language.
