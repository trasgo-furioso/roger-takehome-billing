export type TimelineEventType =
  | 'Created'
  | 'Submitted'
  | 'Accepted'
  | 'Rejected'
  | 'Denied'
  | 'Resubmitted'
  | 'Paid'
  | 'Written Off'
  | 'Edited'

export interface TimelineEvent {
  id: string
  eventType: TimelineEventType
  timestamp: string
  details: string | null
}
