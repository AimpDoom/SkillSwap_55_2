import type { GenderValue } from './FiltersSidebar';
import styles from './FiltersSidebar.module.css';

type GenderFilterProps = {
  value: GenderValue;
  onChange: (value: GenderValue) => void;
};

const genders: Array<{
  label: string;
  value: GenderValue;
}> = [
  {
    label: 'Не имеет значения',
    value: 'any',
  },
  {
    label: 'Мужской',
    value: 'male',
  },
  {
    label: 'Женский',
    value: 'female',
  },
];

export const GenderFilter = ({
  value,
  onChange,
}: GenderFilterProps) => {
  return (
    <section className={styles.group}>
      <h3 className={styles.sectionTitle}>Пол автора</h3>

      <div className={styles.options}>
        {genders.map((gender) => (
          <label className={styles.option} key={gender.value}>
            <input
              className={styles.control}
              type="radio"
              name="gender"
              value={gender.value}
              checked={value === gender.value}
              onChange={() => onChange(gender.value)}
            />

            <span
              className={styles.radioVisual}
              aria-hidden="true"
            />

            <span>{gender.label}</span>
          </label>
        ))}
      </div>
    </section>
  );
};
