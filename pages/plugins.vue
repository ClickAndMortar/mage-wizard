<template>
  <v-card elevation="3">
    <v-card-title><v-icon>mdi-power-plug-outline</v-icon> Plugins</v-card-title>
    <v-card-text>
      <v-data-table
        density="compact"
        :headers="headers"
        :items="plugins || []"
        v-model:items-per-page="itemsPerPage"
        :loading="pending"
      >
        <template v-slot:item.module="{ item }">
          <NuxtLink :to="{ name: 'modules-name', params: { name: item.columns.module } }"><code>{{ item.columns.module }}</code></NuxtLink>
        </template>
        <template v-slot:item.class="{ item }">
          <code>{{ item.columns.class }}</code>
        </template>
        <template v-slot:item.type="{ item }">
          <code>{{ item.columns.type }}</code>
        </template>
        <template v-slot:item.methods="{ item }">
          <code v-if="item.columns.methods.length > 0">{{ item.columns.methods[0] }}</code>
          <v-chip class="ml-2" size="x-small" v-if="item.columns.methods.length > 1">+{{ item.columns.methods.length - 1 }}</v-chip>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>
<script setup lang="ts">
useHead({
  title: 'Plugins',
})

const { data: plugins, pending } = useFetch('/api/plugins')

const itemsPerPage = 50
const sortBy = [{ key: 'namespace', order: 'asc' }, { key: 'name', order: 'asc' }]

const headers = [
  { title: 'Module', align: 'start', key: 'module', value: 'module.fqn', width: '15%' },
  { title: 'Class', align: 'start', key: 'class', width: '30%', },
  { title: 'Type', align: 'start', key: 'type', width: '30%' },
  { title: 'Methods', align: 'start', key: 'methods', width: '20%' },
]
</script>
