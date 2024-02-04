<script setup lang="ts">
import type { BasicConfig, ModelName, ModelsConfig, OutUserConfig, ServerConfig } from '../composables/config'
import SelectConfig from './vue-flow/SelectConfig.vue'

const props = defineProps<{
  config: ServerConfig<BasicConfig<ModelsConfig> & { options: Record<string, any>[] }>
  appInfo: { appName: string, botId: string, userId: string }
}>()

const emit = defineEmits<{
  change: [config: ServerConfig<OutUserConfig>]
}>()

const { copy, copied } = useClipboard()
const userConfig = ref(props.config)

function onConfirm() {
  const keys = Object.keys(userConfig.value)
  const obj: Record<string, any> = {}
  keys.forEach((k) => {
    const c = userConfig.value[k as ModelName]
    const select = c.select as keyof typeof c.info
    if (c.userConfig) {
      const _config = getConfigKV(c.info[select].config)
      obj[k] = { select: c.select, public: c.public, config: _config }
    }
  })
  emit('change', obj as ServerConfig<OutUserConfig>)
}

const outUserConfig = computed(() => {
  const keys = Object.keys(userConfig.value!)
  const config: Record<string, any> = {}
  keys.forEach((k) => {
    const c = userConfig.value![k as ModelName]
    const select = c.select as keyof typeof c.info
    if (c.userConfig) {
      const _config = c.info[select].config
      config[k] = { select: c.select, public: c.public, config: _config }
    }
  })
  return config
})

function copyUserConfig() {
  const config = JSON.parse(JSON.stringify(outUserConfig.value))
  config.app = {
    public: true,
    appName: props.appInfo.appName,
    botId: props.appInfo.botId,
    userId: props.appInfo.userId,
    stargramHub: `${location.protocol}//${location.host}`,
  }
  copy(JSON.stringify(config))
}
</script>

<template>
  <div flex justify-center>
    <div mt-4 flex justify-center gap-4 rounded lt-sm:flex-col class="bg-stripes-black lt-sm:w-4/5">
      <div v-for="model in userConfig" :key="model.select" class="basicflow customnodeflow">
        <div class="vue-flow__node-select lt-sm:w-full!">
          <SelectConfig :data="model" :need-handler="false" />
        </div>
      </div>
    </div>
  </div>
  <div mt-4 flex justify-center>
    <button btn @click="onConfirm">
      Confirm
    </button>
  </div>
  <div mt-4 flex flex-col items-center>
    Copy config for extension
    <button mt-4 btn @click="copyUserConfig">
      <span v-if="!copied">Copy</span>
      <span v-else>Copied!</span>
    </button>
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
