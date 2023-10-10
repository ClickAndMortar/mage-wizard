<template>
  <VForm ref="form" @submit="createCommand">
    <VCard elevation="3">
      <VCardTitle>
        <VRow>
          <VCol cols="4">
            <VIcon>mdi-package-variant-closed</VIcon>
            <NuxtLink class="ml-1" :to="{ name: 'modules' }">Modules</NuxtLink>
            <VIcon>mdi-slash-forward</VIcon>
            <NuxtLink class="ml-1" :to="{ name: 'modules-name', params: { name: module?.fqn } }">{{ module?.fqn }}</NuxtLink>
            <VIcon>mdi-slash-forward</VIcon>
            Create command
          </VCol>
          <VCol cols="8" class="text-right">
            <VBtn color="success" flat size="small" type="submit" :loading="creatingCommand">Create command</VBtn>
          </VCol>
        </VRow>
      </VCardTitle>
      <VCardText class="mt-4">
        <VRow>
          <VCol cols="4">
            <VTextField
              v-model="command.name"
              :rules="nameRules"
              label="Name"
              variant="outlined"
              hint="Example: mage-wizard:hello-world"
              persistent-hint
              autofocus
            />
          </VCol>
          <VCol cols="4">
            <VTextField
              v-model="command.description"
              :rules="[() => !!command.description || 'Description is required']"
              label="Description"
              variant="outlined"
            />
          </VCol>
          <VCol cols="4">
            <VSelect v-model="command.injects" chips label="Injects" :items="injects" item-title="label" item-value="key" multiple variant="outlined" />
          </VCol>
        </VRow>
      </VCardText>
    </VCard>
  </VForm>
</template>
<script setup lang="ts">
  import { VForm } from 'vuetify/components'
  import type { MageModule } from '~/lib/types'

  const route = useRoute()

  useHead({
    title: 'Create command',
  })

  const moduleName = String(route.params.name)

  // Convert moduleName from PascalCase to snake-case
  const commandNamePrefix = moduleName
    .replaceAll('_', ':')
    .replaceAll(/([A-Z])/g, (match) => `-${match.toLowerCase()}`)
    .replace(/^-/, '')
    .replace(':-', ':')

  const command = ref({
    name: `${commandNamePrefix}:`,
    description: '',
    injects: [],
    module: moduleName,
  })

  const form = ref<VForm>()

  const injects = [
    { key: 'logger', label: 'LoggerInterface' },
    { key: 'scope_config', label: 'ScopeConfigInterface' },
  ]

  const nameRules = [
    (v: any) => !!v || 'Name is required',
    (v: any) => (v && /^[\d:_a-z-]+$/.test(v)) || 'Name can only contain lowercase letters, numbers, dashes, colons, and underscores',
  ]

  const creatingCommand = ref(false)

  const { data: module } = await useFetch<MageModule>(`/api/modules/${moduleName}`)

  const createCommand = async (event: Event) => {
    event.preventDefault()
    if (!form.value) {
      return
    }

    const { valid } = await form.value?.validate()

    if (!valid) {
      return
    }

    creatingCommand.value = true

    fetch(`/api/modules/${moduleName}/command`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(command.value),
    })
      .then(async () => {
        useNotification().notify({ message: 'Command successfully created', type: 'success' })
        await navigateTo(`/modules/${moduleName}`)
      })
      .catch((error) => {
        useNotification().notify({ message: `Failed to create command: ${error}`, type: 'error' })
      })
      .finally(() => {
        creatingCommand.value = false
      })
  }
</script>
