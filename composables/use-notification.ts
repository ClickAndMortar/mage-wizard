import { defu } from 'defu'
import type { Notification } from '~/lib/types'

const notifications = ref<Map<string, Notification>>(new Map())

const notificationDefaults: Partial<Notification> = {
  type: 'info',
  duration: 3000,
}

export default function () {
  return {
    notifications,
    notify: (notification: Notification) => {
      addNotification(defu(notification, notificationDefaults))
    },
  }
}

function addNotification(notification: Notification) {
  const notificationId = self.crypto.randomUUID()

  notifications.value.set(notificationId, notification)
  setTimeout(() => removeNotification(notificationId), 5000)
}

function removeNotification(notificationId: string) {
  notifications.value.delete(notificationId)
}
