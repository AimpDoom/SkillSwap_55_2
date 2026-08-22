import type { RoleValue } from './FiltersSidebar';
import styles from './FiltersSidebar.module.css';

type RoleFilterProps = {
  value: RoleValue;
  onChange: (value: RoleValue) => void;
};

const roles: Array<{
  label: string;
  value: RoleValue;
}> = [
  {
    label: 'Всё',
    value: 'all',
  },
  {
    label: 'Хочу научиться',
    value: 'learn',
  },
  {
    label: 'Могу научить',
    value: 'teach',
  },
];

export const RoleFilter = ({
  value,
  onChange,
}: RoleFilterProps) => {
  return (
    <section className={styles.options} aria-label="Тип обмена">
      {roles.map((role) => (
        <label className={styles.option} key={role.value}>
          <input
            className={styles.control}
            type="radio"
            name="role"
            value={role.value}
            checked={value === role.value}
            onChange={() => onChange(role.value)}
          />

          <span
            className={styles.radioVisual}
            aria-hidden="true"
          />

          <span>{role.label}</span>
        </label>
      ))}
    </section>
  );
};
