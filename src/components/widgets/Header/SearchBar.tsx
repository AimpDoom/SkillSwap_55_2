import styles from './SearchBar.module.css'

export function SearchBar() {
  return (
    <label className={styles.search}>
      <svg className={styles.icon} viewBox="0 0 20 20" aria-hidden="true">
        <circle cx="8.5" cy="8.5" r="5.25" />
        <path d="m12.4 12.4 4.1 4.1" />
      </svg>

      <input
        className={styles.input}
        type="search"
        placeholder="Искать навык"
        aria-label="Искать навык"
      />
    </label>
  )
}
