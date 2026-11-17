import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { z } from 'zod/v4'
import { Button } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconFilter } from '@tabler/icons-react'
import { ContentHeader } from '@/components/layout/ContentHeader'
import { FilterPanel } from '@/components/claims/FilterPanel'
import { FilterChips } from '@/components/claims/FilterChips'
import { ClaimList } from '@/components/claims/ClaimList'

const searchSchema = z.object({
  status: z.string().optional().catch(undefined),
  payer: z.string().optional().catch(undefined),
  dateFrom: z.string().optional().catch(undefined),
  dateTo: z.string().optional().catch(undefined),
  patient: z.string().optional().catch(undefined),
  aging: z.string().optional().catch(undefined),
})

export const Route = createFileRoute('/claims/')({
  validateSearch: (search) => searchSchema.parse(search),
  component: ClaimsPage,
})

function ClaimsPage() {
  const searchParams = Route.useSearch()
  const navigate = useNavigate()
  const [filterOpen, { toggle: toggleFilter }] = useDisclosure(false)

  const hasActiveFilters = Object.values(searchParams).some(
    (v) => v !== undefined && v !== '',
  )

  const handleRemoveFilter = (key: string) => {
    const newParams = { ...searchParams, [key]: undefined }
    const cleaned = Object.fromEntries(
      Object.entries(newParams).filter(([, v]) => v !== undefined && v !== ''),
    )
    navigate({ to: '/claims', search: cleaned })
  }

  return (
    <>
      <ContentHeader
        title="Claims"
        action={
          <Button
            variant={filterOpen ? 'filled' : 'light'}
            leftSection={<IconFilter size={16} />}
            onClick={toggleFilter}
          >
            Filter
          </Button>
        }
      />

      {!filterOpen && hasActiveFilters && (
        <FilterChips searchParams={searchParams} onRemove={handleRemoveFilter} />
      )}

      <FilterPanel expanded={filterOpen} searchParams={searchParams} />

      <ClaimList searchParams={searchParams} />
    </>
  )
}
