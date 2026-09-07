import { configureStore } from '@reduxjs/toolkit'

import { notificationsReducer, persistNotifications } from '@/entities/notification'

export const store = configureStore({
  reducer: {
    notifications: notificationsReducer,
  },
})

let previousNotificationItems = store.getState().notifications.items

store.subscribe(() => {
  const items = store.getState().notifications.items
  if (items !== previousNotificationItems) {
    previousNotificationItems = items
    persistNotifications(items)
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
