export interface Notification {
  id: string | number
  recipientUserId: string
  user: string
  message: string
  detail: string
  date: string | null
  isRead: boolean
  skillId: string
}

export interface NotificationCardProps {
  notifications: Notification[]
  onClose?: () => void
  onNotificationRead?: (id: string | number) => void
  onMarkAllAsRead?: () => void
  onClearRead?: () => void
}

export interface NotificationSection {
  title: string
  notifications: Notification[]
  action?: {
    label: string
    handler: () => void
  }
}
