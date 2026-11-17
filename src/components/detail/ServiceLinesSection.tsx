import { Badge, Card, Group, Stack, Text } from '@mantine/core'
import type { ServiceLine } from '@/models'
import { revenueCodes } from '@/data'
import { formatCurrency, formatDate } from '@/utils'

interface ServiceLinesSectionProps {
  serviceLines: ServiceLine[]
}

export function ServiceLinesSection({ serviceLines }: ServiceLinesSectionProps) {
  // Separate HIPPS rate line from other service lines
  const hippsLine = serviceLines.find((sl) => sl.revenueCode === '0023')
  const otherLines = serviceLines.filter((sl) => sl.revenueCode !== '0023')
  const totalCharges = serviceLines.reduce((sum, sl) => sum + sl.charges, 0)

  return (
    <Card>
      <Group gap="xs" mb="sm">
        <Text fw={600}>Revenue & Service Lines</Text>
        <Badge variant="light" color="gray" size="xs">FL 42-49</Badge>
      </Group>

      {/* HIPPS Rate Code callout */}
      {hippsLine && hippsLine.hcpcsCode && (
        <Group
          gap="lg"
          mb="md"
          px="sm"
          py="xs"
          style={{
            background: 'var(--mantine-color-violet-0)',
            borderRadius: 6,
            border: '1px solid var(--mantine-color-violet-2)',
          }}
        >
          <div>
            <Text fz="xs" c="dimmed">HIPPS Rate Code</Text>
            <Badge color="violet" size="lg" variant="filled">{hippsLine.hcpcsCode}</Badge>
          </div>
          <div>
            <Text fz="xs" c="dimmed">Revenue Code</Text>
            <Text fz="sm" fw={500}>0023 — {revenueCodes['0023'] ?? 'Prospective Payment'}</Text>
          </div>
          <div>
            <Text fz="xs" c="dimmed">PDGM Payment</Text>
            <Text fz="sm" c="dimmed">Determines prospective payment rate for this 30-day period</Text>
          </div>
        </Group>
      )}

      {/* Regular service lines */}
      <Stack gap="xs">
        {otherLines.map((sl) => (
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
