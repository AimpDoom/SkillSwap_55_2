import { useLocation, useNavigate } from 'react-router-dom'

import { ROUTES } from '@/shared/lib/constants'
import { Input } from '@/shared/ui/Input'

import styles from './SearchBar.module.css'

export function SearchBar() {
  const location = useLocation()
  const navigate = useNavigate()

  const searchValue = new URLSearchParams(location.search).get('search') ?? ''

  const handleSearchChange = (value: string) => {
    const searchParams = new URLSearchParams()

    if (value.trim().length > 0) {
      searchParams.set('search', value)
    }

    const nextSearch = searchParams.toString()

    navigate(
      {
        pathname: ROUTES.HOME,
        search: nextSearch ? `?${nextSearch}` : '',
      },
      {
        replace: location.pathname === ROUTES.HOME,
      },
    )
  }

  return (
    <Input
      className={styles.search}
      type="search"
      value={searchValue}
      placeholder="Искать навык"
      aria-label="Искать навык"
      startIcon={<span className={styles.icon} />}
      onChange={(event) => handleSearchChange(event.target.value)}
    />
  )
}
