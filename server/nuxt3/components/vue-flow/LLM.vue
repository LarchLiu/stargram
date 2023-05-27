<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core'

const llm = ref('openai')
const apiToken = ref('')
const inputEl = ref<HTMLDivElement>()
const inputOffsetTop = ref(0)
const inputOffsetHeight = ref(0)
const inputHandleStyle = computed(() => {
  return {
    top: `${inputOffsetTop.value + inputOffsetHeight.value / 2}px`,
    bottom: 'auto',
  }
})
watch([llm, inputEl], () => {
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
watch([llm, outputEl], () => {
  nextTick(() => {
    outputOffsetTop.value = outputEl.value?.offsetTop || 0
    outputOffsetHeight.value = outputEl.value?.offsetHeight || 0
  })
})
</script>

<template>
  <Handle id="input" type="target" :position="Position.Left" :style="inputHandleStyle" />
  <div flex flex-col text-10px>
    <select ref="inputEl" v-model="llm" autocomplete="off" class="vue-flow">
      <option value="" disabled>
        Please Select
      </option>
      <option value="openai">
        Openai
      </option>
    </select>
    <div v-show="llm === 'openai'">
      <div mt-2 text-gray>
        API TOKEN <span text-red>*</span>
      </div>
      <input id="apiToken" v-model="apiToken" class="vue-flow" type="password">
    </div>
  </div>
  <div mt-2 flex items-center justify-end text-gray>
    <div ref="outputEl">
      Summarize Content
    </div>
    <Handle id="output" type="source" :position="Position.Right" :style="outputHandleStyle" />
  </div>
</template>

<style scoped>

</style>
