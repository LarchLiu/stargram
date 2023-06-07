<script setup lang="ts">
import { Handle } from '@vue-flow/core'
import type { BasicConfig, ModelsConfig } from '../../composables/config'

interface Props {
  data: BasicConfig<ModelsConfig>
}
const props = defineProps<Props>()
const model = props.data
const info = model.info
const infoKeys = Object.keys(info)
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
</script>

<template>
  <div mb-1 flex flex-row items-center justify-start text-12px>
    <div :class="model.title.icon" />
    <dev ml-1 text-12px>
      {{ model.title.text }}
    </dev>
  </div>
  <div flex flex-col text-10px>
    <select ref="inputEl" v-model="model.select" autocomplete="off" class="vue-flow" @change="updateHandler">
      <option value="" disabled>
        Please Select
      </option>
      <option v-for="o in options" :key="o.value" :value="o.value">
        {{ o.label }}
      </option>
    </select>
    <div v-for="c in info[model.select as keyof typeof info].config" :key="c.label">
      <div mt-2 text-gray>
        {{ c.label }} <span v-if="c.require" text-red>*</span>
      </div>
      <input v-model="c.value" class="vue-flow">
    </div>
  </div>
  <div mt-2 flex items-center justify-end text-10px text-gray>
    <div ref="outputEl">
      {{ info[model.select as keyof typeof info].output }}
    </div>
  </div>
  <Handle
    v-for="h in model.handles"
    :id="h.id" :key="h.id" :type="h.type" :position="h.position"
    :style="h.id === 'input' ? inputHandleStyle : (h.id === 'output' ? outputHandleStyle : '')"
  />
</template>

<style scoped>

</style>
