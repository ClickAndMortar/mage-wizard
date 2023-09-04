<template>
  <VCard elevation="3">
    <VCardTitle><VIcon>mdi-console</VIcon> Commands</VCardTitle>
    <VCardText>
      <VDataTable v-model:items-per-page="itemsPerPage" density="compact" :headers="headers" :items="commands || []" :loading="pending">
        <template #item.module="{ item }">
          <NuxtLink :to="{ name: 'modules-name', params: { name: item.columns.module } }"
            ><code>{{ item.columns.module }}</code></NuxtLink
          >
        </template>
        <template #item.command="{ item }">
          <code>{{ item.columns.command }}</code>
        </template>
        <template #item.class="{ item }">
          <code>{{ item.columns.class }}</code>
        </template>
      </VDataTable>
    </VCardText>
  </VCard>
</template>
<script setup lang="ts">
  useHead({
    title: 'Commands',
  })

  const { data: commands, pending } = useFetch('/api/commands')

  const itemsPerPage = 50

  const headers = [
    { title: 'Module', align: 'start', key: 'module', value: 'module.fqn', width: '15%' },
    { title: 'Command', align: 'start', key: 'command', width: '30%' },
    { title: 'Class', align: 'start', key: 'class', width: '30%' },
  ]
</script>
