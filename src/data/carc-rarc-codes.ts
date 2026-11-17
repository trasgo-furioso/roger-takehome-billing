export const carcCodes: Record<string, string> = {
  'CO-4': 'The procedure code is inconsistent with the modifier used, or a required modifier is missing.',
  'CO-16': 'Claim/service lacks information or has submission/billing error(s).',
  'CO-27': 'Expenses incurred after coverage terminated.',
  'CO-29': 'The time limit for filing has expired.',
  'CO-50': 'Non-covered service because it is not deemed a medical necessity.',
  'PR-1': 'Deductible amount.',
  'PR-2': 'Coinsurance amount.',
  'OA-23': 'Payment adjusted because charges were paid by another payer.',
}

export const rarcCodes: Record<string, string> = {
  'N362': 'Missing/incomplete/invalid number of days or units of service.',
  'N386': 'This decision was based on a National Coverage Determination (NCD).',
  'MA130': 'Your claim contains incomplete and/or invalid information.',
  'N657': 'This claim/service is not payable under our plan.',
  'M76': 'Missing/incomplete/invalid diagnosis or condition.',
  'N479': 'Missing Explanation of Benefits (Coordination of Benefits or Medicare Secondary Payer).',
}
