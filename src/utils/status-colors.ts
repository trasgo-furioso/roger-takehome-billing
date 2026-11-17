import type { ClaimStatus } from '@/models'

const colorMap: Record<ClaimStatus, string> = {
  'Ready for Review': 'blue',
  'Submitted': 'cyan',
  'Rejected': 'orange',
  'Denied': 'red',
  'Paid': 'green',
  'Written Off': 'gray',
}

export function statusColor(status: ClaimStatus): string {
  return colorMap[status]
}
