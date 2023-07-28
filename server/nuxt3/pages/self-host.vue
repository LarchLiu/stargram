<script setup lang="ts">
import { cryption } from '../constants/index'
import type { OutUserConfig, ServerConfig } from '~/composables/config'

const configStore = useConfigStore()
const { data: fetchData } = await useFetch('/api/defaultBotConfig')
const defaultBotConfig = ref<ServerConfig<OutUserConfig>>()

onMounted(() => {
  if (fetchData.value && fetchData.value.config) {
    defaultBotConfig.value = JSON.parse(cryption.decode(fetchData.value.config)) as ServerConfig<OutUserConfig>
    configStore.config.imgStorage.select = 'LocalService'
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
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
