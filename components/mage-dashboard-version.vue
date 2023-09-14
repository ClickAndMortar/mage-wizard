<template>
  <VCard elevation="2">
    <VCardTitle>Magento version</VCardTitle>
    <VCardText>
      <div v-if="pending">
        <VProgressLinear indeterminate color="primary" />
      </div>
      <div v-else>
        <VAlert type="info" :icon="false" class="mb-4">
          <h3 class="text-center">
            <kbd>{{ version.version }}</kbd>
          </h3>
        </VAlert>
        <VAlert v-if="isPastEol" type="error">
          Your Magento version is past it's end of life date: <strong>{{ $luxon(version.eol, 'DDD') }}</strong> ({{
            $luxon(version.eol, 'relative', { unit: 'days' })
          }})
        </VAlert>
        <VAlert v-else type="success">
          Your Magento version is still supported by Adobe until <strong>{{ $luxon(version.eol, 'DDD') }}</strong> ({{
            $luxon(version.eol, 'relative', { unit: 'days' })
          }})
        </VAlert>
      </div>
    </VCardText>
  </VCard>
</template>
<script setup lang="ts">
  import type { MageVersion } from '~/lib/types'

  const { data: version, pending } = useFetch<MageVersion>('/api/version')

  const isPastEol = computed(() => {
    if (!version.value) {
      return false
    }

    const eolDate = new Date(version.value.eol)
    const now = new Date()

    return eolDate < now
  })
</script>
