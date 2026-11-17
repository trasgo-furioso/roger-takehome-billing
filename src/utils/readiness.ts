import type { Claim, Episode, ReadinessCheck } from '@/models'
import { revenueCodes } from '@/data/revenue-codes'

export function computeReadiness(claim: Claim, episode: Episode): ReadinessCheck {
  const oasisAccepted = claim.opiAssessment.status === 'Accepted'
  const planOfCareSigned = episode.planOfCareSigned
  const allVisitsDocumented = true // Always true in prototype (no visit tracking)
  const attendingPhysicianNpi = claim.attendingPhysicianNpi.length > 0
  const diagnosesCoded = claim.diagnoses.length > 0
  const hippsCodeGenerated = claim.hippsCode !== null && claim.hippsCode.length > 0
  const revenueCodesValid = claim.serviceLines.every(
    (sl) => sl.revenueCode in revenueCodes,
  )

  const allPassing =
    oasisAccepted &&
    planOfCareSigned &&
    allVisitsDocumented &&
    attendingPhysicianNpi &&
    diagnosesCoded &&
    hippsCodeGenerated &&
    revenueCodesValid

  return {
    oasisAccepted,
    planOfCareSigned,
    allVisitsDocumented,
    attendingPhysicianNpi,
    diagnosesCoded,
    hippsCodeGenerated,
    revenueCodesValid,
    allPassing,
  }
}
