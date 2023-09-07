<template>
  <VTable v-if="plugins?.length > 0" density="compact">
    <thead>
      <tr>
        <th class="text-left">Affected class</th>
        <th class="text-left">Type</th>
        <th class="text-left">Methods</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="plugin in plugins" :key="plugin.name">
        <td>
          <code>{{ plugin.class }}</code>
        </td>
        <td>
          <code>{{ plugin.type }}</code>
        </td>
        <td>
          <code v-if="plugin.methods.length > 0">{{ plugin.methods[0] }}</code>
          <VTooltip v-if="plugin.methods.length > 1" location="top">
            <template #activator="{ props }">
              <VChip class="ml-2" size="x-small" v-bind="props">+{{ plugin.methods.length - 1 }}</VChip>
            </template>
            <div v-for="method in plugin.methods.slice(1)" :key="method">
              <code>{{ method }}</code>
            </div>
          </VTooltip>
        </td>
      </tr>
    </tbody>
  </VTable>
  <VAlert v-else density="compact" type="info">No plugins found</VAlert>
</template>
<script setup lang="ts">
  import type { MagePlugin } from '~/lib/types'

  defineProps({
    plugins: {
      type: Array as PropType<MagePlugin[]>,
      required: true,
      default: () => [],
    },
  })
</script>
