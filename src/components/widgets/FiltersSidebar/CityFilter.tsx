import chevronDown from '@/shared/assets/icons/chevron-down.svg';

import styles from './FiltersSidebar.module.css';

type CityFilterProps = {
  selectedCities: string[];
  onToggleCity: (city: string) => void;
};

const cities = [
  'Москва',
  'Санкт-Петербург',
  'Новосибирск',
  'Екатеринбург',
  'Казань',
];

export const CityFilter = ({
  selectedCities,
  onToggleCity,
}: CityFilterProps) => {
  return (
    <section className={styles.group}>
      <h3 className={styles.sectionTitle}>Город</h3>

      <div className={styles.options}>
        {cities.map((city) => (
          <label className={styles.option} key={city}>
            <input
              className={styles.control}
              type="checkbox"
              checked={selectedCities.includes(city)}
              onChange={() => onToggleCity(city)}
            />

            <span
              className={styles.checkboxVisual}
              aria-hidden="true"
            />

            <span>{city}</span>
          </label>
        ))}

        <button className={styles.linkButton} type="button">
          <span>Все города</span>

          <span className={styles.chevron}>
            <img
              className={styles.chevronIcon}
              src={chevronDown}
              alt=""
              aria-hidden="true"
            />
          </span>
        </button>
      </div>
    </section>
  );
};
