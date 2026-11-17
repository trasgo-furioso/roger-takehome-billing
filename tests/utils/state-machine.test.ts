import { describe, it, expect } from 'vitest'
import { canTransition, resolveAction } from '@/utils/state-machine'
import type { ClaimStatus } from '@/models'

// T008: Claim status transitions
describe('canTransition', () => {
  it('Ready for Review → Submitted when allPassing=true', () => {
    expect(canTransition('Ready for Review', 'Submitted', true)).toBe(true)
  })

  it('Ready for Review → Submitted when allPassing=false', () => {
    expect(canTransition('Ready for Review', 'Submitted', false)).toBe(false)
  })

  it('Submitted → Paid', () => {
    expect(canTransition('Submitted', 'Paid')).toBe(true)
  })

  it('Submitted → Rejected', () => {
    expect(canTransition('Submitted', 'Rejected')).toBe(true)
  })

  it('Submitted → Denied', () => {
    expect(canTransition('Submitted', 'Denied')).toBe(true)
  })

  it('Rejected → Submitted when allPassing=true', () => {
    expect(canTransition('Rejected', 'Submitted', true)).toBe(true)
  })

  it('Denied → Submitted when allPassing=true', () => {
    expect(canTransition('Denied', 'Submitted', true)).toBe(true)
  })

  it('Denied → Written Off (always)', () => {
    expect(canTransition('Denied', 'Written Off')).toBe(true)
  })

  it('Paid → Submitted is false (terminal)', () => {
    expect(canTransition('Paid', 'Submitted')).toBe(false)
  })

  it('Written Off → Submitted is false (terminal)', () => {
    expect(canTransition('Written Off', 'Submitted')).toBe(false)
  })

  it('rejects all other invalid transitions', () => {
    const statuses: ClaimStatus[] = [
      'Ready for Review', 'Submitted', 'Rejected', 'Denied', 'Paid', 'Written Off',
    ]
    // Ready for Review can only go to Submitted
    expect(canTransition('Ready for Review', 'Paid')).toBe(false)
    expect(canTransition('Ready for Review', 'Denied')).toBe(false)
    // Submitted cannot go back to Ready for Review
    expect(canTransition('Submitted', 'Ready for Review')).toBe(false)
    // Rejected cannot go to Paid directly
    expect(canTransition('Rejected', 'Paid')).toBe(false)
    // Paid cannot go anywhere
    for (const s of statuses) {
      if (s !== 'Paid') expect(canTransition('Paid', s)).toBe(false)
    }
    // Written Off cannot go anywhere
    for (const s of statuses) {
      if (s !== 'Written Off') expect(canTransition('Written Off', s)).toBe(false)
    }
  })
})

// T009: Action resolution
describe('resolveAction', () => {
  it('Ready for Review + passing → Submit Claim', () => {
    expect(resolveAction('Ready for Review', true)).toEqual({
      label: 'Submit Claim',
      action: 'submit',
    })
  })

  it('Ready for Review + not passing → null', () => {
    expect(resolveAction('Ready for Review', false)).toBeNull()
  })

  it('Submitted → Post Payment', () => {
    expect(resolveAction('Submitted', true)).toEqual({
      label: 'Post Payment',
      action: 'payment',
    })
  })

  it('Rejected + passing → Resubmit Claim', () => {
    expect(resolveAction('Rejected', true)).toEqual({
      label: 'Resubmit Claim',
      action: 'submit',
    })
  })

  it('Rejected + not passing → null', () => {
    expect(resolveAction('Rejected', false)).toBeNull()
  })

  it('Denied + passing → Resubmit Appeal with Write Off secondary', () => {
    expect(resolveAction('Denied', true)).toEqual({
      label: 'Resubmit Appeal',
      action: 'submit',
      secondary: { label: 'Write Off', action: 'writeOff' },
    })
  })

  it('Denied + not passing → Write Off', () => {
    expect(resolveAction('Denied', false)).toEqual({
      label: 'Write Off',
      action: 'writeOff',
    })
  })

  it('Paid → null', () => {
    expect(resolveAction('Paid', true)).toBeNull()
  })

  it('Written Off → null', () => {
    expect(resolveAction('Written Off', true)).toBeNull()
  })
})
