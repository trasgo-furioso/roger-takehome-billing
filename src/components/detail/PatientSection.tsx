import { Card, SimpleGrid, Text } from '@mantine/core'
import type { Patient } from '@/models'

interface PatientSectionProps {
  patient: Patient
}

function FieldValue({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <Text fz="xs" c="dimmed">{label}</Text>
      <Text fz="sm">{value}</Text>
    </div>
  )
}

export function PatientSection({ patient }: PatientSectionProps) {
  return (
    <Card>
      <Text fw={600} mb="sm">Patient Information</Text>
      <SimpleGrid cols={2}>
        <FieldValue label="First Name" value={patient.firstName} />
        <FieldValue label="Last Name" value={patient.lastName} />
        <FieldValue label="Date of Birth" value={patient.dateOfBirth} />
        <FieldValue label="Sex" value={patient.sex} />
        <FieldValue label="MBI" value={patient.mbi} />
        <FieldValue label="Coverage" value={patient.coverageActive ? 'Active' : 'Inactive'} />
        <FieldValue label="Street" value={patient.address.street} />
        <FieldValue label="City" value={patient.address.city} />
        <FieldValue label="State" value={patient.address.state} />
        <FieldValue label="ZIP" value={patient.address.zip} />
      </SimpleGrid>
    </Card>
  )
}
