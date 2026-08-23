import { useState } from 'react'

import type { AuthFormValues, RegistrationDraft, RegistrationStep } from './types'

const INITIAL_REGISTRATION_DRAFT: RegistrationDraft = {
  account: null,
}

export function useRegistrationFlow() {
  const [currentStep, setCurrentStep] = useState<RegistrationStep>(1)

  const [draft, setDraft] = useState<RegistrationDraft>(INITIAL_REGISTRATION_DRAFT)

  const saveAccount = (values: AuthFormValues) => {
    setDraft((current) => ({
      ...current,
      account: values,
    }))
  }

  const goToStep = (step: RegistrationStep) => {
    setCurrentStep(step)
  }

  const goNext = () => {
    setCurrentStep((current) => (current < 3 ? ((current + 1) as RegistrationStep) : current))
  }

  const goBack = () => {
    setCurrentStep((current) => (current > 1 ? ((current - 1) as RegistrationStep) : current))
  }

  const reset = () => {
    setCurrentStep(1)
    setDraft(INITIAL_REGISTRATION_DRAFT)
  }

  return {
    currentStep,
    draft,
    saveAccount,
    goToStep,
    goNext,
    goBack,
    reset,
  }
}
