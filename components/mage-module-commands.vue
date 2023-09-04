<template>
  <v-table v-if="commands?.length > 0" density="compact">
    <thead>
    <tr>
      <th class="text-left w-40">
        Command
      </th>
      <th class="text-left w-60">
        Class
      </th>
    </tr>
    </thead>
    <tbody>
    <tr
        v-for="(command, kC) in props.commands"
        :key="`command-${kC}`"
    >
      <td><code>{{ command.name }}</code></td>
      <td><code>{{ command.class }}</code></td>
    </tr>
    </tbody>
  </v-table>
  <v-alert v-else density="compact" type="info">No commands found</v-alert>
</template>
<script setup lang="ts">
import {MageCommand} from '~/lib/types';

const props = defineProps({
  commands: Array as PropType<MageCommand[]>,
})
</script>
