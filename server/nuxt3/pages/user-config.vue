<script setup lang="ts">
import { errorMessage } from '@stargram/core/utils'
import UserConfigFlow from '~/components/UserConfigFlow.vue'
import { cryption } from '~/constants'
import type { OutUserConfig, ServerConfig } from '~/composables/config'

const route = useRoute()
const { code } = route.query
const regex = /[A-Za-z]+[A-Z0-9][0-9]$/g
const decode = (code && code.length > 2 && regex.test(code as string)) ? cryption.decode(code as string) : ''
const { appName, appId, userId } = decode.includes('appName') ? JSON.parse(decode) : { appName: 'a', appId: 'b', userId: 'c' }

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
    alert(errorMessage(error.value))
  else
    alert('success')
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
