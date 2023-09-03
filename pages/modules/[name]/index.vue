<template>
  <v-card elevation="3">
    <v-card-title>
      <v-icon>mdi-package-variant-closed</v-icon>
      <NuxtLink class="ml-1" :to="{ name: 'modules' }">Modules</NuxtLink>
      <v-icon>mdi-slash-forward</v-icon>
      {{ module }}
    </v-card-title>
    <v-card-text>
      Description
    </v-card-text>
  </v-card>
  <v-expansion-panels variant="accordion" class="mt-4">
    <v-expansion-panel :readonly="!plugins?.length">
      <v-expansion-panel-title>
        <v-row no-gutters>
          <v-col cols="4" class="d-flex justify-start align-center">
            <strong>Plugins</strong>
            <v-chip v-if="!pendingPlugins" size="small" class="ml-2">{{ plugins?.length || 0 }}</v-chip>
            <v-progress-circular v-if="pendingPlugins" size="24" color="grey" indeterminate class="ml-2"></v-progress-circular>
          </v-col>
          <v-col cols="8" class="d-flex justify-end">
            <v-btn color="primary" flat size="small" :to="{ name: 'modules-new' }" class="mr-4">
              <v-icon>mdi-plus</v-icon> Create
            </v-btn>
          </v-col>
        </v-row>
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <mage-module-plugins :plugins="plugins"/>
      </v-expansion-panel-text>
    </v-expansion-panel>
    <v-expansion-panel :readonly="!commands?.length">
      <v-expansion-panel-title>
        <v-row no-gutters>
          <v-col cols="4" class="d-flex justify-start align-center">
            <strong>Commands</strong>
            <v-chip v-if="!pendingCommands" size="small" class="ml-2">{{ commands?.length || 0 }}</v-chip>
            <v-progress-circular v-if="pendingCommands" size="24" color="grey" indeterminate class="ml-2"></v-progress-circular>
          </v-col>
          <v-col cols="8" class="d-flex justify-end">
            <v-btn color="primary" flat size="small" :to="{ name: 'modules-name-new-command', params: { name: module } }" class="mr-4">
              <v-icon>mdi-plus</v-icon> Create
            </v-btn>
          </v-col>
        </v-row>
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <mage-module-commands :commands="commands"/>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script setup lang="ts">
const route = useRoute()
const module = route.params.name

useHead({
  title: String(module),
})

const {data: plugins, pending: pendingPlugins} = useFetch('/api/plugins', {query: {module}})
const {data: commands, pending: pendingCommands} = useFetch('/api/commands', {query: {module}})
</script>
