import type { User } from '@/entities/user'

import type { Notification } from './types'

function getAcceptedVerb(gender: User['gender']): string {
  return gender === 'female' ? 'приняла' : 'принял'
}

export function formatNotificationDate(value: string | null): string | null {
  if (!value) {
    return null
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startOfNotificationDay = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const daysDifference = Math.round(
    (startOfToday.getTime() - startOfNotificationDay.getTime()) / (24 * 60 * 60 * 1000),
  )
  const time = new Intl.DateTimeFormat('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)

  if (daysDifference === 0) {
    return `сегодня, ${time}`
  }

  if (daysDifference === 1) {
    return `вчера, ${time}`
  }

  const calendarDate = new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)

  return `${calendarDate}, ${time}`
}

export function createExchangeAcceptedNotification(
  author: User,
  skillId: string,
  recipientUserId: string,
): Notification {
  return {
    id: `notif_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    recipientUserId,
    user: author.name,
    message: `${getAcceptedVerb(author.gender)} ваш обмен`,
    detail: 'Перейдите в профиль, чтобы обсудить детали',
    date: new Date().toISOString(),
    isRead: false,
    skillId,
  }
}
