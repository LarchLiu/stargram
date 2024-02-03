<script setup lang="ts">
import { appName } from '~/constants'

useHead({
  title: `App Config - ${appName}`,
  meta: [
    { property: 'og:title', content: `App Config - ${appName}` },
  ],
})
</script>

<template>
  <div>
    <AppConfigFlow />
  </div>
</template>

<style scoped>
</style>
