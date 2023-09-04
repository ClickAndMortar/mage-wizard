<template>
  <div class="notificationContainer">
    <v-slide-y-transition group>
      <v-alert
        v-for="(notification, kN) in notifications.values()"
        :key="`notification-${kN}`"
        :type="notification.type"
        :title="notification.title"
        variant="elevated"
        width="400px"
      >{{ notification.message }}</v-alert
      >
    </v-slide-y-transition>
  </div>
</template>
<script setup lang="ts">
const notifications: Ref<Map<string, Notification>> = useNotification().notifications
</script>
