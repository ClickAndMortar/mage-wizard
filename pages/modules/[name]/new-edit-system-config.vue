<template>
  <VForm ref="form" @submit="saveConfig">
    <VCard elevation="3">
      <VCardTitle>
        <VRow>
          <VCol cols="4">
            <VIcon>mdi-package-variant-closed</VIcon>
            <NuxtLink class="ml-1" :to="{ name: 'modules' }">Modules</NuxtLink>
            <VIcon>mdi-slash-forward</VIcon>
            <NuxtLink class="ml-1" :to="{ name: 'modules-name', params: { name: module?.fqn } }">{{ module?.fqn }}</NuxtLink>
            <VIcon>mdi-slash-forward</VIcon>
            {{ editing ? 'Edit' : 'Create' }} config
          </VCol>
          <VCol cols="8" class="text-right">
            <VBtn color="success" flat size="small" type="submit" :loading="savingConfig">{{ editing ? 'Update' : 'Create' }} config</VBtn>
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
              :rules="sectionRules"
              :disabled="editing"
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
              :disabled="!config.section || editing"
              :rules="groupRules"
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
            <VTextField v-model="config.id" :rules="idRules" :disabled="editing" label="ID" variant="outlined" validate-on="lazy" />
          </VCol>
        </VRow>
        <VRow>
          <VCol cols="4">
            <VSelect v-model="config.type" :items="['text', 'textarea', 'select', 'multiselect', 'obscure', 'label']" label="Type" variant="outlined" />
          </VCol>
          <VCol cols="4">
            <VSelect v-model="config.scopes" :items="scopeItems" item-value="key" item-title="label" label="Scopes" variant="outlined" multiple chips />
          </VCol>
          <VCol cols="4">
            <VTextField v-model="config.label" label="Label" variant="outlined" />
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
            <VTextField v-model="config.frontendClass" label="Frontend class" variant="outlined" />
          </VCol>
          <VCol cols="4">
            <VSelect v-model="config.validators" :items="validatorItems" label="Validators" variant="outlined" multiple chips />
          </VCol>
          <VCol cols="4">
            <VTextField v-model="config.comment" label="Comment" variant="outlined" hint="Displayed below config field" />
          </VCol>
        </VRow>
        <VRow>
          <VCol cols="4">
            <!-- TODO: should be a combobox -->
            <VTextField v-model="config.resource" label="ACL Resource" variant="outlined" />
          </VCol>
          <VCol cols="4">
            <VTextField v-model="config.sortOrder" type="number" label="Sort order" variant="outlined" />
          </VCol>
          <VCol cols="4">
            <VTextField v-model="config.default" label="Default value" variant="outlined" hint="Stored in etc/config.xml" />
          </VCol>
        </VRow>
        <VRow>
          <VCol cols="4">
            <VTextField v-model="config.translate" label="Translate" variant="outlined" />
          </VCol>
        </VRow>
      </VCardText>
    </VCard>
    <VRow>
      <VCol cols="6">
        <VCard v-if="isNewSection" class="mt-4" elevation="3">
          <VCardTitle>New section</VCardTitle>
          <VCardText class="mt-2">
            <VTextField v-model="config.section" readonly label="ID" variant="outlined" />
            <VTextField v-model="section.label" label="Label" variant="outlined" />
            <VTextField v-model="section.tab" label="Tab" variant="outlined" />
            <VTextField v-model.number="section.sortOrder" type="number" label="Sort order" variant="outlined" />
            <VSelect v-model="section.scopes" :items="scopeItems" item-value="key" item-title="label" label="Scopes" variant="outlined" multiple chips />
            <VTextField v-model="section.resource" label="ACL Resource" variant="outlined" />
          </VCardText>
        </VCard>
      </VCol>
      <VCol cols="6">
        <VCard v-if="isNewGroup" class="mt-4" elevation="3">
          <VCardTitle>New group</VCardTitle>
          <VCardText class="mt-2">
            <VTextField v-model="config.group" readonly label="ID" variant="outlined" />
            <VTextField v-model="group.label" label="Label" variant="outlined" />
            <VTextField v-model.number="group.sortOrder" type="number" label="Sort order" variant="outlined" />
            <VSelect v-model="group.scopes" :items="scopeItems" item-value="key" item-title="label" label="Scopes" variant="outlined" multiple chips />
            <VTextField v-model="group.resource" label="ACL Resource" variant="outlined" />
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </VForm>
</template>
<script setup lang="ts">
  import { VForm } from 'vuetify/components'
  // eslint-disable-next-line import/named
  import { sortedUniqBy } from 'lodash'
  import type { Ref } from 'vue'
  import type {
    MageModule,
    MageSystemConfig,
    MageNewSystemConfigField,
    MageSystemConfigGroup,
    MageSystemConfigSection,
    MageSystemConfigField,
    MageNewSystemConfigSection,
    MageNewSystemConfigGroup,
  } from '~/lib/types'
  import isValidPhpClassName from '~/lib/validator/php-class-name'

  const route = useRoute()

  const editing: boolean = !!route.query.path && route.query.path.length > 0

  useHead({
    title: `${editing ? 'Edit' : 'Create'} config`,
  })

  const configObject: MageNewSystemConfigField = {
    id: '',
    type: 'text',
    section: '',
    group: '',
    scopes: ['default'],
    label: '',
    comment: '',
    sourceModel: '',
    backendModel: '',
    frontendModel: '',
    frontendClass: '',
    sortOrder: 0,
    resource: '',
    validators: [],
    default: '',
    translate: 'label',
    module: String(route.params.name),
  }

  const config: Ref<MageNewSystemConfigField> = ref(Object.assign({}, configObject))

  const section = ref<MageNewSystemConfigSection>({
    id: '',
    label: '',
    tab: '',
    sortOrder: 0,
    scopes: ['default'],
    resource: '',
  })

  const group = ref<MageNewSystemConfigGroup>({
    id: '',
    section: '',
    label: '',
    sortOrder: 0,
    scopes: ['default'],
    resource: '',
  })

  const scopeItems = [
    { key: 'default', label: 'Default' },
    { key: 'website', label: 'Website' },
    { key: 'store', label: 'Store' },
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
  const sectionRules = [(v: any) => !!v || 'Section is required']
  const groupRules = [(v: any) => !!v || 'Group is required']
  const sourceModelRules = [(v: any) => isValidPhpClassName(v) || 'Invalid PHP class name']
  const backendModelRules = [(v: any) => isValidPhpClassName(v) || 'Invalid PHP class name']
  const frontendModelRules = [(v: any) => isValidPhpClassName(v) || 'Invalid PHP class name']

  const form = ref<VForm>()
  const savingConfig = ref(false)
  const sectionSearch = ref('')
  const groupSearch = ref('')
  const sourceModelSearch = ref('')
  const sectionFocused = ref(false)
  const groupFocused = ref(false)

  const { data: module } = await useFetch<MageModule>(`/api/modules/${route.params.name}`)
  const { data: moduleConfigs } = await useFetch<MageSystemConfig[]>(`/api/modules/system-config`)

  if (editing) {
    const { data: configField } = await useFetch<MageSystemConfigField>(`/api/modules/${route.params.name}/config/field?path=${route.query.path}`)
    if (configField.value) {
      const [sectionId, groupId, fieldId] = configField.value.path.split('/')
      config.value.section = sectionId
      config.value.group = groupId
      config.value.id = fieldId
      config.value.type = configField.value.type
      config.value.label = configField.value.label
      config.value.comment = configField.value.comment
      config.value.sourceModel = configField.value.sourceModel
      config.value.backendModel = configField.value.backendModel
      config.value.frontendModel = configField.value.frontendModel
      config.value.frontendClass = configField.value.frontendClass
      config.value.validators = configField.value.validate?.split(' ') || []
      config.value.default = configField.value.default
      config.value.sortOrder = configField.value.sortOrder || 0
      config.value.resource = configField.value.resource
      config.value.translate = configField.value.translate
      config.value.scopes = []
      if (configField.value.showInDefault) {
        config.value.scopes.push('default')
      }
      if (configField.value.showInWebsite) {
        config.value.scopes.push('website')
      }
      if (configField.value.showInStore) {
        config.value.scopes.push('store')
      }
    }
  }

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

  const saveConfig = async (event: Event) => {
    event.preventDefault()
    if (!form.value) {
      return
    }

    const { valid } = await form.value?.validate()

    if (!valid) {
      return
    }

    if (isNewSection) {
      section.value.id = config.value.section
    }

    if (isNewGroup) {
      group.value.id = config.value.group
      group.value.section = config.value.section
    }

    savingConfig.value = true

    const promises = []

    if (isNewSection.value) {
      promises.push(
        fetch(`/api/modules/${route.params.name}/config/section`, {
          method: editing ? 'PUT' : 'POST', // TODO: change this
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(section.value),
        }),
      )
    }

    if (isNewGroup.value) {
      promises.push(
        fetch(`/api/modules/${route.params.name}/config/group`, {
          method: editing ? 'PUT' : 'POST', // TODO: change this
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(group.value),
        }),
      )
    }

    promises.push(
      fetch(`/api/modules/${route.params.name}/config/field`, {
        method: editing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config.value),
      }),
    )

    Promise.all(promises)
      .then(async () => {
        useNotification().notify({ message: `Config successfully ${editing ? 'updated' : 'created'}`, type: 'success' })

        if (editing) {
          await navigateTo(`/modules/${String(route.params.name)}`)
        }

        const newConfigObject = Object.assign({}, configObject)
        newConfigObject.section = config.value.section
        newConfigObject.group = config.value.group
        newConfigObject.sortOrder = config.value.sortOrder + 10
        config.value = newConfigObject

        form.value?.resetValidation()
      })
      .catch((error) => {
        useNotification().notify({ message: `Failed to ${editing ? 'update' : 'create'} config: ${error}`, type: 'error' })
      })
      .finally(() => {
        savingConfig.value = false
      })
  }
</script>
