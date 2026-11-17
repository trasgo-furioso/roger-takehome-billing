import { Badge, Card, Group, SimpleGrid, Text, TextInput } from '@mantine/core'
import type { Claim } from '@/models'
import { useAutoSave } from './useAutoSave'

interface PayerSectionProps {
  claim: Claim
  highlightNpi?: boolean
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
        <TextInput label="Payer Name" value={claim.payerName} readOnly />
        <TextInput label="Payer ID" value={claim.payerId} readOnly />
        <TextInput label="Attending Physician" value={claim.attendingPhysicianName} readOnly />
        <TextInput
          label="Attending Physician NPI"
          value={npi.value}
          onChange={npi.onChange}
          styles={highlightNpi ? { input: { borderColor: 'var(--mantine-color-orange-5)', borderWidth: 2 } } : undefined}
          description={highlightNpi ? 'This field requires correction' : undefined}
        />
      </SimpleGrid>
    </Card>
  )
}
