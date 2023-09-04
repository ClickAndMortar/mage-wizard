<template>
  <VCard elevation="3">
    <VCardTitle>
      <VRow>
        <VCol cols="4"> <VIcon>mdi-package-variant-closed</VIcon> Modules </VCol>
        <VCol cols="8" class="text-right">
          <VBtn color="primary" flat size="small" :to="{ name: 'modules-new' }">New module</VBtn>
        </VCol>
      </VRow>
    </VCardTitle>
    <VCardText>
      <VDataTable v-model:items-per-page="itemsPerPage" v-model:sort-by="sortBy" density="compact" :headers="headers" :items="modules" :loading="pending">
        <template #item.namespace="{ item }">
          <code>{{ item.columns.namespace }}</code>
        </template>
        <template #item.name="{ item }">
          <code>{{ item.columns.name }}</code>
        </template>
        <template #item.version="{ item }">
          <code v-if="item.columns.version">{{ item.columns.version }}</code>
        </template>
        <template #item.enabled="{ item }">
          <VIcon v-if="item.columns.enabled">mdi-check</VIcon>
        </template>
        <template #item.actions="{ item }">
          <VBtn icon size="x-small" flat :to="{ name: 'modules-name', params: { name: item.raw.fqn } }"><VIcon size="medium">mdi-eye-outline</VIcon></VBtn>
        </template>
      </VDataTable>
    </VCardText>
  </VCard>
</template>
<script setup lang="ts">
  useHead({
    title: 'Modules',
  })

  const { data: modules, pending } = await useFetch('/api/modules')

  const itemsPerPage = 50
  const sortBy = [
    { key: 'namespace', order: 'asc' },
    { key: 'name', order: 'asc' },
  ]

  const headers = [
    { title: 'Namespace', align: 'start', key: 'namespace', width: '20%' },
    { title: 'Name', align: 'start', key: 'name', width: '40%' },
    { title: 'Version', align: 'start', key: 'version', width: '10%' },
    { title: 'Enabled', align: 'start', key: 'enabled', width: '10%' },
    { title: 'Actions', align: 'start', key: 'actions', width: '10%' },
  ]
</script>
