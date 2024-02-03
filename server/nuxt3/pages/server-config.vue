<script setup lang="ts">
import { appName } from '~/constants'

useHead({
  title: `Server Config - ${appName}`,
  meta: [
    { property: 'og:title', content: `Server Config - ${appName}` },
  ],
})
</script>

<template>
  <div>
    <ServerConfigFlow />
  </div>
</template>

<style scoped>

</style>
