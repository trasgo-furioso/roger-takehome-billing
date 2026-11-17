# Quickstart: Kanban Claims Board

## Prerequisites

- Node.js installed
- Dependencies installed: `npm install`
- Seed data provides claims in all statuses (already configured in `src/data/seed.ts`)

## Run

```bash
npm run dev
```

Navigate to `http://localhost:5173/` (or the port Vite assigns).

## Validation Scenarios

### 1. Kanban Board Renders at Root

**Steps**: Open `http://localhost:5173/`
**Expected**: Full-page kanban board with 6 columns (Ready for Review, Submitted, Rejected, Denied, Paid, Written Off). No sidebar. Each column has a colored header with status name and count badge. Cards are stacked inside each column.

### 2. Card Display

**Steps**: Look at any claim card on the board.
**Expected**: Card shows claim ID in lighter font prepended to patient name in bold. Below: period dates, payer, amount, days in status. No status badge. No action buttons.

### 3. Card Sort Order

**Steps**: Look at a column with multiple claims.
**Expected**: Cards are ordered by days in current status, oldest (highest days) at the top.

### 4. Column Scrolling

**Steps**: If a column has enough claims to overflow, scroll within that column.
**Expected**: Each column scrolls vertically independently. Other columns stay in place.

### 5. Horizontal Scrolling

**Steps**: Narrow the browser window so not all 6 columns fit.
**Expected**: The board scrolls horizontally to reveal hidden columns.

### 6. Patient Name Search

**Steps**: Type a patient name (or partial) in the search input (magnifying glass icon) in the header.
**Expected**: Only claims matching the patient name appear across all columns. Column counts update.

### 7. Date Range Filter

**Steps**: Click the date range selector on the right side of the header. Select a start and end date.
**Expected**: Only claims whose billing period overlaps the selected range appear. Column counts update.

### 8. Combined Filters

**Steps**: Set a date range AND type a patient name.
**Expected**: Both filters apply simultaneously. Only matching claims shown.

### 9. Reset Button

**Steps**: With one or more filters active, click the reset button (next to search input).
**Expected**: All filters cleared. Full unfiltered board restored.

### 10. Navigate to Claim Detail

**Steps**: Click on any claim card.
**Expected**: Navigates to `/claims/<claimId>` detail page. All existing detail page functionality works (edit, submit, pay, etc.).

### 11. Status Change Reflected on Return

**Steps**: From the board, click a "Ready for Review" claim. On the detail page, submit it. Navigate back to the board.
**Expected**: The claim card now appears in the "Submitted" column. Column counts updated.

## Tests

```bash
npm run test        # Unit tests (vitest)
npm run test:e2e    # E2E tests (playwright)
```
