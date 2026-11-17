import type { ClaimStatus } from '@/models'

interface TransitionRule {
  to: ClaimStatus
  requiresAllPassing?: boolean
}

const transitions: Record<ClaimStatus, TransitionRule[]> = {
  'Ready for Review': [{ to: 'Submitted', requiresAllPassing: true }],
  'Submitted': [
    { to: 'Paid' },
    { to: 'Rejected' },
    { to: 'Denied' },
  ],
  'Rejected': [{ to: 'Submitted', requiresAllPassing: true }],
  'Denied': [
    { to: 'Submitted', requiresAllPassing: true },
    { to: 'Written Off' },
  ],
  'Paid': [],
  'Written Off': [],
}

export function canTransition(
  from: ClaimStatus,
  to: ClaimStatus,
  allPassing?: boolean,
): boolean {
  const rules = transitions[from]
  const rule = rules.find((r) => r.to === to)
  if (!rule) return false
  if (rule.requiresAllPassing && !allPassing) return false
  return true
}

export interface ActionDescriptor {
  label: string
  action: 'submit' | 'payment' | 'writeOff'
  secondary?: { label: string; action: 'writeOff' }
}

export function resolveAction(
  status: ClaimStatus,
  allPassing: boolean,
): ActionDescriptor | null {
  switch (status) {
    case 'Ready for Review':
      return allPassing ? { label: 'Submit Claim', action: 'submit' } : null
    case 'Submitted':
      return { label: 'Post Payment', action: 'payment' }
    case 'Rejected':
      return allPassing ? { label: 'Resubmit Claim', action: 'submit' } : null
    case 'Denied':
      if (allPassing) {
        return {
          label: 'Resubmit Appeal',
          action: 'submit',
          secondary: { label: 'Write Off', action: 'writeOff' },
        }
      }
      return { label: 'Write Off', action: 'writeOff' }
    case 'Paid':
    case 'Written Off':
      return null
  }
}
