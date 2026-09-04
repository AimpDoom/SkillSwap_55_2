import type { User } from '@/entities/user/model/types'

import type { Notification } from './types'

function getAcceptedVerb(gender: User['gender']): string {
  return gender === 'female' ? 'приняла' : 'принял'
}

export function createExchangeAcceptedNotification(author: User, skillId: string): Notification {
  return {
    id: `notif_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    user: author.name,
    message: `${getAcceptedVerb(author.gender)} ваш обмен`,
    detail: 'Перейдите в профиль, чтобы обсудить детали',
    date: 'сегодня',
    isRead: false,
    skillId,
  }
}
