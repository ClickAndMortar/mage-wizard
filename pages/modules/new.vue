<template>
  <VForm ref="form" @submit="createModule">
    <VCard elevation="3">
      <VCardTitle>
        <VRow>
          <VCol cols="4">
            <VIcon>mdi-package-variant-closed</VIcon>
            <NuxtLink class="ml-1" :to="{ name: 'modules' }">Modules</NuxtLink>
            <VIcon>mdi-slash-forward</VIcon>
            Create
          </VCol>
          <VCol cols="8" class="text-right">
            <VBtn color="success" flat size="small" type="submit" :loading="creatingModule">Create module</VBtn>
          </VCol>
        </VRow>
      </VCardTitle>
      <VCardText class="mt-4">
        <VRow>
          <VCol cols="3">
            <VTextField
              v-model="module.namespace"
              :rules="[() => !!module.namespace || 'Namespace is required']"
              label="Namespace"
              variant="outlined"
              autofocus
            />
          </VCol>
          <VCol cols="3">
            <VTextField v-model="module.name" :rules="[() => !!module.name || 'Name is required']" label="Name" variant="outlined" />
          </VCol>
          <VCol cols="3">
            <VTextField v-model="module.version" :rules="[() => !!module.version || 'Version is required']" label="Version" variant="outlined" />
          </VCol>
          <VCol cols="3">
            <VAutocomplete v-model="module.dependencies" label="Dependencies" chips multiple :items="moduleItems" variant="outlined" />
          </VCol>
        </VRow>
      </VCardText>
    </VCard>
  </VForm>
</template>
<script setup lang="ts">
  import { VForm } from 'vuetify/components'
  import type { MageModule, MageNewModule } from '~/lib/types'

  useHead({
    title: 'Create module',
  })

  const module = ref<MageNewModule>({
    namespace: '',
    name: '',
    version: '1.0.0',
    dependencies: [],
  })

  const form = ref<VForm>()

  const creatingModule = ref(false)

  const { data: modules } = await useFetch('/api/modules')

  const moduleExists = (namespace: string, name: string) => {
    return modules.value?.some((module: any) => module.namespace === namespace && module.name === name)
  }

  const moduleItems = computed(() => {
    return modules.value?.map((module: MageModule) => module.fqn)
  })

  const createModule = async (event: Event) => {
    event.preventDefault()
    if (!form.value) {
      return
    }

    const { valid } = await form.value?.validate()

    if (!valid) {
      return
    }

    if (moduleExists(module.value.namespace, module.value.name)) {
      useNotification().notify({
        message: 'Module already exists',
        type: 'error',
      })
      return
    }

    creatingModule.value = true

    try {
      await fetch('/api/modules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(module.value),
      })

      useNotification().notify({
        message: 'Module successfully created',
        type: 'success',
      })

      await navigateTo(`/modules/${module.value.namespace}_${module.value.name}`)
    } catch (error) {
      useNotification().notify({
        message: `Failed to create module: ${error}`,
        type: 'error',
      })
    } finally {
      creatingModule.value = false
    }
  }
</script>
