<template>
  <div>
    <VCard elevation="3">
      <VCardTitle>
        <VIcon>mdi-package-variant-closed</VIcon>
        <NuxtLink class="ml-1" :to="{ name: 'modules' }">Modules</NuxtLink>
        <VIcon>mdi-slash-forward</VIcon>
        {{ moduleName }}
      </VCardTitle>
      <VCardText> Description </VCardText>
    </VCard>
    <VExpansionPanels variant="accordion" class="mt-4">
      <VExpansionPanel :readonly="!plugins?.length">
        <VExpansionPanelTitle>
          <VRow no-gutters>
            <VCol cols="4" class="d-flex justify-start align-center">
              <strong>Plugins</strong>
              <VChip v-if="!pendingPlugins" size="small" class="ml-2">{{ plugins?.length || 0 }}</VChip>
              <VProgressCircular v-if="pendingPlugins" size="24" color="grey" indeterminate class="ml-2" />
            </VCol>
            <VCol cols="8" class="d-flex justify-end">
              <VBtn color="primary" flat size="small" :to="{ name: 'modules-new' }" class="mr-4"> <VIcon>mdi-plus</VIcon> Create </VBtn>
            </VCol>
          </VRow>
        </VExpansionPanelTitle>
        <VExpansionPanelText>
          <MageModulePlugins :plugins="plugins" />
        </VExpansionPanelText>
      </VExpansionPanel>
      <VExpansionPanel :readonly="!commands?.length">
        <VExpansionPanelTitle>
          <VRow no-gutters>
            <VCol cols="4" class="d-flex justify-start align-center">
              <strong>Commands</strong>
              <VChip v-if="!pendingCommands" size="small" class="ml-2">{{ commands?.length || 0 }}</VChip>
              <VProgressCircular v-if="pendingCommands" size="24" color="grey" indeterminate class="ml-2" />
            </VCol>
            <VCol cols="8" class="d-flex justify-end">
              <VBtn color="primary" flat size="small" :to="{ name: 'modules-name-new-command', params: { name: module } }" class="mr-4"> <VIcon>mdi-plus</VIcon> Create </VBtn>
            </VCol>
          </VRow>
        </VExpansionPanelTitle>
        <VExpansionPanelText>
          <MageModuleCommands :commands="commands" />
        </VExpansionPanelText>
      </VExpansionPanel>
    </VExpansionPanels>
  </div>
</template>

<script setup lang="ts">
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
</script>
