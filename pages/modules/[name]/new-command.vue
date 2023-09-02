<template>
  <v-form ref="form" @submit="createCommand">
    <v-card elevation="3">
      <v-card-title>
        <v-row>
          <v-col cols="4">
            <v-icon>mdi-package-variant-closed</v-icon>
            <NuxtLink class="ml-1" :to="{ name: 'modules' }">Modules</NuxtLink>
            <v-icon>mdi-slash-forward</v-icon>
            {{ module?.fqn }}
            <v-icon>mdi-slash-forward</v-icon>
            Create command
          </v-col>
          <v-col cols="8" class="text-right">
            <v-btn color="success" flat size="small" type="submit" :loading="creatingCommand">Create command</v-btn>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text class="mt-4">
        <v-row>
          <v-col cols="4">
            <v-text-field
              v-model="command.name"
              :rules="[() => !!command.name || 'Name is required']"
              label="Name"
              variant="outlined"
              hint="Example: mage-wizard:hello-world"
              persistent-hint
              dense
              required
            />
          </v-col>
          <v-col cols="4">
            <v-text-field
              v-model="command.description"
              :rules="[() => !!command.description || 'Description is required']"
              label="Description"
              variant="outlined"
              dense
              required
            />
          </v-col>
          <v-col cols="4">
            <v-select
              v-model="command.injects"
              chips
              label="Injects"
              :items="injects"
              item-title="label"
              item-value="key"
              multiple
              variant="outlined"
              dense
            ></v-select>
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
import {VForm} from 'vuetify/components';

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

const creatingCommand = ref(false)

const {data: module, pending} = await useFetch(`/api/modules/${route.params.name}`)

const createCommand = async (e: Event) => {
  e.preventDefault();
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
  }).then(() => {
    // navigateTo(`/modules/${unref(module).namespace}_${unref(module).name}`)
  }).catch((err) => {
    alert(err)
  }).finally(() => {
    creatingCommand.value = false
  })
}

</script>
