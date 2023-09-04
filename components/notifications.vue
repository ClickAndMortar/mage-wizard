<template>
  <div class="notificationContainer">
    <VSlideYTransition group>
      <VAlert
        v-for="(notification, kN) in notifications.values()"
        :key="`notification-${kN}`"
        :type="notification.type ? notification.type : 'info'"
        :title="notification.title ? notification.title : ''"
        variant="elevated"
        width="400px"
        >{{ notification.message }}</VAlert
      >
    </VSlideYTransition>
  </div>
</template>
<script setup lang="ts">
  const notifications = useNotification().notifications
</script>
