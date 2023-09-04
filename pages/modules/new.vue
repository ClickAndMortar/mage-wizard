<template>
  <v-form @submit="createModule">
    <v-card elevation="3">
      <v-card-title>
        <v-row>
          <v-col cols="4">
            <v-icon>mdi-package-variant-closed</v-icon>
            <NuxtLink class="ml-1" :to="{ name: 'modules' }">Modules</NuxtLink>
            <v-icon>mdi-slash-forward</v-icon>
            Create
          </v-col>
          <v-col cols="8" class="text-right">
            <v-btn color="success" flat size="small" type="submit" :loading="creatingModule">Create module</v-btn>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text class="mt-4">
        <v-row>
          <v-col cols="4">
            <v-text-field
              v-model="module.namespace"
              :rules="[() => !!module.namespace || 'Namespace is required']"
              label="Namespace"
              variant="outlined"
              dense
              required
              autofocus
            />
          </v-col>
          <v-col cols="4">
            <v-text-field
              v-model="module.name"
              :rules="[() => !!module.name || 'Name is required']"
              label="Name"
              variant="outlined"
              dense
              required
            />
          </v-col>
          <v-col cols="4">
            <v-text-field
              v-model="module.version"
              :rules="[() => !!module.version || 'Version is required']"
              label="Version"
              variant="outlined"
              dense
              required
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            TODO: dependencies
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-form>
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

const {data: modules, pending} = await useFetch('/api/modules')

const moduleExists = (namespace: string, name: string) => {
  return unref(modules)?.some((module: any) => module.namespace === namespace && module.name === name)
}

const createModule = (e: Event) => {
  e.preventDefault();

  if (moduleExists(unref(module).namespace, unref(module).name)) {
    return alert('Module already exists')
  }

  creatingModule.value = true

  fetch('/api/modules', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(unref(module)),
  }).then(() => {
    navigateTo(`/modules/${unref(module).namespace}_${unref(module).name}`)
  }).catch((err) => {
    alert(err)
  }).finally(() => {
    creatingModule.value = false
  })
}

</script>
