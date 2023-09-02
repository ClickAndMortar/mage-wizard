<template>
  <v-card elevation="3">
    <v-card-title>
      <v-row>
        <v-col cols="4">
          <v-icon>mdi-package-variant-closed</v-icon> Modules
        </v-col>
        <v-col cols="8" class="text-right">
          <v-btn color="primary" flat size="small" :to="{ name: 'modules-new' }">New module</v-btn>
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text>
      <v-data-table
        density="compact"
        :headers="headers"
        :items="modules"
        v-model:items-per-page="itemsPerPage"
        :loading="pending"
        v-model:sort-by="sortBy"
      >
        <template v-slot:item.namespace="{ item }">
          <code>{{ item.columns.namespace }}</code>
        </template>
        <template v-slot:item.name="{ item }">
          <code>{{ item.columns.name }}</code>
        </template>
        <template v-slot:item.version="{ item }">
          <code v-if="item.columns.version">{{ item.columns.version }}</code>
        </template>
        <template v-slot:item.enabled="{ item }">
          <v-icon v-if="item.columns.enabled">mdi-check</v-icon>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-btn icon size="x-small" flat :to="{ name: 'modules-name', params: { name: item.raw.fqn } }"><v-icon size="medium">mdi-eye-outline</v-icon></v-btn>
        </template>
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
const sortBy = [{ key: 'namespace', order: 'asc' }, { key: 'name', order: 'asc' }]

const headers = [
  { title: 'Namespace', align: 'start', key: 'namespace', width: '20%' },
  { title: 'Name', align: 'start', key: 'name', width: '40%', },
  { title: 'Version', align: 'start', key: 'version', width: '10%' },
  { title: 'Enabled', align: 'start', key: 'enabled', width: '10%' },
  { title: 'Actions', align: 'start', key: 'actions', width: '10%' },
]
</script>
