import { Center, Stack, Text } from '@mantine/core'
import { useNavigate } from '@tanstack/react-router'
import { ClaimCard } from './ClaimCard'
import { useClaimsStore } from '@/stores'
import type { ClaimSearchParams } from './FilterPanel'

interface ClaimListProps {
  searchParams: ClaimSearchParams
}

export function ClaimList({ searchParams }: ClaimListProps) {
  const { getClaimsFiltered, getPatientById } = useClaimsStore()
  const navigate = useNavigate()
  const claims = getClaimsFiltered(searchParams)

  if (claims.length === 0) {
    return (
      <Center py="xl">
        <Text c="dimmed">No claims match your filters.</Text>
      </Center>
    )
  }

  return (
    <Stack gap="md">
      {claims.map((claim) => {
        const patient = getPatientById(claim.patientId)
        if (!patient) return null
        return (
          <ClaimCard
            key={claim.id}
            claim={claim}
            patient={patient}
            onCardClick={() => navigate({ to: '/claims/$claimId', params: { claimId: claim.id } })}
          />
        )
      })}
    </Stack>
  )
}
