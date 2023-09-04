<template>
  <VCard elevation="3">
    <VCardTitle><VIcon>mdi-power-plug-outline</VIcon> Plugins</VCardTitle>
    <VCardText>
      <VDataTable v-model:items-per-page="itemsPerPage" density="compact" :headers="headers" :items="plugins || []" :loading="pending">
        <template #item.module="{ item }">
          <NuxtLink :to="{ name: 'modules-name', params: { name: item.columns.module } }"
            ><code>{{ item.columns.module }}</code></NuxtLink
          >
        </template>
        <template #item.class="{ item }">
          <code>{{ item.columns.class }}</code>
        </template>
        <template #item.type="{ item }">
          <code>{{ item.columns.type }}</code>
        </template>
        <template #item.methods="{ item }">
          <code v-if="item.columns.methods.length > 0">{{ item.columns.methods[0] }}</code>
          <VChip v-if="item.columns.methods.length > 1" class="ml-2" size="x-small">+{{ item.columns.methods.length - 1 }}</VChip>
        </template>
      </VDataTable>
    </VCardText>
  </VCard>
</template>
<script setup lang="ts">
  useHead({
    title: 'Plugins',
  })

  const { data: plugins, pending } = useFetch('/api/plugins')

  const itemsPerPage = 50

  const headers = [
    { title: 'Module', align: 'start', key: 'module', value: 'module.fqn', width: '15%' },
    { title: 'Class', align: 'start', key: 'class', width: '30%' },
    { title: 'Type', align: 'start', key: 'type', width: '30%' },
    { title: 'Methods', align: 'start', key: 'methods', width: '20%' },
  ]
</script>
