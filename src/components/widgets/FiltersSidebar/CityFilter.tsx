import chevronDown from '@/shared/assets/icons/chevron-down.svg'
import { Checkbox } from '@/shared/ui/Checkbox'

import styles from './FiltersSidebar.module.css'

type CityFilterProps = {
  selectedCities: string[]
  onToggleCity: (city: string) => void
}

const cities = ['Москва', 'Санкт-Петербург', 'Новосибирск', 'Екатеринбург', 'Казань']

export const CityFilter = ({ selectedCities, onToggleCity }: CityFilterProps) => {
  return (
    <section className={styles.group}>
      <h3 className={styles.sectionTitle}>Город</h3>

      <div className={styles.options}>
        {cities.map((city) => (
          <Checkbox
            key={city}
            className={styles.option}
            checked={selectedCities.includes(city)}
            label={city}
            onChange={() => onToggleCity(city)}
          />
        ))}

        <button className={styles.linkButton} type="button">
          <span>Все города</span>

          <span className={styles.chevron} aria-hidden="true">
            <img className={styles.chevronIcon} src={chevronDown} alt="" />
          </span>
        </button>
      </div>
    </section>
  )
}
