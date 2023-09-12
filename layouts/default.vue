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

    <VAppBar title="Mage Wizard" color="#3d3d3d">
      <VBtn icon :loading="loadingSettings" @click="() => (settingsDialog = !settingsDialog)">
        <VIcon>mdi-cog</VIcon>
      </VBtn>
    </VAppBar>

    <VMain class="d-flex" style="min-height: 300px">
      <VContainer>
        <slot></slot>
      </VContainer>
      <Notifications />
    </VMain>

    <VDialog v-model="settingsDialog" min-height="300px" min-width="500px" max-width="700px">
      <VForm ref="settingsForm">
        <VCard min-height="300px">
          <VCardTitle>Settings</VCardTitle>
          <VCardText>
            <VRow>
              <VCol>
                <VTextField v-model="settings.path" label="Absolute path to Magento root" variant="outlined" :rules="[requiredRule]">
                  <template #append-inner>
                    <VBtn v-if="settings.path" icon flat size="small" @click="validateSettingsPath">
                      <VIcon size="large">mdi-check-circle-outline</VIcon>
                    </VBtn>
                  </template>
                </VTextField>
              </VCol>
            </VRow>
            <VRow style="margin-top: -30px" class="mb-3">
              <VCol>
                <VExpandTransition>
                  <VAlert v-show="showSettingsPathValidationResult" :type="settingsPathValid ? 'success' : 'error'">
                    {{ settingsPathValid ? 'Path is valid' : 'Path is not valid' }}
                  </VAlert>
                </VExpandTransition>
              </VCol>
            </VRow>
            <VRow>
              <VCol>
                <VSelect v-model="settings.version" :items="magentoVersionItems" label="Magento version" variant="outlined" :rules="[requiredRule]" />
              </VCol>
            </VRow>
          </VCardText>
          <VCardActions>
            <VSpacer />
            <VBtn color="primary" text @click="saveSettings">Save &amp; Close</VBtn>
          </VCardActions>
        </VCard>
      </VForm>
    </VDialog>
  </VLayout>
</template>
<script setup lang="ts">
  import { VForm } from 'vuetify/components'
  import type { MageWizardSettings } from '~/lib/types'

  useHead({
    titleTemplate: '%s - Mage Wizard',
  })

  const settingsDialog = ref(false)
  const loadingSettings = ref(false)
  const settingsPathValid = ref(false)
  const showSettingsPathValidationResult = ref(false)
  const settingsForm = ref<VForm>()

  const settings = ref<MageWizardSettings>({
    path: '',
    version: '',
  })

  const requiredRule = (v: string) => !!v || 'This field is required'

  const magentoVersionItems = ['2.3.x', '2.4.3', '2.4.4', '2.4.5', '2.4.6', '2.4.7']

  const validateSettingsPath = (): void => {
    showSettingsPathValidationResult.value = false

    fetch(`/api/settings/validate-path?path=${settings.value.path}`, {
      method: 'GET',
    })
      .then(async (response) => {
        const body = await response.json()
        settingsPathValid.value = body.valid
      })
      .catch(() => {
        settingsPathValid.value = false
      })
      .finally(() => {
        showSettingsPathValidationResult.value = true
      })
  }

  const saveSettings = async (event: Event) => {
    event.preventDefault()
    if (!settingsForm.value) {
      return
    }

    const { valid } = await settingsForm.value?.validate()

    if (!valid) {
      return
    }

    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings.value),
      })

      useNotification().notify({
        message: 'Settings saved',
        type: 'success',
      })

      settingsDialog.value = false
      showSettingsPathValidationResult.value = false
    } catch {
      useNotification().notify({
        message: 'Error saving settings',
        type: 'error',
      })
    }
  }

  watch(
    () => settings.value.path,
    () => {
      showSettingsPathValidationResult.value = false
    },
  )
</script>
