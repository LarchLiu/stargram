<script setup lang="ts">
import { errorMessage } from '@stargram/core/utils'
import UserConfigFlow from '~/components/UserConfigFlow.vue'
import { appName as _appName, cryption } from '~/constants'
import type { BasicConfig, ModelsConfig, OutUserConfig, ServerConfig } from '~/composables/config'

useHead({
  title: `User Config - ${_appName}`,
  meta: [
    { property: 'og:title', content: `User Config - ${_appName}` },
  ],
})
const route = useRoute()
const toast = useToast()
const showBot = ref(false)
const telegramBot = ref<Record<string, any>[]>([])
const slackBot = ref<Record<string, any>[]>([])
const { code } = route.query
const decode = cryption.decode(code as string)
const { appName, appId, userId } = (decode && decode.includes('appName')) ? JSON.parse(decode) : { appName: '', appId: '', userId: '' }
// useFetch just use on the setup top level
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
  try {
    await $fetch(`/api/${appName}/${appId}/adduser`, {
      method: 'POST',
      body: {
        userId,
        userConfig: cryption.encode(JSON.stringify(config)),
      },
    })
    if (appName === 'stargram') {
      const id = useLocalStorage('userId', '')
      id.value = userId
    }

    toast.add({ title: 'success', color: 'green', timeout: 2000, icon: 'i-carbon-checkmark-outline' })
  }
  catch (error) {
    toast.add({ title: errorMessage(error), color: 'red', timeout: 2000, icon: 'i-carbon-warning' })
  }
}

onMounted(async () => {
  if (!code) {
    const data = await $fetch<{ telegram: Record<string, any>[]; slack: Record<string, any>[] }>('/api/botInfo')
    if (data) {
      showBot.value = true
      telegramBot.value = data.telegram
      slackBot.value = data.slack
    }
  }
})
</script>

<template>
  <div>
    <UserConfigFlow v-if="appConfig" :config="appConfig" :app-info="{ appName, botId: appId, userId }" @change="onChange" />
    <div v-else-if="showBot">
      <div flex justify-center py-4>
        Setup your bot then send command <span font-bold>&nbsp;/start&nbsp;</span> to configure your custom settings.
      </div>
      <div flex justify-center gap-4>
        <div v-for="telegram in telegramBot" :key="telegram.id" class="btn">
          <a flex items-center target="_blank" :href="`https://t.me/${telegram.username}`">
            <div uno-logos-telegram mr-2 />
            {{ telegram.first_name }}
          </a>
        </div>
      </div>
      <div mt-2 flex justify-center gap-4>
        <div v-for="slack in slackBot" :key="slack.appId" class="btn">
          <a flex items-center target="_blank" :href="`https://slack.com/oauth/v2/authorize?client_id=${slack.clientId}&scope=commands,incoming-webhook&user_scope=im:history`">
            <div uno-logos-slack-icon mr-2 />
            {{ slack.appId }}
          </a>
        </div>
      </div>
    </div>
    <div v-else flex justify-center py-4>
      {{ `${decode === '' ? 'Waitting...' : 'App not init.'}` }}
    </div>
  </div>
</template>

<style scoped>

</style>
