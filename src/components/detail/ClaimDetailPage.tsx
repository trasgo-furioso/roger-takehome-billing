import { Alert, Anchor, Badge, Card, Center, Grid, Group, SimpleGrid, Stack, Text } from '@mantine/core'
import { IconAlertTriangle } from '@tabler/icons-react'
import { Link } from '@tanstack/react-router'
import { useClaimsStore } from '@/stores'
import { formatDate } from '@/utils'
import { DiagnosesSection } from './DiagnosesSection'
import { ServiceLinesSection } from './ServiceLinesSection'
import { PayerSection } from './PayerSection'
import { TimelineSection } from './TimelineSection'
import { ActionsSection } from './ActionsSection'

interface ClaimDetailPageProps {
  claimId: string
  fixCode?: string
}

/** Map rejection codes to field names for highlighting */
const rejectionFieldHint: Record<string, { field: string; label: string; section: string }> = {
  'MISSING-NPI': { field: 'attendingPhysicianNpi', label: 'Attending Physician NPI', section: 'Payer' },
  'INVALID-NPI': { field: 'attendingPhysicianNpi', label: 'Attending Physician NPI', section: 'Payer' },
  'INVALID-TOB': { field: 'typeOfBill', label: 'Type of Bill', section: 'Claim Detail' },
  'DUP-CLAIM': { field: '', label: 'Duplicate claim', section: '' },
}

export function ClaimDetailPage({ claimId, fixCode }: ClaimDetailPageProps) {
  const { getClaimById, getPatientById, getEpisodeByClaimId } = useClaimsStore()
  const claim = getClaimById(claimId)

  if (!claim) {
    return (
      <Center py="xl">
        <Stack align="center">
          <Text c="dimmed">Claim not found.</Text>
          <Anchor component={Link} to="/">Back to Board</Anchor>
        </Stack>
      </Center>
    )
  }

  const patient = getPatientById(claim.patientId)
  if (!patient) return null

  const episode = getEpisodeByClaimId(claimId)
  const fixHint = fixCode ? rejectionFieldHint[fixCode] : undefined

  return (
    <Grid gap="lg">
      {/* Left column — 60%: claim content */}
      <Grid.Col span={{ base: 12, lg: 7 }}>
        <Stack gap="lg">
          {/* Rejection fix banner */}
          {fixCode && claim.rejectionReason && (
            <Alert
              color="orange"
              icon={<IconAlertTriangle size={16} />}
              title="Correction Required"
              data-testid="fix-banner"
            >
              <Text fz="sm">
                <Badge color="orange" size="sm" mr="xs">{claim.rejectionReason.code}</Badge>
                {claim.rejectionReason.description}
              </Text>
              {fixHint && fixHint.field && (
                <Text fz="xs" c="dimmed" mt={4}>
                  Correct the <Text span fw={600}>{fixHint.label}</Text> field in the "{fixHint.section}" section below, then resubmit.
                </Text>
              )}
            </Alert>
          )}

          {/* Claim header — patient, period, billing */}
          <Card>
            <Group gap="xs" mb="sm">
              <Text fw={600}>Claim Detail</Text>
              <Badge variant="light" color="gray" size="xs">{claim.id}</Badge>
            </Group>
            <SimpleGrid cols={2}>
              <FieldValue label="Patient" value={`${patient.firstName} ${patient.lastName}`} />
              <FieldValue label="MBI" value={patient.mbi} />
              <FieldValue label="Period" value={`${formatDate(claim.fromDate)} – ${formatDate(claim.throughDate)}`} />
              <div>
                <Text fz="xs" c="dimmed">Type of Bill</Text>
                <Text fz="sm" fw={fixHint?.field === 'typeOfBill' ? 700 : undefined} c={fixHint?.field === 'typeOfBill' ? 'orange' : undefined}>{claim.typeOfBill}</Text>
              </div>
              {claim.hippsCode && (
                <FieldValue label="HIPPS Rate Code" value={claim.hippsCode} />
              )}
              {episode && (
                <FieldValue label="Certifying Physician" value={`${episode.certifyingPhysicianName} (${episode.certifyingPhysicianNpi})`} />
              )}
            </SimpleGrid>
          </Card>

          {/* Diagnoses */}
          <DiagnosesSection diagnoses={claim.diagnoses} />

          {/* Service Lines */}
          <ServiceLinesSection serviceLines={claim.serviceLines} />

          {/* Payer */}
          <PayerSection claim={claim} highlightNpi={fixHint?.field === 'attendingPhysicianNpi'} />
        </Stack>
      </Grid.Col>

      {/* Right column — 40%: actions & timeline */}
      <Grid.Col span={{ base: 12, lg: 5 }}>
        <Stack gap="lg">
          <ActionsSection claim={claim} />
          <TimelineSection events={claim.timeline} />
        </Stack>
      </Grid.Col>
    </Grid>
  )
}

/** Compact label/value display for read-only fields */
function FieldValue({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <Text fz="xs" c="dimmed">{label}</Text>
      <Text fz="sm">{value}</Text>
    </div>
  )
}
