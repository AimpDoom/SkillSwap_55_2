// TODO: реализовать страницу CatalogPage

import { FiltersSidebar } from '@/components/widgets/FiltersSidebar';

import styles from './CatalogPage.module.css';

export default function CatalogPage() {
  return (
    <main className={styles.page}>
      <FiltersSidebar />
    </main>
  );
}
