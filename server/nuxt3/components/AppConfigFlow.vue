<script setup lang="ts">
import { errorMessage } from '@stargram/core/utils'
import SelectConfig from './vue-flow/SelectConfig.vue'
import type { OutUserConfig, ServerConfig } from '~/composables/config'

const configStore = useConfigStore()
const toast = useToast()
const config = ref([configStore.config.app, configStore.config.webCard, configStore.config.imgStorage])
const { data: fetchData } = await useFetch('/api/defaultBotConfig')
const defaultBotConfig = ref<ServerConfig<OutUserConfig>>()
const cryption = useCryption()
async function onInit() {
  const outConfig = configStore.outUserConfig
  const appName = outConfig.app.select
  const userConfig: ServerConfig<OutUserConfig> = JSON.parse(JSON.stringify(outConfig))
  if (userConfig.imgStorage.select === 'LocalService' && defaultBotConfig.value)
    userConfig.imgStorage = JSON.parse(JSON.stringify(defaultBotConfig.value.imgStorage))

  await $fetch(`/api/${appName}/init`, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain',
    },
    body: cryption.encode(JSON.stringify(userConfig)),
  }).then((res) => {
    toast.add({
      title: res as string,
      color: 'green',
      timeout: 5000,
      icon: 'i-carbon-checkmark-outline',
    })
  }).catch((err) => {
    toast.add({
      title: errorMessage(err),
      color: 'red',
      timeout: 5000,
      icon: 'i-carbon-warning',
    })
  })
}

onMounted(() => {
  if (fetchData.value && fetchData.value.config) {
    defaultBotConfig.value = JSON.parse(cryption.decode(fetchData.value.config)) as ServerConfig<OutUserConfig>
    configStore.config.imgStorage.select = 'LocalService'
    // @ts-expect-error  eslint-disable-next-line
    configStore.config.imgStorage.info.LocalService = {
      displayName: 'Local Service',
      config: {
      },
      output: 'Image URL',
    }
    config.value = [configStore.config.app, configStore.config.webCard, configStore.config.imgStorage]
  }
})
</script>

<template>
  <div flex justify-center>
    <div mt-4 flex justify-center gap-4 rounded lt-sm:flex-col class="bg-stripes-black lt-sm:w-4/5">
      <div v-for="model in config" :key="model.select" class="basicflow customnodeflow">
        <div class="vue-flow__node-select lt-sm:w-full!">
          <SelectConfig :data="model" :need-handler="false" />
        </div>
      </div>
    </div>
  </div>
  <div mt-4 flex justify-center>
    <button btn @click="onInit">
      Init
    </button>
  </div>
  <div my-4 flex justify-center>
    Setup your bot then send command <span font-bold>&nbsp;/start&nbsp;</span> to configure your custom settings.
  </div>
</template>

<style lang="scss" scoped>
.customnodeflow {
  .vue-flow__node-select {
    border: 1px solid #777;
    padding: 10px;
    border-radius: 4px;
    background: white;
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: 200px;

    &:hover {
      border-color: #292524;
      box-shadow: 0 5px 10px #0000004d;
    }

    &.selected {
      border: 1px solid transparent;
      box-shadow: 0 5px 10px #0000004d;
      background: linear-gradient(90deg, #fff, #fff),
        linear-gradient(45deg, #54c8fa, #be1cfa, #54c8fa);
      background-origin: border-box;
      background-clip: padding-box, border-box;
    }
  }
}
.customnodeflow.dark {
  .vue-flow__node-select {
    &.selected {
      border: 1px solid transparent;
      box-shadow: 0 5px 10px #0000004d;
      background: linear-gradient(90deg, #292524, #292524),
        linear-gradient(45deg, #54c8fa, #be1cfa, #54c8fa);
      background-origin: border-box;
      background-clip: padding-box, border-box;
    }
  }
}
.bg-stripes-black {
  background-color: #f7f7fa;
  background-image: linear-gradient(
    135deg,
    #1b1c1c80 10%,
    #0000 0,
    #0000 50%,
    #1a1b1b80 0,
    #26292a80 60%,
    #0000 0,
    #0000
  );
  background-size: 7.07px 7.07px;
}
</style>
