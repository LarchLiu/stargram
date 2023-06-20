<script setup lang="ts">
import { errorMessage } from '@stargram/core/utils'
import UserConfigFlow from '~/components/UserConfigFlow.vue'
import { cryption } from '~/constants'
import type { OutUserConfig, ServerConfig } from '~/composables/config'

const route = useRoute()
const toast = useToast()
const { code } = route.query
const decode = cryption.decode(code as string)
const { appName, appId, userId } = (decode && decode.includes('appName')) ? JSON.parse(decode) : { appName: 'a', appId: 'b', userId: 'c' }

const { data } = await useFetch<{ config: string }>(`/api/${appName}/${appId}/adduser`, {
  method: 'GET',
})
const appConfig = computed(() => {
  if (data.value?.config)
    return JSON.parse(cryption.decode(data.value.config)) as ServerConfig<OutUserConfig>
})

async function onChange(config: ServerConfig<OutUserConfig>) {
  const { error } = await useFetch(`/api/${appName}/${appId}/adduser`, {
    method: 'POST',
    body: {
      userId,
      userConfig: cryption.encode(JSON.stringify(config)),
    },
  })
  if (error.value)
    toast.add({ title: errorMessage(error.value), color: 'red', timeout: 2000, icon: 'i-carbon-warning' })
  else
    toast.add({ title: 'success', color: 'green', timeout: 2000, icon: 'i-carbon-checkmark-outline' })
}
</script>

<template>
  <div>
    <UserConfigFlow v-if="appConfig" :show-app-select="false" :config="appConfig" @change="onChange" />
    <div v-else>
      {{ `${decode === '' ? 'Code error.' : 'App not init.'}` }}
    </div>
  </div>
</template>

<style scoped>

</style>
