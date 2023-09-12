<template>
  <div>
    <VCard elevation="3">
      <VCardTitle>
        <VRow>
          <VCol cols="6">
            <VIcon>mdi-package-variant-closed</VIcon>
            <NuxtLink class="ml-1" :to="{ name: 'modules' }">Modules</NuxtLink>
            <VIcon>mdi-slash-forward</VIcon>
            {{ moduleName }}
          </VCol>
          <VCol cols="6" class="text-right">
            <VMenu>
              <template #activator="{ props }">
                <VBtn color="primary" size="small" flat v-bind="props">Generate<VIcon end>mdi-menu-down</VIcon></VBtn>
              </template>
              <VList>
                <VListItem
                  prepend-icon="mdi-console"
                  value="new-command"
                  :to="{ name: 'modules-name-new-command', params: { name: moduleName } }"
                  density="compact"
                >
                  <VListItemTitle>Command</VListItemTitle>
                </VListItem>
                <VListItem
                  prepend-icon="mdi-power-plug-outline"
                  value="new-plugin"
                  :to="{ name: 'modules-name-new-command', params: { name: moduleName } }"
                  density="compact"
                >
                  <VListItemTitle>Plugin</VListItemTitle>
                </VListItem>
                <VListItem
                  prepend-icon="mdi-cog-outline"
                  value="new-plugin"
                  :to="{ name: 'modules-name-new-edit-system-config', params: { name: moduleName } }"
                  density="compact"
                >
                  <VListItemTitle>System config</VListItemTitle>
                </VListItem>
              </VList>
            </VMenu>
          </VCol>
        </VRow>
      </VCardTitle>
    </VCard>
    <VExpansionPanels variant="accordion" class="mt-4">
      <VExpansionPanel :disabled="config && configFieldCount === 0">
        <VExpansionPanelTitle>
          <strong>System configs</strong>
          <VChip v-if="!pendingConfig" size="small" class="ml-2">{{ configFieldCount }}</VChip>
          <VProgressCircular v-if="pendingConfig" size="24" color="grey" indeterminate class="ml-2" />
        </VExpansionPanelTitle>
        <VExpansionPanelText>
          <MageModuleConfigs :fields="configFields" :module-name="moduleName" />
        </VExpansionPanelText>
      </VExpansionPanel>
      <VExpansionPanel :disabled="plugins && !plugins?.length">
        <VExpansionPanelTitle>
          <strong>Plugins</strong>
          <VChip v-if="!pendingPlugins" size="small" class="ml-2">{{ plugins?.length || 0 }}</VChip>
          <VProgressCircular v-if="pendingPlugins" size="24" color="grey" indeterminate class="ml-2" />
        </VExpansionPanelTitle>
        <VExpansionPanelText>
          <MageModulePlugins :plugins="plugins" />
        </VExpansionPanelText>
      </VExpansionPanel>
      <VExpansionPanel :disabled="commands && !commands?.length">
        <VExpansionPanelTitle>
          <strong>Commands</strong>
          <VChip v-if="!pendingCommands" size="small" class="ml-2">{{ commands?.length || 0 }}</VChip>
          <VProgressCircular v-if="pendingCommands" size="24" color="grey" indeterminate class="ml-2" />
        </VExpansionPanelTitle>
        <VExpansionPanelText>
          <MageModuleCommands :commands="commands" />
        </VExpansionPanelText>
      </VExpansionPanel>
    </VExpansionPanels>
  </div>
</template>

<script setup lang="ts">
  // eslint-disable-next-line import/default
  import jsonpath from 'jsonpath'

  const route = useRoute()
  const moduleName = route.params.name

  useHead({
    title: String(moduleName),
  })

  const { data: module } = await useFetch(`/api/modules/${moduleName}`)
  if (!module.value) {
    throw showError({ statusCode: 404, statusMessage: 'Module not found' })
  }

  const { data: plugins, pending: pendingPlugins } = useFetch('/api/plugins', { query: { module: moduleName } })
  const { data: commands, pending: pendingCommands } = useFetch('/api/commands', { query: { module: moduleName } })
  const { data: config, pending: pendingConfig } = useFetch(`/api/modules/${moduleName}/config`)

  const configFields = computed(() => {
    if (!config.value) {
      return []
    }

    // eslint-disable-next-line import/no-named-as-default-member
    return jsonpath.query(config.value, '$..fields[?(@.id)]')
  })

  const configFieldCount = computed(() => {
    if (!config.value) {
      return 0
    }

    return configFields.value.length
  })
</script>
