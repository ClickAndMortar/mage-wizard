<template>
  <VForm ref="form" @submit="createConfig">
    <VCard elevation="3">
      <VCardTitle>
        <VRow>
          <VCol cols="4">
            <VIcon>mdi-package-variant-closed</VIcon>
            <NuxtLink class="ml-1" :to="{ name: 'modules' }">Modules</NuxtLink>
            <VIcon>mdi-slash-forward</VIcon>
            <NuxtLink class="ml-1" :to="{ name: 'modules-name', params: { name: module?.fqn } }">{{ module?.fqn }}</NuxtLink>
            <VIcon>mdi-slash-forward</VIcon>
            Create config
          </VCol>
          <VCol cols="8" class="text-right">
            <VBtn color="success" flat size="small" type="submit" :loading="creatingConfig">Create config</VBtn>
          </VCol>
        </VRow>
      </VCardTitle>
      <VCardText class="mt-4">
        <VRow>
          <VCol cols="4">
            <VCombobox
              v-model="config.section"
              v-model:search="sectionSearch"
              :return-object="false"
              :items="sectionItems"
              item-title="label"
              item-value="key"
              label="Section"
              variant="outlined"
              :hide-no-data="false"
              eager
            >
              <template #append-inner>
                <!-- TODO: only display if new value -->
                <VIcon>mdi-new-box</VIcon>
              </template>
              <template #no-data>
                <VListItem>
                  <VListItemTitle>
                    No results matching "<strong>{{ sectionSearch }}</strong
                    >". Press <kbd>enter</kbd> to create a new one
                  </VListItemTitle>
                </VListItem>
              </template>
            </VCombobox>
          </VCol>
          <VCol cols="4">
            <VTextField v-model="config.description" :rules="[() => !!config.description || 'Description is required']" label="Description" variant="outlined" dense required />
          </VCol>
          <VCol cols="4">
            <VSelect v-model="config.injects" chips label="Injects" :items="injects" item-title="label" item-value="key" multiple variant="outlined" dense />
          </VCol>
        </VRow>
      </VCardText>
    </VCard>
  </VForm>
</template>
<script setup lang="ts">
  import { VForm } from 'vuetify/components'
  // eslint-disable-next-line import/named
  import { sortedUniqBy } from 'lodash'
  import type { MageModule, MageSystemConfig, MageSystemConfigFieldNew, MageSystemConfigSection } from '~/lib/types'

  const route = useRoute()

  useHead({
    title: 'Create config',
  })

  const config: Ref<MageSystemConfigFieldNew> = ref({
    id: '',
    type: 'text',
    section: '',
    group: '',
  })

  const sectionSearch = ref('')

  const form = ref<VForm>()

  const injects = [
    { key: 'logger', label: 'LoggerInterface' },
    { key: 'scope_config', label: 'ScopeConfigInterface' },
  ]

  const nameRules = [(v: any) => !!v || 'Name is required', (v: any) => (v && /^[\d:-_a-z]+$/.test(v)) || 'Name can only contain lowercase letters, numbers, dashes, colons, and underscores']

  const creatingConfig = ref(false)

  const { data: module } = await useFetch<MageModule>(`/api/modules/${route.params.name}`)
  const { data: moduleConfigs } = await useFetch<MageSystemConfig[]>(`/api/modules/system-config`)

  const sectionItems = computed(() => {
    if (!moduleConfigs.value) {
      return []
    }

    const sections: MageSystemConfigSection[] = moduleConfigs.value.flatMap((config: MageSystemConfig) => config.sections)
    return sortedUniqBy(
      sections.map((section: MageSystemConfigSection) => ({ key: section.id, label: section.label ? `${section.id} (${section.label})` : section.id })).sort((a, b) => a.label.localeCompare(b.label)),
      (item) => item.key,
    )
  })

  const createConfig = async (event: Event) => {
    event.preventDefault()
    if (!form.value) {
      return
    }

    const { valid } = await form.value?.validate()

    if (!valid) {
      return
    }

    creatingConfig.value = true

    fetch(`/api/modules/${route.params.name}/config`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(config.value),
    })
      .then(() => {
        useNotification().notify({ message: 'Config successfully created', type: 'success' })
        // navigateTo(`/modules/${module?.value?.fqn}`)
      })
      .catch((error) => {
        alert(error)
      })
      .finally(() => {
        creatingConfig.value = false
      })
  }
</script>
