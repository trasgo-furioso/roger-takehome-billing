# Store Contracts

**Feature**: 001-billing-manager | **Date**: 2026-11-17

## Claims Store (persisted to localStorage)

The primary data store. Persisted via Zustand's `persist` middleware with key `billing-claims`.

### State Shape

```typescript
interface ClaimsState {
  claims: Claim[]
  patients: Patient[]
  episodes: Episode[]
  billingPeriods: BillingPeriod[]
}
```

### Actions

```typescript
interface ClaimsActions {
  // Queries
  getClaimById(id: string): Claim | undefined
  getPatientById(id: string): Patient | undefined
  getClaimsFiltered(params: ClaimSearchParams): Claim[]

  // Mutations
  updateClaimField(claimId: string, field: string, value: unknown): void
  submitClaim(claimId: string): void
  postPayment(claimId: string, remittance: Remittance): void
  writeOffClaim(claimId: string): void

  // Data management
  resetToSeedData(): void
}
```

### Action Contracts

#### `updateClaimField(claimId, field, value)`
- Updates a single field on the claim
- Appends an "Edited" event to the claim's timeline
- **Precondition**: Claim exists
- **Postcondition**: Field is updated, timeline has new entry

#### `submitClaim(claimId)`
- Transitions claim status to "Submitted"
- Sets `submissionDate` to current timestamp
- Appends "Submitted" or "Resubmitted" event to timeline (based on whether claim was previously rejected/denied)
- **Precondition**: Claim exists AND `readiness.allPassing === true`
- **Postcondition**: `status === 'Submitted'`, `submissionDate` set, timeline updated
- **Error**: Throws if readiness checks not all passing

#### `postPayment(claimId, remittance)`
- Transitions claim status to "Paid"
- Stores remittance data on the claim
- Appends "Paid" event with payment amount to timeline
- **Precondition**: Claim exists AND `status === 'Submitted'`
- **Postcondition**: `status === 'Paid'`, `remittance` set, timeline updated

#### `writeOffClaim(claimId)`
- Transitions claim status to "Written Off"
- Appends "Written Off" event to timeline
- **Precondition**: Claim exists AND `status === 'Denied'`
- **Postcondition**: `status === 'Written Off'`, timeline updated

#### `resetToSeedData()`
- Replaces all state with the initial seed data
- Used for demo/review reset
- **Precondition**: None
- **Postcondition**: State matches initial seed data exactly

### Persistence

```typescript
persist(storeCreator, {
  name: 'billing-claims',
  version: 1,
  migrate: (persisted, version) => {
    // Handle schema migrations between versions
  },
  partialize: (state) => ({
    claims: state.claims,
    patients: state.patients,
    episodes: state.episodes,
    billingPeriods: state.billingPeriods,
  }),
})
```

### Seed Data Loading

On store initialization, if localStorage key `billing-claims` does not exist:
1. Load seed data from `src/data/seed.ts`
2. Populate store with 15-20 claims across all statuses and aging buckets
3. Persist to localStorage

## UI Store (not persisted)

Ephemeral UI state. Not persisted to localStorage.

```typescript
interface UIState {
  expandedCardId: string | null       // Currently expanded card (readiness or payment)
  expandedCardMode: 'readiness' | 'payment' | null
  notifications: Notification[]       // Auto-save success toasts
}

interface UIActions {
  expandCard(claimId: string, mode: 'readiness' | 'payment'): void
  collapseCard(): void
  addNotification(message: string, type: 'success' | 'error'): void
  dismissNotification(id: string): void
}
```
