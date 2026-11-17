import { Badge, Card, Group, Stack, Text } from '@mantine/core'
import type { Diagnosis } from '@/models'

interface DiagnosesSectionProps {
  diagnoses: Diagnosis[]
}

export function DiagnosesSection({ diagnoses }: DiagnosesSectionProps) {
  const sorted = [...diagnoses].sort((a, b) => a.sequence - b.sequence)

  return (
    <Card data-testid="diagnoses-section">
      <Text fw={600} mb="sm">Diagnoses</Text>
      <Stack gap="xs">
        {sorted.map((dx) => (
          <Group key={dx.id} data-testid="diagnosis-row">
            <Badge variant="filled" data-testid="icd10-code">{dx.icd10Code}</Badge>
            <Text fz="sm" data-testid="icd10-description">{dx.description}</Text>
            {dx.isPrincipal && (
              <Badge variant="light" color="blue" size="sm">Principal</Badge>
            )}
          </Group>
        ))}
      </Stack>
    </Card>
  )
}
