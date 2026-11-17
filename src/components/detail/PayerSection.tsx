import { Card, SimpleGrid, Text, TextInput } from '@mantine/core'
import type { Claim } from '@/models'
import { useAutoSave } from './useAutoSave'

interface PayerSectionProps {
  claim: Claim
}

export function PayerSection({ claim }: PayerSectionProps) {
  const npi = useAutoSave(claim.id, 'attendingPhysicianNpi', claim.attendingPhysicianNpi)

  return (
    <Card>
      <Text fw={600} mb="sm">Payer & Provider</Text>
      <SimpleGrid cols={2}>
        <TextInput label="Payer Name" value={claim.payerName} readOnly />
        <TextInput label="Payer ID" value={claim.payerId} readOnly />
        <TextInput label="Attending Physician" value={claim.attendingPhysicianName} readOnly />
        <TextInput label="Attending Physician NPI" value={npi.value} onChange={npi.onChange} />
        <TextInput label="Type of Bill" value={claim.typeOfBill} readOnly />
      </SimpleGrid>
    </Card>
  )
}
