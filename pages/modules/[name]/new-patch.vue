<template>
  <VForm ref="form" @submit="createPatch">
    <VCard elevation="3">
      <VCardTitle>
        <VRow>
          <VCol cols="4">
            <VIcon>mdi-package-variant-closed</VIcon>
            <NuxtLink class="ml-1" :to="{ name: 'modules' }">Modules</NuxtLink>
            <VIcon>mdi-slash-forward</VIcon>
            <NuxtLink class="ml-1" :to="{ name: 'modules-name', params: { name: module?.fqn } }">{{ module?.fqn }}</NuxtLink>
            <VIcon>mdi-slash-forward</VIcon>
            Create patch
          </VCol>
          <VCol cols="8" class="text-right">
            <VBtn color="success" flat size="small" type="submit" :loading="creatingPatch">Create patch</VBtn>
          </VCol>
        </VRow>
      </VCardTitle>
      <VCardText class="mt-4">
        <VRow>
          <VCol cols="6">
            <VTextField
              v-model="patch.name"
              :rules="nameRules"
              label="Name"
              variant="outlined"
              hint="Example: UpdateStoreConfig (Patch suffix will be added automatically)"
              persistent-hint
              autofocus
            />
          </VCol>
          <VCol cols="6">
            <VSelect v-model="patch.type" label="Type" :items="types" item-title="label" item-value="key" variant="outlined" />
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
    title: 'Create patch',
  })

  const moduleName = String(route.params.name)

  const patch = ref({
    name: '',
    type: 'data',
  })

  const form = ref<VForm>()

  const types = [
    { key: 'data', label: 'Data' },
    { key: 'schema', label: 'Schema' },
  ]

  const nameRules = [
    (v: any) => !!v || 'Name is required',
    (v: any) => (v && /^[A-Z][A-Za-z]+$/.test(v)) || 'Name must start with an uppercase letter and can only contain letters',
  ]

  const creatingPatch = ref(false)

  const { data: module } = await useFetch<MageModule>(`/api/modules/${moduleName}`)

  const createPatch = async (event: Event) => {
    event.preventDefault()
    if (!form.value) {
      return
    }

    const { valid } = await form.value?.validate()

    if (!valid) {
      return
    }

    creatingPatch.value = true

    fetch(`/api/modules/${moduleName}/patch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(patch.value),
    })
      .then(async () => {
        useNotification().notify({ message: 'Patch successfully created', type: 'success' })
        await navigateTo(`/modules/${moduleName}`)
      })
      .catch((error) => {
        useNotification().notify({ message: `Failed to create patch: ${error}`, type: 'error' })
      })
      .finally(() => {
        creatingPatch.value = false
      })
  }
</script>
