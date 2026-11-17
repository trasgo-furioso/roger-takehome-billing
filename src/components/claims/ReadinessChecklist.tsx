import { Group, Stack, Text, ThemeIcon } from '@mantine/core'
import { IconCheck, IconX } from '@tabler/icons-react'
import type { ReadinessCheck } from '@/models'

const readinessItems: { key: keyof Omit<ReadinessCheck, 'allPassing'>; label: string }[] = [
  { key: 'oasisAccepted', label: 'OASIS Accepted' },
  { key: 'planOfCareSigned', label: 'Plan of Care Signed' },
  { key: 'allVisitsDocumented', label: 'All Visits Documented' },
  { key: 'attendingPhysicianNpi', label: 'Physician NPI on File' },
  { key: 'diagnosesCoded', label: 'Diagnoses Coded' },
  { key: 'hippsCodeGenerated', label: 'HIPPS Code Generated' },
  { key: 'revenueCodesValid', label: 'Revenue Codes Valid' },
]

interface ReadinessChecklistProps {
  readiness: ReadinessCheck
}

export function ReadinessChecklist({ readiness }: ReadinessChecklistProps) {
  return (
    <Stack gap="xs" mt="md">
      {readinessItems.map((item) => {
        const passing = readiness[item.key]
        return (
          <Group key={item.key} data-testid="readiness-item">
            <ThemeIcon
              data-testid="readiness-icon"
              color={passing ? 'green' : 'red'}
              variant="light"
              radius="xl"
              size="sm"
            >
              {passing ? <IconCheck size={14} /> : <IconX size={14} />}
            </ThemeIcon>
            <Text fz="sm" data-testid="readiness-label">{item.label}</Text>
          </Group>
        )
      })}
    </Stack>
  )
}
