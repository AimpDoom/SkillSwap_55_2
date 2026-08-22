import { useEffect, useState } from 'react';

import bookIcon from '@/shared/assets/icons/categories/book.svg';
import briefcaseIcon from '@/shared/assets/icons/categories/briefcase.svg';
import globalIcon from '@/shared/assets/icons/categories/global.svg';
import homeIcon from '@/shared/assets/icons/categories/home.svg';
import lifestyleIcon from '@/shared/assets/icons/categories/lifestyle.svg';
import paletteIcon from '@/shared/assets/icons/categories/palette.svg';

import styles from './AllSkillsDropdown.module.css';

type Subcategory = {
  id: string;
  name: string;
  categoryId: string;
};

type Category = {
  id: string;
  name: string;
  subcategories: Subcategory[];
};

const categoryVisuals: Record<
  string,
  {
    icon: string;
    className: string;
  }
> = {
  'business-career': {
    icon: briefcaseIcon,
    className: styles.business,
  },
  'creativity-art': {
    icon: paletteIcon,
    className: styles.creativity,
  },
  'foreign-languages': {
    icon: globalIcon,
    className: styles.languages,
  },
  'education-development': {
    icon: bookIcon,
    className: styles.education,
  },
  'home-comfort': {
    icon: homeIcon,
    className: styles.home,
  },
  'health-lifestyle': {
    icon: lifestyleIcon,
    className: styles.health,
  },
};

export function AllSkillsDropdown() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const controller = new AbortController();

    const loadCategories = async () => {
      try {
        const response = await fetch('/db/categories.json', {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error('Не удалось загрузить категории');
        }

        const data = (await response.json()) as Category[];

        setCategories(data);
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          return;
        }

        setCategories([]);
      }
    };

    void loadCategories();

    return () => {
      controller.abort();
    };
  }, []);

  const columns = [
    {
      id: 'left',
      categories: categories.filter((_, index) => index % 2 === 0),
    },
    {
      id: 'right',
      categories: categories.filter((_, index) => index % 2 !== 0),
    },
  ];

  return (
    <div
      className={styles.dropdown}
      role="region"
      aria-label="Все категории навыков"
    >
      {columns.map((column) => (
        <div className={styles.column} key={column.id}>
          {column.categories.map((category) => {
            const visual = categoryVisuals[category.id];

            return (
              <section className={styles.category} key={category.id}>
                {visual && (
                  <div
                    className={`${styles.iconWrapper} ${visual.className}`}
                    aria-hidden="true"
                  >
                    <img
                      className={styles.icon}
                      src={visual.icon}
                      alt=""
                    />
                  </div>
                )}

                <div className={styles.categoryContent}>
                  <h2 className={styles.categoryTitle}>
                    {category.name}
                  </h2>

                  <ul className={styles.subcategories}>
                    {category.subcategories.map((subcategory) => (
                      <li
                        className={styles.subcategory}
                        key={subcategory.id}
                      >
                        {subcategory.name}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            );
          })}
        </div>
      ))}
    </div>
  );
}
