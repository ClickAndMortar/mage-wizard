<template>
  <v-table v-if="plugins?.length > 0" density="compact">
    <thead>
    <tr>
      <th class="text-left">
        Class
      </th>
      <th class="text-left">
        Type
      </th>
      <th class="text-left">
        Methods
      </th>
    </tr>
    </thead>
    <tbody>
    <tr
        v-for="plugin in props.plugins"
        :key="plugin.name"
    >
      <td><code>{{ plugin.class }}</code></td>
      <td><code>{{ plugin.type }}</code></td>
      <td>
        <code v-if="plugin.methods.length > 0">{{ plugin.methods[0] }}</code>
        <v-chip class="ml-2" size="x-small" v-if="plugin.methods.length > 1">+{{ plugin.methods.length - 1 }}</v-chip>
      </td>
    </tr>
    </tbody>
  </v-table>
  <v-alert v-else density="compact" type="info">No plugins found</v-alert>
</template>
<script setup lang="ts">
import {MagePlugin} from '~/lib/types';

const props = defineProps({
  plugins: Array as PropType<MagePlugin[]>,
})
</script>
