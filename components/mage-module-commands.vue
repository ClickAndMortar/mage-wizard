<template>
  <VTable v-if="commands?.length > 0" density="compact">
    <thead>
      <tr>
        <th class="text-left w-40">Command</th>
        <th class="text-left w-60">Class</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(command, kC) in props.commands" :key="`command-${kC}`">
        <td>
          <code>{{ command.name }}</code>
        </td>
        <td>
          <code>{{ command.class }}</code>
        </td>
      </tr>
    </tbody>
  </VTable>
  <VAlert v-else density="compact" type="info">No commands found</VAlert>
</template>
<script setup lang="ts">
  import type { MageCommand } from '~/lib/types'

  const props = defineProps({
    commands: {
      type: Array as PropType<MageCommand[]>,
      required: true,
      default: () => [],
    },
  })
</script>
