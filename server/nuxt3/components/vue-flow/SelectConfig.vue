<script setup lang="ts">
import { Handle } from '@vue-flow/core'
import type { BasicConfig, ModelsConfig } from '../../composables/config'

interface Props {
  data: BasicConfig<ModelsConfig>
  needHandler?: boolean
}
const props = defineProps<Props>()
const model = props.data
const info = model.info
const infoKeys = Object.keys(info)
const view = ref(false)
const options = infoKeys.map((m) => {
  return {
    value: m,
    label: info[m as keyof typeof info].displayName,
  }
})

const inputEl = ref<HTMLDivElement>()
const inputOffsetTop = ref(0)
const inputOffsetHeight = ref(0)
const inputHandleStyle = computed(() => {
  return {
    top: `${inputOffsetTop.value + inputOffsetHeight.value / 2}px`,
    bottom: 'auto',
  }
})
watch(inputEl, () => {
  nextTick(() => {
    inputOffsetTop.value = inputEl.value?.offsetTop || 0
    inputOffsetHeight.value = inputEl.value?.offsetHeight || 0
  })
})

const outputEl = ref<HTMLDivElement>()
const outputOffsetTop = ref(0)
const outputOffsetHeight = ref(0)
const outputHandleStyle = computed(() => {
  return {
    top: `${outputOffsetTop.value + outputOffsetHeight.value / 2}px`,
    bottom: 'auto',
  }
})
const inputType = computed(() => {
  return view.value ? 'text' : 'password'
})
watch(outputEl, () => {
  nextTick(() => {
    outputOffsetTop.value = outputEl.value?.offsetTop || 0
    outputOffsetHeight.value = outputEl.value?.offsetHeight || 0
  })
})

function updateHandler() {
  nextTick(() => {
    inputOffsetTop.value = inputEl.value?.offsetTop || 0
    inputOffsetHeight.value = inputEl.value?.offsetHeight || 0
    outputOffsetTop.value = outputEl.value?.offsetTop || 0
    outputOffsetHeight.value = outputEl.value?.offsetHeight || 0
  })
}

function onViewClick() {
  view.value = !view.value
}
</script>

<template>
  <div mb-1 flex flex-row items-center justify-between>
    <div flex flex-row items-center justify-start text-12px>
      <div :class="model.title.icon" text-1.2rem />
      <div ml-1 text-12px>
        {{ model.title.text }}
      </div>
    </div>
    <div flex items-center>
      <div text-0.8rem :class="[view ? 'uno-carbon-view-off' : 'uno-carbon-view']" icon-btn @click="onViewClick" />
    </div>
  </div>
  <div flex flex-col text-10px>
    <select ref="inputEl" v-model="model.select" :name="model.title.text" autocomplete="off" class="vue-flow" @change="updateHandler">
      <option v-for="o in options" :key="o.value" :value="o.value">
        {{ o.label }}
      </option>
    </select>
    <div v-for="c in info[model.select as keyof typeof info].config" :key="c.label">
      <div mt-2 text-gray>
        {{ c.label }} <span v-if="c.require" text-red>*</span>
      </div>
      <input v-model="c.value" :type="inputType" :name="c.label" class="vue-flow">
    </div>
  </div>
  <div v-if="needHandler">
    <div mt-2 flex items-center justify-end text-10px text-gray>
      <div ref="outputEl">
        {{ info[model.select as keyof typeof info].output }}
      </div>
    </div>
  </div>
  <div v-if="needHandler">
    <Handle
      v-for="h in model.handles"
      :id="h.id" :key="h.id" :type="h.type" :position="h.position"
      :style="h.id === 'input' ? inputHandleStyle : (h.id === 'output' ? outputHandleStyle : '')"
    />
  </div>
</template>

<style scoped>

</style>
