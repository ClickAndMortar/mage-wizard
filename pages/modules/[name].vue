<template>
  <v-card elevation="3">
    <v-card-title>
      <v-icon>mdi-package-variant-closed</v-icon>
      Modules
      <v-icon>mdi-slash-forward</v-icon>
      {{ module }}
    </v-card-title>
    <v-card-text>
      Description
    </v-card-text>
  </v-card>
  <v-expansion-panels variant="accordion" class="mt-4">
    <v-expansion-panel>
      <v-expansion-panel-title>
        <strong>Plugins</strong>
        <v-chip size="small" class="ml-2">{{ plugins?.length || 0 }}</v-chip>
      </v-expansion-panel-title>
      <v-expansion-panel-text>plop</v-expansion-panel-text>
    </v-expansion-panel>
    <v-expansion-panel>
      <v-expansion-panel-title>
        <strong>Commands</strong>
        <v-chip size="small" class="ml-2">{{ commands?.length || 0 }}</v-chip>
      </v-expansion-panel-title>
      <v-expansion-panel-text>plop</v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script setup lang="ts">
const route = useRoute()
const module = route.params.name

useHead({
  title: String(module),
})

const {data: plugins} = useFetch('/api/plugins', {query: {module}})
const {data: commands} = useFetch('/api/commands', {query: {module}})
</script>
