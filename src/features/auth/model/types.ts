export interface AuthUser {
  id: string
  name: string
  email: string
  token: string
}

export type AuthFormMode = 'login' | 'register'

export type AuthFormValues = {
  email: string
  password: string
}

export type RegistrationStep = 1 | 2 | 3

export type RegistrationDraft = {
  account: AuthFormValues | null
}
