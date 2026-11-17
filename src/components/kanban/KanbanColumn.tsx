import { Badge, Group, Paper, ScrollArea, Stack, Text } from '@mantine/core'
import type { Claim, ClaimStatus, Patient } from '@/models'
import { statusColor, formatCurrency } from '@/utils'
import { KanbanClaimCard } from './KanbanClaimCard'

interface KanbanColumnProps {
  status: ClaimStatus
  claims: Claim[]
  patients: Patient[]
}

export function KanbanColumn({ status, claims, patients }: KanbanColumnProps) {
  const color = statusColor(status)
  const totalAmount = claims.reduce((sum, c) => sum + c.expectedAmount, 0)

  const getPatient = (patientId: string) => patients.find((p) => p.id === patientId)

  return (
    <Paper
      shadow="xs"
      radius="md"
      style={{
        minWidth: 280,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        borderTop: `4px solid var(--mantine-color-${color}-6)`,
        overflow: 'hidden',
      }}
    >
      <Group gap="sm" p="sm" pb="xs" justify="space-between">
        <Group gap="sm">
          <Text fw={600} fz="sm">{status}</Text>
          <Badge variant="filled" size="sm" color={color}>{claims.length}</Badge>
        </Group>
        {claims.length > 0 && (
          <Text fz="xs" c="dimmed" fw={500}>{formatCurrency(totalAmount)}</Text>
        )}
      </Group>

      <ScrollArea type="auto" offsetScrollbars style={{ flex: 1 }} p="xs" pt={0}>
        <Stack gap="xs">
          {claims.length === 0 ? (
            <Text c="dimmed" fz="xs" ta="center" py="lg">No claims</Text>
          ) : (
            claims.map((claim) => {
              const patient = getPatient(claim.patientId)
              if (!patient) return null
              return <KanbanClaimCard key={claim.id} claim={claim} patient={patient} />
            })
          )}
        </Stack>
      </ScrollArea>
    </Paper>
  )
}
