<template>
  <v-form @submit="createModule">
    <v-card elevation="3">
      <v-card-title>
        <v-row>
          <v-col cols="4">
            <v-icon>mdi-package-variant-closed</v-icon>
            Modules
            <v-icon>mdi-slash-forward</v-icon>
            Create
          </v-col>
          <v-col cols="8" class="text-right">
            <v-btn color="success" flat size="small" type="submit">Create module</v-btn>
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

const {data: modules, pending} = await useFetch('/api/modules')

const moduleExists = (namespace: string, name: string) => {
  return unref(modules)?.some((module: any) => module.namespace === namespace && module.name === name)
}

const createModule = async () => {
  if (moduleExists(unref(module).namespace, unref(module).name)) {
    return alert('Module already exists')
  }

  await fetch('/api/modules', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(unref(module)),
  })

  alert('module created');
}

</script>
