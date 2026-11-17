import dayjs from 'dayjs'

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount)
}

export function formatDate(isoDate: string): string {
  return dayjs(isoDate).format('MMM D, YYYY')
}

export function daysInStatus(statusChangedAt: string): number {
  return dayjs().startOf('day').diff(dayjs(statusChangedAt).startOf('day'), 'day')
}

export type AgingBucket = '0-30' | '31-60' | '61-90' | '90+'

export function arAgingBucket(days: number): AgingBucket {
  if (days <= 30) return '0-30'
  if (days <= 60) return '31-60'
  if (days <= 90) return '61-90'
  return '90+'
}
