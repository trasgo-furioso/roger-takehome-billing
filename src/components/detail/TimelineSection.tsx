import { Card, Text, ThemeIcon, Timeline } from '@mantine/core'
import {
  IconBan,
  IconCheck,
  IconPencil,
  IconPlus,
  IconRefresh,
  IconSend,
  IconTrash,
  IconX,
} from '@tabler/icons-react'
import type { TimelineEvent, TimelineEventType } from '@/models'
import { formatDate } from '@/utils'
import dayjs from 'dayjs'

const eventConfig: Record<TimelineEventType, { icon: React.ReactNode; color: string }> = {
  Created: { icon: <IconPlus size={14} />, color: 'blue' },
  Submitted: { icon: <IconSend size={14} />, color: 'cyan' },
  Accepted: { icon: <IconCheck size={14} />, color: 'green' },
  Rejected: { icon: <IconX size={14} />, color: 'orange' },
  Denied: { icon: <IconBan size={14} />, color: 'red' },
  Resubmitted: { icon: <IconRefresh size={14} />, color: 'cyan' },
  Paid: { icon: <IconCheck size={14} />, color: 'green' },
  'Written Off': { icon: <IconTrash size={14} />, color: 'gray' },
  Edited: { icon: <IconPencil size={14} />, color: 'gray' },
}

interface TimelineSectionProps {
  events: TimelineEvent[]
}

export function TimelineSection({ events }: TimelineSectionProps) {
  const sorted = [...events].sort(
    (a, b) => dayjs(b.timestamp).valueOf() - dayjs(a.timestamp).valueOf(),
  )

  return (
    <Card>
      <Text fw={600} mb="sm">Claim Timeline</Text>
      <Timeline active={sorted.length - 1} bulletSize={24} lineWidth={2}>
        {sorted.map((event) => {
          const config = eventConfig[event.eventType]
          return (
            <Timeline.Item
              key={event.id}
              data-testid="timeline-entry"
              title={event.eventType}
              bullet={
                <ThemeIcon size={24} variant="filled" color={config.color} radius="xl">
                  {config.icon}
                </ThemeIcon>
              }
            >
              <Text fz="xs" c="dimmed">
                {formatDate(event.timestamp)} {dayjs(event.timestamp).format('h:mm A')}
              </Text>
              {event.details && <Text fz="sm" mt={4}>{event.details}</Text>}
            </Timeline.Item>
          )
        })}
      </Timeline>
    </Card>
  )
}
