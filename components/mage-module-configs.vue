<template>
  <VTable v-if="fields.length > 0" density="compact" class="table-striped">
    <thead>
      <tr>
        <th class="text-left" style="width: 30%">Path</th>
        <th class="text-left" style="width: 10%">Type</th>
        <th class="text-left" style="width: 30%">Label</th>
        <th class="text-left" style="width: 10%">Sort order</th>
        <th class="text-left" style="width: 10%">Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="field in fields" :key="field.id">
        <td>
          <code>{{ field.path }}</code>
          <VBtn icon size="x-small" flat class="ml-2" @click="copyToClipboard(field.path)">
            <VIcon size="small">mdi-content-copy</VIcon>
          </VBtn>
        </td>
        <td>
          <code>{{ field.type }}</code>
        </td>
        <td>
          {{ field.label }}
        </td>
        <td>
          <code>{{ field.sortOrder }}</code>
        </td>
        <td>
          <VBtn icon size="x-small" flat @click="showFieldDialog(field)">
            <VIcon size="small">mdi-eye-outline</VIcon>
          </VBtn>
          <VBtn icon size="x-small" flat :to="{ name: 'modules-name-new-edit-system-config', params: { name: moduleName }, query: { path: field.path } }">
            <VIcon size="small">mdi-pencil</VIcon>
          </VBtn>
        </td>
      </tr>
    </tbody>
  </VTable>
  <VAlert v-else density="compact" type="info">No configs found</VAlert>
  <VDialog v-model="configViewDialog" width="750px" min-height="300px" :z-index="99999">
    <VCard min-height="300px">
      <VCardText>
        <VTable density="compact" class="table-striped">
          <thead>
            <tr>
              <th class="text-left" style="width: 40%">Key</th>
              <th class="text-left" style="width: 60%">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>ID</td>
              <td>
                <code>{{ currentConfigField.id }}</code>
              </td>
            </tr>
            <tr>
              <td>Path</td>
              <td>
                <code>{{ currentConfigField.path }}</code>
                <VBtn icon size="x-small" flat class="ml-2" @click="copyToClipboard(currentConfigField.path)">
                  <VIcon size="small">mdi-content-copy</VIcon>
                </VBtn>
              </td>
            </tr>
            <tr>
              <td>Label</td>
              <td>
                {{ currentConfigField.label }}
              </td>
            </tr>
            <tr>
              <td>Type</td>
              <td>
                <code>{{ currentConfigField.type }}</code>
              </td>
            </tr>
            <tr>
              <td>Sort order</td>
              <td>
                <code v-if="currentConfigField.sortOrder !== undefined">{{ currentConfigField.sortOrder }}</code>
              </td>
            </tr>
            <tr v-if="currentConfigField.comment">
              <td>Comment</td>
              <td>
                <span v-html="currentConfigField.comment"></span>
              </td>
            </tr>
            <tr v-if="currentConfigField.frontendModel">
              <td>Frontend model</td>
              <td>
                <code>{{ currentConfigField.frontendModel }}</code>
              </td>
            </tr>
            <tr v-if="currentConfigField.frontendClass">
              <td>Frontend class</td>
              <td>
                <code>{{ currentConfigField.frontendClass }}</code>
              </td>
            </tr>
            <tr v-if="currentConfigField.backendModel">
              <td>Backend model</td>
              <td>
                <code>{{ currentConfigField.backendModel }}</code>
              </td>
            </tr>
            <tr v-if="currentConfigField.sourceModel">
              <td>Source model</td>
              <td>
                <code>{{ currentConfigField.sourceModel }}</code>
              </td>
            </tr>
            <tr v-if="currentConfigField.default">
              <td>Default value</td>
              <td>
                <code>{{ currentConfigField.default }}</code>
              </td>
            </tr>
          </tbody>
        </VTable>
      </VCardText>
    </VCard>
  </VDialog>
</template>
<script setup lang="ts">
  import type { MageSystemConfigField } from '~/lib/types'

  defineProps({
    fields: {
      type: Array as PropType<MageSystemConfigField[]>,
      required: true,
      default: () => [],
    },
    moduleName: {
      type: String,
      required: true,
    },
  })

  const configViewDialog = ref(false)
  const currentConfigField = ref<MageSystemConfigField>({} as MageSystemConfigField)

  const showFieldDialog = (field: MageSystemConfigField) => {
    currentConfigField.value = field
    configViewDialog.value = true
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    useNotification().notify({
      message: 'Copied value to clipboard',
      type: 'info',
    })
  }
</script>
