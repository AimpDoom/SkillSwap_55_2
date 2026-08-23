import styles from './Stepper.module.css'

export type StepperStep = 1 | 2 | 3

type StepperProps = {
  currentStep: StepperStep
  className?: string
}

const STEPS: StepperStep[] = [1, 2, 3]

export function Stepper({ currentStep, className = '' }: StepperProps) {
  return (
    <div
      className={`${styles.stepper} ${className}`}
      aria-label={`Шаг ${currentStep} из 3`}
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={3}
      aria-valuenow={currentStep}
    >
      {STEPS.map((step) => (
        <span
          key={step}
          className={`${styles.segment} ${step <= currentStep ? styles.active : ''}`}
          aria-hidden="true"
        />
      ))}
    </div>
  )
}
