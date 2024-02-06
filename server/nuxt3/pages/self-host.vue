<script setup lang="ts">
import { appName } from '../constants/index'
import type { OutUserConfig, ServerConfig } from '~/composables/config'

useHead({
  title: `Self Host - ${appName}`,
  meta: [
    { property: 'og:title', content: `Self Host - ${appName}` },
  ],
})
const configStore = useConfigStore()
const { data: fetchData } = await useFetch('/api/defaultBotConfig')
const defaultBotConfig = ref<ServerConfig<OutUserConfig>>()
const cryption = useCryption()

onMounted(() => {
  if (fetchData.value && fetchData.value.config) {
    defaultBotConfig.value = JSON.parse(cryption.decode(fetchData.value.config)) as ServerConfig<OutUserConfig>
    configStore.config.imgStorage.select = 'LocalService'
    // @ts-expect-error eslint-disable-next-line
    configStore.config.imgStorage.info.LocalService = {
      displayName: 'Local Service',
      config: {
      },
      output: 'Image URL',
    }
  }
})
</script>

<template>
  <ConfigFlow />
</template>

<style scoped>

</style>
