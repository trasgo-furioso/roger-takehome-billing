import { useState } from 'react'
import { Button, NumberInput, Stack } from '@mantine/core'
import { useClaimsStore, useUIStore } from '@/stores'
import dayjs from 'dayjs'

interface PaymentFormProps {
  claimId: string
  expectedAmount: number
}

export function PaymentForm({ claimId, expectedAmount }: PaymentFormProps) {
  const [paymentAmount, setPaymentAmount] = useState<number>(expectedAmount)
  const [contractualAdjustment, setContractualAdjustment] = useState<number>(0)
  const [deductibleAmount, setDeductibleAmount] = useState<number>(0)
  const [otherAdjustment, setOtherAdjustment] = useState<number>(0)
  const postPayment = useClaimsStore((s) => s.postPayment)
  const collapseCard = useUIStore((s) => s.collapseCard)

  const handleConfirm = () => {
    postPayment(claimId, {
      paymentAmount,
      contractualAdjustment,
      deductibleAmount,
      otherAdjustment,
      checkEftReference: 'AUTO-' + Date.now(),
      remittanceDate: dayjs().format('YYYY-MM-DD'),
    })
    collapseCard()
  }

  return (
    <Stack gap="sm" mt="md">
      <NumberInput
        label="Payment Amount"
        prefix="$"
        thousandSeparator
        value={paymentAmount}
        onChange={(v) => setPaymentAmount(Number(v) || 0)}
      />
      <NumberInput
        label="Contractual Adjustment"
        prefix="$"
        thousandSeparator
        value={contractualAdjustment}
        onChange={(v) => setContractualAdjustment(Number(v) || 0)}
      />
      <NumberInput
        label="Deductible"
        prefix="$"
        thousandSeparator
        value={deductibleAmount}
        onChange={(v) => setDeductibleAmount(Number(v) || 0)}
      />
      <NumberInput
        label="Other Adjustment"
        prefix="$"
        thousandSeparator
        value={otherAdjustment}
        onChange={(v) => setOtherAdjustment(Number(v) || 0)}
      />
      <Button color="green" onClick={handleConfirm}>
        Confirm Payment
      </Button>
    </Stack>
  )
}
