<script setup lang="ts">
import type { BasicConfig, ModelName, ModelsConfig, OutUserConfig, ServerConfig } from '../composables/config'

const props = defineProps<{
  config: ServerConfig<BasicConfig<ModelsConfig> & { options: Record<string, any>[] }>
}>()

const emit = defineEmits<{
  change: [config: ServerConfig<OutUserConfig>]
}>()

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
</script>

<template>
  <div flex justify-center>
    <div mt-4 flex justify-center gap-4 rounded lt-sm:flex-col class="bg-stripes-black lt-sm:w-4/5">
      <div v-for="model in userConfig" :key="model.select" class="basicflow customnodeflow">
        <div class="vue-flow__node-select lt-sm:w-full!">
          <div mb-1 flex flex-row items-center justify-start text-12px>
            <div :class="model.title.icon" text-1.2rem />
            <div ml-1 text-12px>
              {{ model.title.text }}
            </div>
          </div>
          <div flex flex-col text-10px>
            <select v-model="model.select" :name="model.title.text" autocomplete="off" class="vue-flow">
              <option v-for="o in model.options" :key="o.value" :value="o.value">
                {{ o.label }}
              </option>
            </select>
            <div v-for="c in model.info[model.select as keyof ModelsConfig].config" :key="c.label">
              <div mt-2 text-gray>
                {{ c.label }} <span v-if="c.require" text-red>*</span>
              </div>
              <input v-model="c.value" type="password" :name="c.label" class="vue-flow">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div mt-4 flex justify-center>
    <button btn @click="onConfirm">
      Confirm
    </button>
  </div>
</template>

<style lang="scss">
.basicflow.dark{background:#57534e;color:#fffffb}
.basicflow.dark .vue-flow__node{background:#292524;color:#fffffb}
.basicflow.dark .vue-flow__controls .vue-flow__controls-button{background:#292524;fill:#fffffb;border-color:#fffffb}
.basicflow.dark .vue-flow__edge-textbg{fill:#292524}.basicflow.dark .vue-flow__edge-text{fill:#fffffb}

.customnodeflow {
  .vue-flow__node-text-input,
  .vue-flow__node-preview-config,
  .vue-flow__node-select {
    border:1px solid #777;
    padding:10px;
    border-radius:4px;
    background: white;
    display:flex;
    flex-direction:column;
    gap:4px;
    width: 200px;

    &:hover {
      border-color: #292524;
      box-shadow:0 5px 10px #0000004d;
    }

    &.selected {
      border:1px solid transparent;
      box-shadow:0 5px 10px #0000004d;
      background: linear-gradient(90deg, #fff, #fff), linear-gradient(45deg, #54c8fa,#be1cfa, #54c8fa);
      background-origin: border-box;
      background-clip: padding-box,border-box;
    }
  }
}
.customnodeflow.dark {
  .vue-flow__node-text-input,
  .vue-flow__node-preview-config,
  .vue-flow__node-select {
    &.selected {
      border:1px solid transparent;
      box-shadow:0 5px 10px #0000004d;
      background: linear-gradient(90deg, #292524, #292524), linear-gradient(45deg, #54c8fa,#be1cfa, #54c8fa);
      background-origin: border-box;
      background-clip: padding-box,border-box;
    }
  }
}
.vue-flow__node-preview-config {
  width: 500px !important;
}
.bg-stripes-black {
  background-color: #f7f7fa;
  background-image: linear-gradient(135deg,#1b1c1c80 10%,#0000 0,#0000 50%,#1a1b1b80 0,#26292a80 60%,#0000 0,#0000);
  background-size: 7.07px 7.07px;
}
</style>
