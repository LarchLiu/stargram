<script setup lang="ts">
import { errorMessage } from '@stargram/core/utils'
import UserConfigFlow from '~/components/UserConfigFlow.vue'
import { cryption } from '~/constants'
import type { BasicConfig, ModelsConfig, OutUserConfig, ServerConfig } from '~/composables/config'

const route = useRoute()
const toast = useToast()
const { code } = route.query
const decode = cryption.decode(code as string)
const { appName, appId, userId } = (decode && decode.includes('appName')) ? JSON.parse(decode) : { appName: '', appId: '', userId: '' }
const { data } = await useFetch<{ config: string }>(`/api/${appName}/${appId}/adduser`, {
  method: 'GET',
  query: {
    userId,
  },
})
const appConfig = computed(() => {
  if (appName && appId && userId) {
    let userConfig: ServerConfig<OutUserConfig> | undefined
    if (data.value?.config)
      userConfig = JSON.parse(cryption.decode(data.value.config))

    const keys = Object.keys(defaultConfig)
    const config: any = {}
    const showAppSelect = false
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i] as keyof ServerConfig<OutUserConfig>
      const value = JSON.parse(JSON.stringify(defaultConfig[key])) as BasicConfig<ModelsConfig>
      if (key === 'app') {
        if (showAppSelect)
          config[key] = value
      }
      else if (value.userConfig && !value.public) {
        config[key] = value
      }

      if (config[key]) {
        const info = value.info
        const infoKeys = Object.keys(info)
        const options = infoKeys.map((m) => {
          return {
            value: m,
            label: info[m as keyof typeof info].displayName,
          }
        })
        config[key].options = options
        if (userConfig && userConfig[key]) {
          const select = userConfig[key].select
          config[key].select = select
          Object.keys(userConfig[key].config!).forEach((k) => {
            config[key].info[select].config[k].value = userConfig![key].config![k]
          })
        }
      }
    }
    return config as ServerConfig<BasicConfig<ModelsConfig> & { options: Record<string, any>[] }>
  }
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
    <UserConfigFlow v-if="appConfig" :config="appConfig" @change="onChange" />
    <div v-else>
      {{ `${decode === '' ? 'Code error.' : 'App not init.'}` }}
    </div>
  </div>
</template>

<style scoped>

</style>
