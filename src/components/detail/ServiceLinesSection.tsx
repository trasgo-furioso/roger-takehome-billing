import { Card, Group, Stack, Text } from '@mantine/core'
import type { ServiceLine } from '@/models'
import { revenueCodes } from '@/data'
import { formatCurrency, formatDate } from '@/utils'

interface ServiceLinesSectionProps {
  serviceLines: ServiceLine[]
}

export function ServiceLinesSection({ serviceLines }: ServiceLinesSectionProps) {
  return (
    <Card>
      <Text fw={600} mb="sm">Service Lines</Text>
      <Stack gap="xs">
        {serviceLines.map((sl) => (
          <Group key={sl.id} justify="space-between">
            <Group gap="lg">
              <Text fw={500} fz="sm">{sl.revenueCode}</Text>
              <Text c="dimmed" fz="sm">{revenueCodes[sl.revenueCode] ?? 'Unknown'}</Text>
              {sl.hcpcsCode && <Text fz="sm">{sl.hcpcsCode}</Text>}
              <Text c="dimmed" fz="xs">
                {formatDate(sl.serviceFromDate)} – {formatDate(sl.serviceThroughDate)}
              </Text>
              <Text fz="sm">{sl.units} units</Text>
            </Group>
            <Text fw={500} fz="sm">{formatCurrency(sl.charges)}</Text>
          </Group>
        ))}
      </Stack>
    </Card>
  )
}
