import { clsx } from 'clsx'
import { Text } from '@/shared/ui/Text'
import styles from './Stepper.module.css'

type StepperProps = {
  current: number
  total: number
}

export function Stepper({ current, total }: StepperProps) {
  return (
    <div className={styles.wrapper}>
      <Text variant="h2" className={styles.label}>
        Шаг {current} из {total}
      </Text>
      <div className={styles.track}>
        {Array.from({ length: total }, (_, index) => (
          <span key={index} className={clsx(styles.segment, index < current && styles.filled)} />
        ))}
      </div>
    </div>
  )
}
