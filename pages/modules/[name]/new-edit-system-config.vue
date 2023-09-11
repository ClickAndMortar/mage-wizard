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
              :auto-select-first="false"
              @update:focused="(focused) => (sectionFocused = focused)"
            >
              <template #append-inner>
                <VIcon v-if="isNewSection">mdi-new-box</VIcon>
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
            <VCombobox
              v-model="config.group"
              v-model:search="groupSearch"
              :return-object="false"
              :items="groupItems"
              item-title="label"
              item-value="key"
              label="Group"
              variant="outlined"
              :hide-no-data="false"
              eager
              :auto-select-first="false"
              :disabled="!config.section"
              @update:focused="(focused) => (groupFocused = focused)"
            >
              <template #append-inner>
                <VIcon v-if="isNewGroup">mdi-new-box</VIcon>
              </template>
              <template #no-data>
                <VListItem>
                  <VListItemTitle>
                    No results matching "<strong>{{ groupSearch }}</strong
                    >". Press <kbd>enter</kbd> to create a new one
                  </VListItemTitle>
                </VListItem>
              </template>
            </VCombobox>
          </VCol>
          <VCol cols="4">
            <VTextField v-model="config.id" :rules="idRules" label="ID" variant="outlined" validate-on="lazy" />
          </VCol>
        </VRow>
        <VRow>
          <VCol cols="4">
            <VSelect v-model="config.type" :items="['text', 'textarea', 'select', 'multiselect', 'obscure']" label="Type" variant="outlined" />
          </VCol>
          <VCol cols="4">
            <VSelect v-model="config.scopes" :items="scopeItems" item-value="key" item-title="label" label="Scopes" variant="outlined" multiple chips />
          </VCol>
          <VCol cols="4">
            <VTextField v-model="config.comment" label="Comment" variant="outlined" hint="Displayed below config field" />
          </VCol>
          <VCol cols="4">
            <VCombobox
              v-model="config.sourceModel"
              v-model:search="sourceModelSearch"
              :items="sourceModelItems"
              label="Source model"
              variant="outlined"
              :hide-no-data="false"
              eager
              :auto-select-first="false"
              :disabled="!['select', 'multiselect'].includes(config.type)"
              :rules="sourceModelRules"
              clearable
            >
              <template #no-data>
                <VListItem>
                  <VListItemTitle>
                    No results matching "<strong>{{ sourceModelSearch }}</strong
                    >". Press <kbd>enter</kbd> to create a new one
                  </VListItemTitle>
                </VListItem>
              </template>
            </VCombobox>
          </VCol>
          <VCol cols="4">
            <VTextField v-model="config.backendModel" label="Backend model" variant="outlined" :rules="backendModelRules" clearable />
          </VCol>
          <VCol cols="4">
            <VTextField v-model="config.frontendModel" label="Frontend model" variant="outlined" :rules="frontendModelRules" clearable />
          </VCol>
        </VRow>
        <VRow>
          <VCol cols="4">
            <VSelect v-model="config.validators" :items="validatorItems" label="Validators" variant="outlined" multiple chips />
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
  import type { MageModule, MageSystemConfig, MageSystemConfigFieldNew, MageSystemConfigGroup, MageSystemConfigSection } from '~/lib/types'

  const route = useRoute()

  useHead({
    title: 'Create config',
  })

  const config: Ref<MageSystemConfigFieldNew> = ref({
    id: '',
    type: 'text',
    section: '',
    group: '',
    scopes: ['default'],
    comment: '',
    sourceModel: '',
    backendModel: '',
    frontendModel: '',
    validators: [],
  })

  const scopeItems = [
    { key: 'default', label: 'Default' },
    { key: 'websites', label: 'Websites' },
    { key: 'stores', label: 'Stores' },
  ]

  const sourceModelItems = [
    'Magento\\Config\\Model\\Config\\Source\\Yesno',
    'Magento\\Config\\Model\\Config\\Source\\Enabledisable',
    'Magento\\Config\\Model\\Config\\Source\\Locale',
    'Magento\\Config\\Model\\Config\\Source\\Locale\\Currency',
    'Magento\\Config\\Model\\Config\\Source\\Locale\\Country',
    'Magento\\Config\\Model\\Config\\Source\\Locale\\Weekdays',
    'Magento\\Config\\Model\\Config\\Source\\Locale\\Timezone',
    'Magento\\Directory\\Model\\Config\\Source\\WeightUnit',
  ]

  const validatorItems = [
    'required-entry',
    'validate-alphanumeric',
    'validate-digits',
    'validate-email',
    'validate-emails',
    'validate-no-empty',
    'validate-no-html-tags',
    'validate-number',
    'validate-phone',
    'validate-url',
    'validate-zero-or-greater',
  ]

  // TODO: add rule to check if value already exists
  const idRules = [
    (v: any) => !!v || 'ID is required',
    (v: any) => (v && /^[\d_a-z]+$/.test(v)) || 'ID can only contain lowercase letters, numbers and underscores',
  ]

  const isValidPhpClassName = (name: string) => {
    if (!name) {
      return true
    }

    return /^[A-Z\\][\w\\]+[\dA-Za-z]$/.test(name)
  }

  const sourceModelRules = [(v: any) => isValidPhpClassName(v) || 'Invalid PHP class name']
  const backendModelRules = [(v: any) => isValidPhpClassName(v) || 'Invalid PHP class name']
  const frontendModelRules = [(v: any) => isValidPhpClassName(v) || 'Invalid PHP class name']

  const form = ref<VForm>()
  const creatingConfig = ref(false)
  const sectionSearch = ref('')
  const groupSearch = ref('')
  const sourceModelSearch = ref('')
  const sectionFocused = ref(false)
  const groupFocused = ref(false)

  const { data: module } = await useFetch<MageModule>(`/api/modules/${route.params.name}`)
  const { data: moduleConfigs } = await useFetch<MageSystemConfig[]>(`/api/modules/system-config`)

  const sectionItems = computed(() => {
    if (!moduleConfigs.value) {
      return []
    }

    const sections: MageSystemConfigSection[] = moduleConfigs.value.flatMap((systemConfig: MageSystemConfig) => systemConfig.sections)
    return sortedUniqBy(
      sections
        .map((section: MageSystemConfigSection) => ({ key: section.id, label: section.label ? `${section.id} (${section.label})` : section.id }))
        .sort((a, b) => a.label.localeCompare(b.label)),
      (item) => item.key,
    )
  })

  const isNewSection = computed(() => {
    if (!config.value.section || sectionFocused.value) {
      return false
    }

    return !sectionItems.value.some((item) => item.key === config.value.section)
  })

  const groupItems = computed(() => {
    if (!moduleConfigs.value || !config.value.section) {
      return []
    }

    const groups: MageSystemConfigGroup[] = moduleConfigs.value
      .flatMap((systemConfig: MageSystemConfig) => {
        return systemConfig.sections.map((section: MageSystemConfigSection) => {
          if (section.id !== config.value.section) {
            return []
          }

          return section.groups
        })
      })
      .flat()
    return sortedUniqBy(
      groups
        .map((group: MageSystemConfigGroup) => ({ key: group.id, label: group.label ? `${group.id} (${group.label})` : group.id }))
        .sort((a, b) => a.label.localeCompare(b.label)),
      (item) => item.key,
    )
  })

  const isNewGroup = computed(() => {
    if (!config.value.group || groupFocused.value) {
      return false
    }

    return !groupItems.value.some((item) => item.key === config.value.group)
  })

  const onTypeChange = (type: any) => {
    if (type === 'obscure' && !config.value.backendModel) {
      config.value.backendModel = 'Magento\\Config\\Model\\Config\\Backend\\Encrypted'
    }
  }

  watch(() => config.value.type, onTypeChange)

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
