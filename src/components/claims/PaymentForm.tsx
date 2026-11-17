import { useState } from 'react'
import { Button, Divider, Group, NumberInput, Stack, Text, TextInput } from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { IconFileInvoice } from '@tabler/icons-react'
import { useClaimsStore } from '@/stores'
import { formatCurrency } from '@/utils'
import dayjs from 'dayjs'

interface PaymentFormProps {
  claimId: string
  expectedAmount: number
}

export function PaymentForm({ claimId, expectedAmount }: PaymentFormProps) {
  const claim = useClaimsStore((s) => s.getClaimById(claimId))
  const [paymentAmount, setPaymentAmount] = useState<number>(expectedAmount)
  const [contractualAdjustment, setContractualAdjustment] = useState<number>(0)
  const [deductibleAmount, setDeductibleAmount] = useState<number>(0)
  const [otherAdjustment, setOtherAdjustment] = useState<number>(0)
  const [checkEftReference, setCheckEftReference] = useState<string>('')
  const [claimControlNumber, setClaimControlNumber] = useState<string>('')
  const [remittanceDate, setRemittanceDate] = useState<Date | null>(new Date())
  const postPayment = useClaimsStore((s) => s.postPayment)

  const totalAdjustments = contractualAdjustment + deductibleAmount + otherAdjustment
  const totalAccountedFor = paymentAmount + totalAdjustments
  const billedAmount = claim?.totalCharges ?? 0
  const variance = billedAmount - totalAccountedFor

  const handleConfirm = () => {
    postPayment(claimId, {
      paymentAmount,
      contractualAdjustment,
      deductibleAmount,
      otherAdjustment,
      checkEftReference: checkEftReference || 'EFT-' + Date.now(),
      claimControlNumber: claimControlNumber || 'DCN-' + claimId,
      remittanceDate: remittanceDate ? dayjs(remittanceDate).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
    })
  }

  return (
    <Stack gap="sm" mt="md">
      <Group gap="xs" mb={4}>
        <IconFileInvoice size={18} color="var(--mantine-color-blue-6)" />
        <Text fw={600} fz="sm">Post ERA/835 Remittance</Text>
      </Group>

      {/* Claim reference context */}
      <Group gap="lg" px="xs" py={6} style={{ background: 'var(--mantine-color-gray-0)', borderRadius: 6 }}>
        <div>
          <Text fz="xs" c="dimmed">Billed</Text>
          <Text fz="sm" fw={600}>{formatCurrency(billedAmount)}</Text>
        </div>
        <div>
          <Text fz="xs" c="dimmed">Expected (PDGM)</Text>
          <Text fz="sm" fw={500}>{formatCurrency(expectedAmount)}</Text>
        </div>
        <div>
          <Text fz="xs" c="dimmed">Claim ID</Text>
          <Text fz="sm" fw={500}>{claimId.toUpperCase()}</Text>
        </div>
      </Group>

      {/* ERA Header fields */}
      <Group grow>
        <TextInput
          label="Check/EFT Reference #"
          placeholder="e.g. EFT-20261101-001"
          description="From 835 remittance header"
          value={checkEftReference}
          onChange={(e) => setCheckEftReference(e.currentTarget.value)}
        />
        <TextInput
          label="Claim Control # (ICN)"
          placeholder="e.g. DCN-2026-091901"
          description="Payer's internal claim number"
          value={claimControlNumber}
          onChange={(e) => setClaimControlNumber(e.currentTarget.value)}
        />
      </Group>
      <DatePickerInput
        label="Remittance Date"
        description="Date on the 835/ERA"
        value={remittanceDate}
        onChange={setRemittanceDate}
        maxDate={new Date()}
        style={{ maxWidth: '50%' }}
      />

      <Divider label="Payment Breakdown" labelPosition="left" mt="xs" />

      <NumberInput
        label="Payment Amount"
        prefix="$"
        thousandSeparator
        value={paymentAmount}
        onChange={(v) => setPaymentAmount(Number(v) || 0)}
      />

      <Text fz="xs" fw={600} c="dimmed" mt={4}>Adjustments by CARC Group</Text>

      <NumberInput
        label="Contractual Obligation (CO)"
        description="Provider write-off per contract — e.g. CO-45, CO-97"
        prefix="$"
        thousandSeparator
        value={contractualAdjustment}
        onChange={(v) => setContractualAdjustment(Number(v) || 0)}
      />
      <NumberInput
        label="Patient Responsibility (PR)"
        description="Deductible, coinsurance, copay — e.g. PR-1, PR-2, PR-3"
        prefix="$"
        thousandSeparator
        value={deductibleAmount}
        onChange={(v) => setDeductibleAmount(Number(v) || 0)}
      />
      <NumberInput
        label="Other Adjustment (OA)"
        description="Other payer adjustments — e.g. OA-23"
        prefix="$"
        thousandSeparator
        value={otherAdjustment}
        onChange={(v) => setOtherAdjustment(Number(v) || 0)}
      />

      {/* Running totals */}
      <Group gap="lg" px="xs" py={8} mt={4} style={{ background: 'var(--mantine-color-gray-0)', borderRadius: 6 }}>
        <div>
          <Text fz="xs" c="dimmed">Payment</Text>
          <Text fz="sm" fw={500} c="green">{formatCurrency(paymentAmount)}</Text>
        </div>
        <div>
          <Text fz="xs" c="dimmed">Total Adj</Text>
          <Text fz="sm" fw={500} c="orange">{formatCurrency(totalAdjustments)}</Text>
        </div>
        <div>
          <Text fz="xs" c="dimmed">Accounted</Text>
          <Text fz="sm" fw={500}>{formatCurrency(totalAccountedFor)}</Text>
        </div>
        {variance !== 0 && (
          <div>
            <Text fz="xs" c="dimmed">Variance</Text>
            <Text fz="sm" fw={600} c="red">{formatCurrency(Math.abs(variance))}</Text>
          </div>
        )}
      </Group>

      <Button color="green" onClick={handleConfirm} mt="xs">
        Confirm Payment
      </Button>
    </Stack>
  )
}
