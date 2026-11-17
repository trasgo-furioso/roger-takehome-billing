import { Badge, Card, Group, Stack, Text } from '@mantine/core'
import type { ServiceLine } from '@/models'
import { revenueCodes } from '@/data'
import { formatCurrency, formatDate } from '@/utils'

interface ServiceLinesSectionProps {
  serviceLines: ServiceLine[]
}

export function ServiceLinesSection({ serviceLines }: ServiceLinesSectionProps) {
  const totalCharges = serviceLines.reduce((sum, sl) => sum + sl.charges, 0)

  return (
    <Card>
      <Group gap="xs" mb="sm">
        <Text fw={600}>Service Lines</Text>
        <Badge variant="light" color="gray" size="xs">FL 42-49</Badge>
      </Group>

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

      {/* Total charges */}
      <Group justify="flex-end" mt="sm" pt="sm" style={{ borderTop: '1px solid var(--mantine-color-gray-2)' }}>
        <Text fz="sm" c="dimmed">Total Charges:</Text>
        <Text fz="sm" fw={700}>{formatCurrency(totalCharges)}</Text>
      </Group>
    </Card>
  )
}
