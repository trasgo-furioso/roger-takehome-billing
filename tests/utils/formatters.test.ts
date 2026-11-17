import { describe, it, expect, vi, afterEach } from 'vitest'
import { formatCurrency, formatDate, daysInStatus, arAgingBucket } from '@/utils/formatters'

// T012: Utility formatters
describe('formatCurrency', () => {
  it('formats 3842 as $3,842.00', () => {
    expect(formatCurrency(3842)).toBe('$3,842.00')
  })

  it('formats 0 as $0.00', () => {
    expect(formatCurrency(0)).toBe('$0.00')
  })

  it('formats 1234567.5 with two decimal places', () => {
    expect(formatCurrency(1234567.5)).toBe('$1,234,567.50')
  })
})

describe('formatDate', () => {
  it('formats ISO date to readable format', () => {
    const result = formatDate('2026-10-01')
    expect(result).toMatch(/Oct/)
    expect(result).toMatch(/2026/)
  })
})

describe('daysInStatus', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('computes days from a past date to today', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-11-17T12:00:00'))
    expect(daysInStatus('2026-11-01')).toBe(16)
  })
})

describe('arAgingBucket', () => {
  it('15 days → 0-30', () => {
    expect(arAgingBucket(15)).toBe('0-30')
  })

  it('30 days → 0-30', () => {
    expect(arAgingBucket(30)).toBe('0-30')
  })

  it('31 days → 31-60', () => {
    expect(arAgingBucket(31)).toBe('31-60')
  })

  it('45 days → 31-60', () => {
    expect(arAgingBucket(45)).toBe('31-60')
  })

  it('75 days → 61-90', () => {
    expect(arAgingBucket(75)).toBe('61-90')
  })

  it('100 days → 90+', () => {
    expect(arAgingBucket(100)).toBe('90+')
  })
})
