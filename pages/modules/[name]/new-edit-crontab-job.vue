<template>
  <VForm ref="form" @submit="saveJob">
    <VCard elevation="3">
      <VCardTitle>
        <VRow>
          <VCol cols="4">
            <VIcon>mdi-package-variant-closed</VIcon>
            <NuxtLink class="ml-1" :to="{ name: 'modules' }">Modules</NuxtLink>
            <VIcon>mdi-slash-forward</VIcon>
            <NuxtLink class="ml-1" :to="{ name: 'modules-name', params: { name: module?.fqn } }">{{ module?.fqn }}</NuxtLink>
            <VIcon>mdi-slash-forward</VIcon>
            {{ editing ? 'Edit' : 'Create' }} cron job
          </VCol>
          <VCol cols="8" class="text-right">
            <VBtn color="success" flat size="small" type="submit" :loading="savingJob">{{ editing ? 'Update' : 'Create' }} job</VBtn>
          </VCol>
        </VRow>
      </VCardTitle>
      <VCardText class="mt-4">
        <VRow>
          <VCol cols="4">
            <VTextField v-model="job.name" label="Name" variant="outlined" autofocus :rules="nameRules" :disabled="editing" />
          </VCol>
          <VCol cols="4">
            <VSelect v-model="job.group" label="Group" variant="outlined" :items="groupItems" />
          </VCol>
          <VCol cols="4">
            <VTextField v-model="job.schedule" label="Schedule" variant="outlined" :rules="scheduleRules" />
          </VCol>
        </VRow>
        <VRow>
          <VCol cols="4">
            <VTextField v-model="job.instance" label="Instance class" variant="outlined" :rules="instanceRules" />
          </VCol>
          <VCol cols="4">
            <VTextField v-model="job.method" label="Method" variant="outlined" :rules="methodRules" />
          </VCol>
          <VCol cols="4">
            <VTextField v-model="job.configPath" label="Config path" variant="outlined" />
          </VCol>
        </VRow>
      </VCardText>
    </VCard>
  </VForm>
</template>
<script setup lang="ts">
  import { VForm } from 'vuetify/components'
  import type { MageCronGroupXmlGroup, MageCrontabXmlJob } from '~/lib/types'
  import isValidPhpClassName from '~/lib/validator/php-class-name'

  const route = useRoute()

  const editing: boolean = !!route.query.name && route.query.name.length > 0

  useHead({
    title: `${editing ? 'Edit' : 'Create'} crontab job`,
  })

  const moduleName = String(route.params.name)

  const job = ref<MageCrontabXmlJob>({
    name: `${moduleName.toLowerCase()}_`,
    group: 'default',
    instance: '',
    method: 'execute',
    schedule: '*/5 * * * *',
    configPath: '',
  })

  if (editing) {
    const { data: jobData } = await useFetch<MageCrontabXmlJob>(`/api/modules/${moduleName}/crontab/job?name=${route.query.name}`)
    if (jobData.value) {
      job.value.name = jobData.value.name
      job.value.group = jobData.value.group
      job.value.instance = jobData.value.instance
      job.value.method = jobData.value.method
      job.value.schedule = jobData.value.schedule
      job.value.configPath = jobData.value.configPath
    }
  }

  const form = ref<VForm>()

  const nameRules = [
    (v: any) => !!v || 'Name is required',
    (v: any) => (v && /^[\d_a-z]+$/.test(v)) || 'Name can only contain lowercase letters, numbers, and underscores',
  ]

  const scheduleRules = [
    // (v: any) => !!v || 'Schedule is required',
    // (v: any) => isValidPhpClassName(v) || 'Invalid PHP class name', // TODO: check cron schedule format
  ]

  const instanceRules = [(v: any) => !!v || 'Instance class is required', (v: any) => isValidPhpClassName(v) || 'Invalid PHP class name']
  const methodRules = [(v: any) => !!v || 'Method is required']

  const savingJob = ref(false)

  const { data: module } = await useFetch(`/api/modules/${moduleName}`)

  const { data: groups } = useFetch<MageCronGroupXmlGroup[]>(`/api/crontab/group`)

  const groupItems = computed(() => {
    if (!groups.value) {
      return []
    }

    return groups.value.map((group) => group.id)
  })

  const saveJob = async (event: Event) => {
    event.preventDefault()
    if (!form.value) {
      return
    }

    const { valid } = await form.value?.validate()

    if (!valid) {
      return
    }

    savingJob.value = true

    fetch(`/api/modules/${moduleName}/crontab/job`, {
      method: editing ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(job.value),
    })
      .then(async () => {
        useNotification().notify({ message: `Crontab job successfully ${editing ? 'updated' : 'created'}`, type: 'success' })
        await navigateTo(`/modules/${moduleName}`)
      })
      .catch((error) => {
        useNotification().notify({ message: `Failed to ${editing ? 'update' : 'create'} crontab job: ${error}`, type: 'error' })
      })
      .finally(() => {
        savingJob.value = false
      })
  }
</script>
