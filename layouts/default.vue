<template>
  <v-layout class="rounded rounded-md">
    <v-navigation-drawer color="#3d3d3d">
      <div class="text-center my-3">
        <v-icon size="40px">mdi-wizard-hat</v-icon>
      </div>
      <v-list nav>
        <v-list-item prepend-icon="mdi-package-variant-closed" title="Modules" value="modules"
                     :to="{ path: '/modules' }" tag="a"></v-list-item>
        <v-list-item prepend-icon="mdi-power-plug-outline" title="Plugins" value="plugins"
                     :to="{ path: '/plugins' }" tag="a"></v-list-item>
        <v-list-item prepend-icon="mdi-console" title="Commands" value="commands"
                     :to="{ path: '/commands' }" tag="a"></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar title="Mage Wizard" color="#3d3d3d"></v-app-bar>

    <v-main class="d-flex" style="min-height: 300px;">
      <v-container>
        <slot/>
      </v-container>
    </v-main>
  </v-layout>
</template>
<script setup lang="ts">
useHead({
  titleTemplate: '%s - Mage Wizard',
})
</script>
