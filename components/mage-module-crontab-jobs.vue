<template>
  <VTable v-if="jobs?.length > 0" density="compact">
    <thead>
      <tr>
        <th class="text-left w-20">Name</th>
        <th class="text-left w-10">Group</th>
        <th class="text-left w-40">Instance</th>
        <th class="text-left w-10">Method</th>
        <th class="text-left w-10">Schedule</th>
        <th class="text-left w-10">Schedule</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(job, kC) in props.jobs" :key="`job-${kC}`">
        <td>
          <code>{{ job.name }}</code>
        </td>
        <td>
          <code>{{ job.group }}</code>
        </td>
        <td>
          <code>{{ job.instance }}</code>
        </td>
        <td>
          <code>{{ job.method }}</code>
        </td>
        <td>
          <code>{{ job.schedule }}</code>
        </td>
        <td>
          <VBtn
            icon
            size="x-small"
            flat
            :to="{ name: 'modules-name-new-edit-crontab-job', params: { name: module.fqn }, query: { name: job.name } }"
            :disabled="module.vendor || module.core"
          >
            <VIcon size="small">mdi-pencil</VIcon>
          </VBtn>
        </td>
      </tr>
    </tbody>
  </VTable>
  <VAlert v-else density="compact" type="info">No cron job found</VAlert>
</template>
<script setup lang="ts">
  import type { MageCrontabXmlJob, MageModule } from '~/lib/types'

  const props = defineProps({
    jobs: {
      type: Array as PropType<MageCrontabXmlJob[]>,
      required: true,
      default: () => [],
    },
    module: {
      type: Object as PropType<MageModule>,
      required: true,
    },
  })
</script>
