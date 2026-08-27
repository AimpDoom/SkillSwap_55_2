import type { Notification } from './types';

// Мок-данные для примера
export const mockNotifications: Notification[] = [
  {
    id: 1,
    user: 'Николай',
    message: 'принял ваш обмен',
    detail: 'Перейдите в профиль, чтобы обсудить детали',
    date: 'сегодня',
    isRead: false,
    skillId: 'skill-1',
  },
  {
    id: 2,
    user: 'Татьяна',
    message: 'приняла ваш обмен',
    detail: 'Перейдите в профиль, чтобы обсудить детали',
    date: 'сегодня',
    isRead: false,
    skillId: 'skill-2',
  },
  {
    id: 3,
    user: 'Олег',
    message: 'принял ваш обмен',
    detail: 'Перейдите в профиль, чтобы обсудить детали',
    date: 'вчера',
    isRead: true,
    skillId: 'skill-3',
  },
  {
    id: 4,
    user: 'Игорь',
    message: 'принял ваш обмен',
    detail: 'Перейдите в профиль, чтобы обсудить детали',
    date: '23 мая',
    isRead: true,
    skillId: 'skill-4',
  },
];
