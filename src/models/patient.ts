export interface Address {
  street: string
  city: string
  state: string
  zip: string
}

export interface Patient {
  id: string
  firstName: string
  lastName: string
  dateOfBirth: string
  sex: 'M' | 'F'
  address: Address
  mbi: string
  coverageActive: boolean
}
