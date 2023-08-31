<template>
  <v-card elevation="3">
    <v-card-title>Modules</v-card-title>
  </v-card>
  <v-card class="mt-4" elevation="3">
    <v-card-text>
      <v-data-table
        density="compact"
        :headers="headers"
        :items="modules"
        v-model:items-per-page="itemsPerPage"
        :loading="pending"
      >
      </v-data-table>
    </v-card-text>
  </v-card>
</template>
<script setup lang="ts">
useHead({
  title: 'Modules',
})

const { data: modules, pending } = await useFetch('/api/modules')

const itemsPerPage = 50

const headers = [
  { title: 'Namespace', align: 'start', key: 'namespace' },
  { title: 'Name', align: 'start', key: 'name' },
  { title: 'Version', align: 'start', key: 'version' },
]
</script>
