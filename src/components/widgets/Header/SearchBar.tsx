import { Input } from '@/shared/ui/Input'

import styles from './SearchBar.module.css'

export function SearchBar() {
  return (
    <Input
      className={styles.search}
      type="search"
      placeholder="Искать навык"
      aria-label="Искать навык"
      startIcon={<span className={styles.icon} />}
    />
  )
}