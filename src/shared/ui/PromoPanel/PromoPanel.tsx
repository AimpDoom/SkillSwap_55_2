import type { ReactNode } from 'react'
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
      <h2 className={styles.title}>
        {title}
      </h2>
      <p className={styles.description}>
        {description}
      </p>
    </div>
  )
}
