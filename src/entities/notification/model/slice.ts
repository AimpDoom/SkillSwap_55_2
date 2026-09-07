import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import { getNotifications } from './notificationStorage'
import type { Notification } from './types'

interface NotificationsState {
  items: Notification[]
  toastIds: Array<string | number>
}

const initialState: NotificationsState = {
  items: getNotifications(),
  toastIds: [],
}

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    notificationCreated: (state, action: PayloadAction<Notification>) => {
      state.items.unshift(action.payload)
      state.toastIds.push(action.payload.id)
    },
    notificationRead: (state, action: PayloadAction<string | number>) => {
      const notification = state.items.find((item) => item.id === action.payload)
      if (notification) {
        notification.isRead = true
      }
    },
    markAllAsRead: (state, action: PayloadAction<string>) => {
      state.items
        .filter((item) => item.recipientUserId === action.payload)
        .forEach((item) => {
          item.isRead = true
        })
    },
    clearRead: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        (item) => item.recipientUserId !== action.payload || !item.isRead,
      )
    },
    dismissToast: (state, action: PayloadAction<string | number>) => {
      state.toastIds = state.toastIds.filter((id) => id !== action.payload)
    },
  },
})

export const { notificationCreated, notificationRead, markAllAsRead, clearRead, dismissToast } =
  notificationsSlice.actions

export default notificationsSlice.reducer
