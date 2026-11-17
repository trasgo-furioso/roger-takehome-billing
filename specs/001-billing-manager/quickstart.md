# Quickstart Validation Guide

**Feature**: 001-billing-manager | **Date**: 2026-11-17

## Prerequisites

- Node.js 18+ installed
- npm or pnpm available

## Setup

```bash
# From repository root
npm install
npm run dev
```

App opens at `http://localhost:5173`. Seed data loads automatically on first visit.

## Validation Scenarios

### 1. Dashboard loads with correct aggregations (US7)

1. Open `http://localhost:5173/`
2. **Expected**: Dashboard shows summary tiles for each claim status and AR aging bucket
3. **Expected**: Each tile shows a count and total dollar amount
4. Click any tile (e.g., "Rejected")
5. **Expected**: Navigates to `/claims?status=Rejected` showing only matching claims

### 2. Claim list displays and filters work (US1)

1. Navigate to `/claims`
2. **Expected**: Stacked claim cards, each showing patient name (prominent), period dates, payer, color-coded status badge, expected amount, days in current status
3. Select status filter "Submitted"
4. **Expected**: Only "Submitted" claims shown, filter visible in controls and URL
5. Add a patient name search
6. **Expected**: Results narrow to match both filters
7. Clear all filters
8. **Expected**: Full list restored

### 3. Claim detail view and edit (US2)

1. From the claim list, click any claim card
2. **Expected**: Navigates to `/claims/<id>` showing editable sections: patient info, period dates, Type of Bill, diagnoses (ICD-10 with descriptions), service lines, payer, provider
3. Edit the attending physician NPI
4. **Expected**: Auto-save occurs, success notification appears near the field
5. Refresh the page
6. **Expected**: Edited value persists (localStorage)

### 4. Readiness check and submission (US3, US4)

1. From the claim list, find a "Ready for Review" claim
2. Click "Review" on the card
3. **Expected**: Card expands inline showing readiness checklist with pass/fail indicators
4. If all items pass, the action should show "Submit"
5. Click "Submit"
6. **Expected**: Status changes to "Submitted", submission timestamp shown, "Submit" action removed

### 5. Handle rejected claim (US5)

1. Find a "Rejected" claim card
2. **Expected**: Card shows rejection reason in plain language + code, and a "Fix" action
3. Click "Fix"
4. **Expected**: Navigates to claim detail/edit view
5. After corrections, if all readiness checks pass, click "Submit"
6. **Expected**: Status changes back to "Submitted"

### 6. Post payment (US6)

1. Find a "Submitted" claim card
2. Click "Pay"
3. **Expected**: Card expands showing payment amount and adjustment fields
4. Enter payment details and click "Confirm Payment"
5. **Expected**: Status changes to "Paid", card shows billed amount, payment received, adjustments

### 7. Manage denied claim (US8)

1. Find a "Denied" claim card
2. **Expected**: Card shows CARC/RARC reason in plain language, amount at risk, days since denial, "Appeal" and "Write Off" actions
3. Click "Write Off"
4. **Expected**: Status changes to "Written Off"
5. Find another denied claim and click "Appeal"
6. **Expected**: Navigates to claim detail/edit view for correction and resubmission

### 8. Claim timeline (US9)

1. Open the detail page for a claim that has been through multiple transitions (e.g., submitted then rejected then resubmitted)
2. Scroll to the timeline section
3. **Expected**: Each state transition shown as an entry with event type, date/time, newest first
4. **Expected**: Rejection entries include the reason; payment entries include the amount

### 9. Data persistence

1. Complete any state-changing action (submit, pay, write off)
2. Close the browser tab
3. Reopen `http://localhost:5173/`
4. **Expected**: All changes persist — the claim reflects the new status

### 10. Reset seed data

1. Trigger the "Reset Data" action (location TBD — likely in app settings or header)
2. **Expected**: All claims revert to their original seed data state

## Running Tests

```bash
# Unit and integration tests
npm run test

# E2E tests (requires dev server running)
npx playwright test
```
