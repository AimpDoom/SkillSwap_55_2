import { useState } from 'react'

import { useCities } from '@/entities/city'
import ChevronDownIcon from '@/shared/assets/icons/chevron-down.svg?react'
import ChevronUpIcon from '@/shared/assets/icons/chevron-up.svg?react'
import { Checkbox } from '@/shared/ui/Checkbox'

import styles from './FiltersSidebar.module.css'

type CityFilterProps = {
  selectedCities: string[]
  onToggleCity: (city: string) => void
}

const INITIAL_CITIES_COUNT = 5

export const CityFilter = ({ selectedCities, onToggleCity }: CityFilterProps) => {
  const [showAllCities, setShowAllCities] = useState(false)
  const { cities } = useCities()

  const visibleCities = showAllCities ? cities : cities.slice(0, INITIAL_CITIES_COUNT)

  return (
    <section className={styles.group}>
      <h3 className={styles.sectionTitle}>Город</h3>

      <div className={styles.options}>
        {visibleCities.map((city) => (
          <Checkbox
            key={city.id}
            className={styles.option}
            checked={selectedCities.includes(city.id)}
            label={city.name}
            onChange={() => onToggleCity(city.id)}
          />
        ))}

        <button
          className={styles.linkButton}
          type="button"
          onClick={() => setShowAllCities((current) => !current)}
          aria-expanded={showAllCities}
        >
          <span>{showAllCities ? 'Скрыть города' : 'Все города'}</span>

          <span className={styles.chevron} aria-hidden="true">
            {showAllCities ? (
                <ChevronUpIcon className={styles.chevronIcon} aria-hidden="true" />
              ) : (
                <ChevronDownIcon className={styles.chevronIcon} aria-hidden="true" />
              )}
          </span>
        </button>
      </div>
    </section>
  )
}
