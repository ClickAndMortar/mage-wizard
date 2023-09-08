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
              dense
              required
              autofocus
            />
          </VCol>
          <VCol cols="4">
            <VTextField
              v-model="command.description"
              :rules="[() => !!command.description || 'Description is required']"
              label="Description"
              variant="outlined"
              dense
              required
            />
          </VCol>
          <VCol cols="4">
            <VSelect v-model="command.injects" chips label="Injects" :items="injects" item-title="label" item-value="key" multiple variant="outlined" dense />
          </VCol>
        </VRow>
      </VCardText>
    </VCard>
  </VForm>
</template>
<script setup lang="ts">
  import { VForm } from 'vuetify/components'

  const route = useRoute()

  useHead({
    title: 'Create command',
  })

  const command = ref({
    name: '',
    description: '',
    injects: [],
    module: route.params.name,
  })

  const form = ref<VForm>()

  const injects = [
    { key: 'logger', label: 'LoggerInterface' },
    { key: 'scope_config', label: 'ScopeConfigInterface' },
  ]

  const nameRules = [
    (v: any) => !!v || 'Name is required',
    (v: any) => (v && /^[\d:-_a-z]+$/.test(v)) || 'Name can only contain lowercase letters, numbers, dashes, colons, and underscores',
  ]

  const creatingCommand = ref(false)

  const { data: module } = await useFetch(`/api/modules/${route.params.name}`)

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

    fetch(`/api/modules/${route.params.name}/command`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(command.value),
    })
      .then(() => {
        useNotification().notify({ message: 'Command successfully created', type: 'success' })
        // navigateTo(`/modules/${module?.value?.fqn}`)
      })
      .catch((error) => {
        alert(error)
      })
      .finally(() => {
        creatingCommand.value = false
      })
  }
</script>
