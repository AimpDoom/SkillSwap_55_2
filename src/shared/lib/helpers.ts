/** Форматирует дату в читаемый вид */
export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateString))
}

/** Обрезает строку до maxLength символов */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength).trimEnd() + '...'
}

/** Генерирует уникальный id */
export function generateId(): string {
  return crypto.randomUUID()
}

export function calculateAge(birthDate: string): number {
  const birth = new Date(birthDate)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  return age
}

// Функция для склонения слова "год" в зависимости от возраста
export function yearSpell(age: number): string {
  const lastDigit = age % 10
  const lastTwoDigits = age % 100
  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return 'лет'
  }
  switch (lastDigit) {
    case 1:
      return 'год'
    case 2:
    case 3:
    case 4:
      return 'года'
    default:
      return 'лет'
  }
}
