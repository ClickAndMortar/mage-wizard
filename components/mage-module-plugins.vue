<template>
  <VTable v-if="plugins?.length > 0" density="compact">
    <thead>
      <tr>
        <th class="text-left">Class</th>
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
          <VChip v-if="plugin.methods.length > 1" class="ml-2" size="x-small">+{{ plugin.methods.length - 1 }}</VChip>
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
