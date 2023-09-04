<template>
  <VForm @submit="createModule">
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
          <VCol cols="4">
            <VTextField v-model="module.namespace" :rules="[() => !!module.namespace || 'Namespace is required']" label="Namespace" variant="outlined" dense required autofocus />
          </VCol>
          <VCol cols="4">
            <VTextField v-model="module.name" :rules="[() => !!module.name || 'Name is required']" label="Name" variant="outlined" dense required />
          </VCol>
          <VCol cols="4">
            <VTextField v-model="module.version" :rules="[() => !!module.version || 'Version is required']" label="Version" variant="outlined" dense required />
          </VCol>
        </VRow>
        <VRow>
          <VCol> TODO: dependencies </VCol>
        </VRow>
      </VCardText>
    </VCard>
  </VForm>
</template>
<script setup lang="ts">
  useHead({
    title: 'Create module',
  })

  const module = ref({
    namespace: '',
    name: '',
    version: '',
  })

  const creatingModule = ref(false)

  const { data: modules } = await useFetch('/api/modules')

  const moduleExists = (namespace: string, name: string) => {
    return modules.value?.some((module: any) => module.namespace === namespace && module.name === name)
  }

  const createModule = (event: Event) => {
    event.preventDefault()

    if (moduleExists(module.value.namespace, module.value.name)) {
      useNotification().notify({
        message: 'Module already exists',
        type: 'error',
      })
      return
    }

    creatingModule.value = true

    fetch('/api/modules', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(module.value),
    })
      .then(() => {
        navigateTo(`/modules/${module.value.namespace}_${module.value.name}`)
      })
      .catch((error) => {
        alert(error)
      })
      .finally(() => {
        creatingModule.value = false
      })
  }
</script>
