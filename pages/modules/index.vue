<template>
  <VCard elevation="3">
    <VCardTitle>
      <VRow>
        <VCol cols="4"> <VIcon>mdi-package-variant-closed</VIcon> Modules </VCol>
        <VCol cols="8" class="text-right">
          <VBtn size="small" flat @click="filtering = !filtering">
            <VIcon>mdi-filter</VIcon>
            Filters
          </VBtn>
          <VBtn color="primary" flat size="small" :to="{ name: 'modules-new' }" class="ml-2">New module</VBtn>
        </VCol>
      </VRow>
    </VCardTitle>
    <VCardText>
      <VExpandTransition>
        <div v-if="filtering">
          <VCard flat color="#fafafa">
            <VCardTitle tag="h3">Filters</VCardTitle>
            <VCardText>
              <VRow class="mt-2">
                <VCol cols="2">
                  <VTextField v-model="filter.namespace" label="Namespace" variant="outlined" density="compact" />
                </VCol>
                <VCol cols="2">
                  <VTextField v-model="filter.name" label="Name" variant="outlined" density="compact" />
                </VCol>
                <VCol cols="2">
                  <VSwitch
                    v-model="filter.disabled"
                    :true-value="true"
                    :false-value="false"
                    label="Show disabled"
                    density="compact"
                    color="orange-darken-3"
                    value="orange-darken-3"
                  />
                </VCol>
                <VCol cols="2">
                  <VSwitch
                    v-model="filter.core"
                    :true-value="true"
                    :false-value="false"
                    label="Show core"
                    density="compact"
                    color="orange-darken-3"
                    value="orange-darken-3"
                  />
                </VCol>
                <VCol cols="2">
                  <VSwitch
                    v-model="filter.vendor"
                    :true-value="true"
                    :false-value="false"
                    label="Show vendor"
                    density="compact"
                    color="orange-darken-3"
                    value="orange-darken-3"
                  />
                </VCol>
              </VRow>
            </VCardText>
          </VCard>
        </div>
      </VExpandTransition>
      <VDataTable
        v-model:items-per-page="itemsPerPage"
        v-model:sort-by="sortBy"
        density="compact"
        :headers="headers"
        :items="filteredModules"
        :loading="pending"
      >
        <template #item.namespace="{ item }">
          <code>{{ item.columns.namespace }}</code>
        </template>
        <template #item.name="{ item }">
          <code>{{ item.columns.name }}</code>
        </template>
        <template #item.version="{ item }">
          <code v-if="item.columns.version">{{ item.columns.version }}</code>
        </template>
        <template #item.enabled="{ item }">
          <VIcon v-if="item.columns.enabled">mdi-check</VIcon>
        </template>
        <template #item.actions="{ item }">
          <VBtn icon size="x-small" flat :to="{ name: 'modules-name', params: { name: item.raw.fqn } }"><VIcon size="medium">mdi-eye-outline</VIcon></VBtn>
        </template>
        <template #item.dependencies="{ item }">
          <VTooltip v-if="item.columns.dependencies.length > 0" location="top">
            <template #activator="{ props }">
              <VChip class="ml-2" size="x-small" v-bind="props">{{ item.columns.dependencies.length }}</VChip>
            </template>
            <div v-for="dependency in item.columns.dependencies" :key="dependency">
              {{ dependency }}
            </div>
          </VTooltip>
        </template>
      </VDataTable>
    </VCardText>
  </VCard>
</template>
<script setup lang="ts">
  import type { MageModule } from '~/lib/types'

  useHead({
    title: 'Modules',
  })

  const filtering = ref(false)

  const filter = ref({
    namespace: '',
    name: '',
    disabled: false,
    core: false,
    vendor: false,
  })

  const { data: modules, pending } = await useFetch('/api/modules')

  const filteredModules = computed(() => {
    return modules.value?.filter((module: MageModule) => {
      if (filter.value.namespace && !module.namespace.toLowerCase().includes(filter.value.namespace.toLowerCase())) {
        return false
      }

      if (filter.value.name && !module.name.toLowerCase().includes(filter.value.name.toLowerCase())) {
        return false
      }

      if (!filter.value.disabled && module.enabled === false) {
        return false
      }

      if (!filter.value.vendor && module.vendor) {
        return false
      }

      // eslint-disable-next-line sonarjs/prefer-single-boolean-return
      if (!filter.value.core && module.core) {
        return false
      }

      return true
    })
  })

  watch(
    filter,
    () => {
      if (filter.value.core) {
        filter.value.vendor = true
      }
    },
    {
      deep: true,
    },
  )

  const itemsPerPage = 50
  const sortBy = [
    { key: 'namespace', order: 'asc' },
    { key: 'name', order: 'asc' },
  ]

  const headers = [
    { title: 'Namespace', align: 'start', key: 'namespace', width: '20%' },
    { title: 'Name', align: 'start', key: 'name', width: '40%' },
    { title: 'Version', align: 'start', key: 'version', width: '10%' },
    { title: 'Enabled', align: 'start', key: 'enabled', width: '10%' },
    { title: 'Dependencies', align: 'start', key: 'dependencies', width: '10%' },
    { title: 'Actions', align: 'start', key: 'actions', width: '10%' },
  ]
</script>
