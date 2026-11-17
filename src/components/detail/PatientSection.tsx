import { Card, SimpleGrid, Text, TextInput } from '@mantine/core'
import type { Patient } from '@/models'

interface PatientSectionProps {
  patient: Patient
}

export function PatientSection({ patient }: PatientSectionProps) {
  return (
    <Card>
      <Text fw={600} mb="sm">Patient Information</Text>
      <SimpleGrid cols={2}>
        <TextInput label="First Name" value={patient.firstName} readOnly />
        <TextInput label="Last Name" value={patient.lastName} readOnly />
        <TextInput label="Date of Birth" value={patient.dateOfBirth} readOnly />
        <TextInput label="Sex" value={patient.sex} readOnly />
        <TextInput label="MBI" value={patient.mbi} readOnly />
        <TextInput label="Coverage" value={patient.coverageActive ? 'Active' : 'Inactive'} readOnly />
        <TextInput label="Street" value={patient.address.street} readOnly />
        <TextInput label="City" value={patient.address.city} readOnly />
        <TextInput label="State" value={patient.address.state} readOnly />
        <TextInput label="ZIP" value={patient.address.zip} readOnly />
      </SimpleGrid>
    </Card>
  )
}
