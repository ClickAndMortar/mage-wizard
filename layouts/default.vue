<template>
  <VLayout class="rounded rounded-md">
    <VNavigationDrawer color="#3d3d3d">
      <div class="text-center my-3">
        <VIcon size="40px">mdi-wizard-hat</VIcon>
      </div>
      <VList nav>
        <VListItem prepend-icon="mdi-package-variant-closed" title="Modules" value="modules" :to="{ path: '/modules' }" tag="a" />
        <VListItem prepend-icon="mdi-power-plug-outline" title="Plugins" value="plugins" :to="{ path: '/plugins' }" tag="a" />
        <VListItem prepend-icon="mdi-console" title="Commands" value="commands" :to="{ path: '/commands' }" tag="a" />
      </VList>
    </VNavigationDrawer>

    <VAppBar title="Mage Wizard" color="#3d3d3d" />

    <VMain class="d-flex" style="min-height: 300px">
      <VContainer>
        <slot></slot>
      </VContainer>
      <Notifications />
    </VMain>
  </VLayout>
</template>
<script setup lang="ts">
  useHead({
    titleTemplate: '%s - Mage Wizard',
  })
</script>
