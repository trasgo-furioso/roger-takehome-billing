import { Badge, Card, Group, SimpleGrid, Text, TextInput } from '@mantine/core'
import type { Claim } from '@/models'
import { useAutoSave } from './useAutoSave'

interface PayerSectionProps {
  claim: Claim
  highlightNpi?: boolean
}

function FieldValue({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <Text fz="xs" c="dimmed">{label}</Text>
      <Text fz="sm">{value}</Text>
    </div>
  )
}

export function PayerSection({ claim, highlightNpi }: PayerSectionProps) {
  const npi = useAutoSave(claim.id, 'attendingPhysicianNpi', claim.attendingPhysicianNpi)

  return (
    <Card>
      <Group gap="xs" mb="sm">
        <Text fw={600}>Payer & Insured</Text>
        <Badge variant="light" color="gray" size="xs">FL 50-65</Badge>
      </Group>
      <SimpleGrid cols={2}>
        <FieldValue label="Payer Name" value={claim.payerName} />
        <FieldValue label="Payer ID" value={claim.payerId} />
        <FieldValue label="Attending Physician" value={claim.attendingPhysicianName} />
        <TextInput
          label="Attending Physician NPI"
          value={npi.value}
          onChange={npi.onChange}
          onBlur={npi.onBlur}
          styles={highlightNpi ? { input: { borderColor: 'var(--mantine-color-orange-5)', borderWidth: 2 } } : undefined}
          description={highlightNpi ? 'This field requires correction' : undefined}
        />
      </SimpleGrid>
    </Card>
  )
}
