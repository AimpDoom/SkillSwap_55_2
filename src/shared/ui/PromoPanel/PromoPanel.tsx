import type { ReactNode } from 'react'
import { Text } from '@/shared/ui/Text'
import styles from './PromoPanel.module.css'

export interface PromoPanelProps {
  image: ReactNode
  title: string
  description: string
}

export const PromoPanel = ({ image, title, description }: PromoPanelProps) => {
  return (
    <div className={styles.panel}>
      {image}
      <Text variant="h2" className={styles.title}>
        {title}
      </Text>
      <Text variant="body" className={styles.description}>
        {description}
      </Text>
    </div>
  )
}
