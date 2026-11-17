import { Anchor, Center, Group, Stack, Text, TextInput } from '@mantine/core'
import { Link } from '@tanstack/react-router'
import { useClaimsStore } from '@/stores'
import { formatDate } from '@/utils'
import { PatientSection } from './PatientSection'
import { DiagnosesSection } from './DiagnosesSection'
import { ServiceLinesSection } from './ServiceLinesSection'
import { PayerSection } from './PayerSection'

interface ClaimDetailPageProps {
  claimId: string
}

export function ClaimDetailPage({ claimId }: ClaimDetailPageProps) {
  const { getClaimById, getPatientById } = useClaimsStore()
  const claim = getClaimById(claimId)

  if (!claim) {
    return (
      <Center py="xl">
        <Stack align="center">
          <Text c="dimmed">Claim not found.</Text>
          <Anchor component={Link} to="/claims">Back to Claims</Anchor>
        </Stack>
      </Center>
    )
  }

  const patient = getPatientById(claim.patientId)
  if (!patient) return null

  return (
    <Stack gap="lg">
      <PatientSection patient={patient} />

      <Group grow>
        <TextInput label="Period From" value={formatDate(claim.fromDate)} readOnly />
        <TextInput label="Period Through" value={formatDate(claim.throughDate)} readOnly />
      </Group>

      <DiagnosesSection diagnoses={claim.diagnoses} />
      <ServiceLinesSection serviceLines={claim.serviceLines} />
      <PayerSection claim={claim} />
    </Stack>
  )
}
