import reducer, {
  clearRead,
  dismissToast,
  markAllAsRead,
  notificationCreated,
  notificationRead,
} from './slice'
import type { Notification } from './types'
import { describe, expect, it } from 'vitest'

let seq = 0
const makeNotification = (
  overrides: Partial<Notification> = {},
): Notification => ({
  id: ++seq,
  recipientUserId: 'user-42',
  user: 'user',
  message: 'Новое уведомление',
  detail: 'Детали уведомления',
  date: '2026-09-11',
  isRead: false,
  skillId: 'skill-001',
  ...overrides,
})

describe('notificationsSlice', () => {
  describe('notificationCreated', () => {
    it('кладёт новое уведомление в начало, а id — в конец toastIds', () => {
      const old = makeNotification({ id: 1, recipientUserId: 'user-42' })
      const fresh = makeNotification({ id: 2, recipientUserId: 'user-7' })

      const state = { items: [old], toastIds: [1] }
      const result = reducer(state, notificationCreated(fresh))

      expect(result.items).toEqual([fresh, old])
      expect(result.toastIds).toEqual([1, 2])
    })

    it('не падает на пустом стейте', () => {
      const n = makeNotification({ id: 10 })
      const result = reducer(
        { items: [], toastIds: [] },
        notificationCreated(n),
      )
      expect(result.items).toEqual([n])
      expect(result.toastIds).toEqual([10])
    })

    it('сохраняет уведомление с id = 0', () => {
      const n = makeNotification({ id: 0 })
      const result = reducer(
        { items: [], toastIds: [] },
        notificationCreated(n),
      )
      expect(result.items[0].id).toBe(0)
      expect(result.toastIds).toContain(0)
    })
  })

  describe('notificationRead', () => {
    it('помечает только нужное уведомление', () => {
      const a = makeNotification({ id: 1, isRead: false })
      const b = makeNotification({ id: 2, isRead: false })

      const result = reducer(
        { items: [a, b], toastIds: [] },
        notificationRead(1),
      )

      expect(result.items[0].isRead).toBe(true)
      expect(result.items[1].isRead).toBe(false)
    })

    it('молча игнорирует несуществующий id', () => {
      const n = makeNotification({ id: 1, isRead: false })
      const result = reducer(
        { items: [n], toastIds: [] },
        notificationRead(404),
      )
      expect(result.items).toEqual([n])
    })

    it('повторное чтение уже прочитанного ничего не ломает', () => {
      const n = makeNotification({ id: 5, isRead: true })
      const result = reducer(
        { items: [n], toastIds: [] },
        notificationRead(5),
      )
      expect(result.items[0].isRead).toBe(true)
    })
  })

  describe('markAllAsRead', () => {
    it('проставляет isRead только своим уведомлениям', () => {
      const mine = makeNotification({
        id: 1,
        recipientUserId: 'user-42',
        isRead: false,
      })
      const foreign = makeNotification({
        id: 2,
        recipientUserId: 'user-7',
        isRead: false,
      })

      const result = reducer(
        { items: [mine, foreign], toastIds: [] },
        markAllAsRead('user-42'),
      )

      expect(result.items[0].isRead).toBe(true)
      expect(result.items[1].isRead).toBe(false)
    })

    it('чужому пользователю ничего не отмечает', () => {
      const n = makeNotification({
        recipientUserId: 'user-42',
        isRead: false,
      })
      const result = reducer(
        { items: [n], toastIds: [] },
        markAllAsRead('user-7'),
      )
      expect(result.items[0].isRead).toBe(false)
    })

    it('переживает пустой список', () => {
      const result = reducer(
        { items: [], toastIds: [] },
        markAllAsRead('user-42'),
      )
      expect(result.items).toEqual([])
    })
  })

  describe('clearRead', () => {
    it('удаляет прочитанные только у текущего пользователя', () => {
      const readMine = makeNotification({
        id: 1,
        recipientUserId: 'user-42',
        isRead: true,
      })
      const unreadMine = makeNotification({
        id: 2,
        recipientUserId: 'user-42',
        isRead: false,
      })
      const readForeign = makeNotification({
        id: 3,
        recipientUserId: 'user-7',
        isRead: true,
      })

      const result = reducer(
        {
          items: [readMine, unreadMine, readForeign],
          toastIds: [],
        },
        clearRead('user-42'),
      )

      expect(result.items).toEqual([unreadMine, readForeign])
    })

    it('ничего не трогает, если пользователя нет в списке', () => {
      const n = makeNotification({
        id: 1,
        recipientUserId: 'user-42',
        isRead: true,
      })
      const result = reducer(
        { items: [n], toastIds: [] },
        clearRead('user-7'),
      )
      expect(result.items).toEqual([n])
    })

    it('очищает весь список, когда всё прочитано', () => {
      const a = makeNotification({
        recipientUserId: 'user-42',
        isRead: true,
      })
      const b = makeNotification({
        recipientUserId: 'user-42',
        isRead: true,
      })
      const result = reducer(
        { items: [a, b], toastIds: [] },
        clearRead('user-42'),
      )
      expect(result.items).toHaveLength(0)
    })
  })

  describe('dismissToast', () => {
    it('выкидывает конкретный id', () => {
      const result = reducer(
        { items: [], toastIds: [1, 2, 3] },
        dismissToast(2),
      )
      expect(result.toastIds).toEqual([1, 3])
    })

    it('сохраняет порядок оставшихся id', () => {
      const result = reducer(
        { items: [], toastIds: [5, 3, 9, 1] },
        dismissToast(3),
      )
      expect(result.toastIds).toEqual([5, 9, 1])
    })

    it('ничего не делает для отсутствующего id', () => {
      const result = reducer(
        { items: [], toastIds: [1, 2] },
        dismissToast(404),
      )
      expect(result.toastIds).toEqual([1, 2])
    })
  })
})