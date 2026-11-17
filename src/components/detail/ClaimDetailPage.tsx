import { Alert, Anchor, Badge, Card, Center, Group, SimpleGrid, Stack, Text, TextInput } from '@mantine/core'
import { IconAlertTriangle } from '@tabler/icons-react'
import { Link } from '@tanstack/react-router'
import { useClaimsStore } from '@/stores'
import { formatDate } from '@/utils'
import { PatientSection } from './PatientSection'
import { DiagnosesSection } from './DiagnosesSection'
import { ServiceLinesSection } from './ServiceLinesSection'
import { PayerSection } from './PayerSection'
import { TimelineSection } from './TimelineSection'
import { useAutoSave } from './useAutoSave'

interface ClaimDetailPageProps {
  claimId: string
  fixCode?: string
}

/** Map rejection codes to field names for highlighting */
const rejectionFieldHint: Record<string, { field: string; label: string; section: string }> = {
  'MISSING-NPI': { field: 'attendingPhysicianNpi', label: 'Attending Physician NPI', section: 'Payer & Provider' },
  'INVALID-NPI': { field: 'attendingPhysicianNpi', label: 'Attending Physician NPI', section: 'Payer & Provider' },
  'INVALID-TOB': { field: 'typeOfBill', label: 'Type of Bill', section: 'Condition & Billing' },
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

      {/* UB-04 FL 1-5: Provider & Facility */}
      <ProviderSection claim={claim} episode={episode ?? undefined} />

      {/* UB-04 FL 8-14: Patient Information */}
      <PatientSection patient={patient} />

      {/* UB-04 FL 6, 15-17: Condition & Billing */}
      <ConditionSection claim={claim} highlightTob={fixHint?.field === 'typeOfBill'} />

      {/* UB-04 FL 67-74: Diagnoses */}
      <DiagnosesSection diagnoses={claim.diagnoses} />

      {/* UB-04 FL 42-49: Revenue & Service Lines */}
      <ServiceLinesSection serviceLines={claim.serviceLines} />

      {/* UB-04 FL 50-65: Payer & Insured */}
      <PayerSection claim={claim} highlightNpi={fixHint?.field === 'attendingPhysicianNpi'} />

      {/* Claim Timeline */}
      <TimelineSection events={claim.timeline} />
    </Stack>
  )
}

/** Provider & Facility section — UB-04 FL 1-5 */
function ProviderSection({ claim, episode }: { claim: ReturnType<ReturnType<typeof useClaimsStore>['getClaimById']> & {}; episode?: { certifyingPhysicianName: string; certifyingPhysicianNpi: string } }) {
  return (
    <Card>
      <Group gap="xs" mb="sm">
        <Text fw={600}>Provider & Facility</Text>
        <Badge variant="light" color="gray" size="xs">FL 1-5</Badge>
      </Group>
      <SimpleGrid cols={2}>
        <TextInput label="Home Health Agency" value="Roger Home Health Services" readOnly />
        <TextInput label="Agency NPI" value="1932456780" readOnly />
        <TextInput label="CMS Certification # (CCN)" value="147001" readOnly />
        <TextInput label="Place of Service" value="12 — Home" readOnly />
        <TextInput label="Medicare Contractor (MAC)" value="CGS Administrators, LLC — J15" readOnly />
        {episode && (
          <>
            <TextInput label="Certifying Physician" value={episode.certifyingPhysicianName} readOnly />
            <TextInput label="Certifying Physician NPI" value={episode.certifyingPhysicianNpi} readOnly />
          </>
        )}
      </SimpleGrid>
    </Card>
  )
}

/** Condition & Billing section — UB-04 FL 6, 15-17 */
function ConditionSection({ claim, highlightTob }: { claim: { typeOfBill: string; fromDate: string; throughDate: string; submissionDate: string | null; hippsCode: string | null }; highlightTob?: boolean }) {
  return (
    <Card>
      <Group gap="xs" mb="sm">
        <Text fw={600}>Condition & Billing</Text>
        <Badge variant="light" color="gray" size="xs">FL 6, 15-17</Badge>
      </Group>
      <SimpleGrid cols={2}>
        <TextInput
          label="Type of Bill"
          value={claim.typeOfBill}
          readOnly
          styles={highlightTob ? { input: { borderColor: 'var(--mantine-color-orange-5)', borderWidth: 2 } } : undefined}
        />
        <TextInput label="Statement Covers Period" value={`${formatDate(claim.fromDate)} – ${formatDate(claim.throughDate)}`} readOnly />
        {claim.hippsCode && (
          <TextInput label="HIPPS Rate Code" value={claim.hippsCode} readOnly description="PDGM case-mix group for prospective payment" />
        )}
        {claim.submissionDate && (
          <TextInput label="Submission Date" value={formatDate(claim.submissionDate)} readOnly />
        )}
      </SimpleGrid>
    </Card>
  )
}
