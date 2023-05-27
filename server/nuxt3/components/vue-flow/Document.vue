<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core'

const doc = ref('webHub')
const starNexusHub = ref('')
const inputEl = ref<HTMLDivElement>()
const inputOffsetTop = ref(0)
const inputOffsetHeight = ref(0)
const inputHandleStyle = computed(() => {
  return {
    top: `${inputOffsetTop.value + inputOffsetHeight.value / 2}px`,
    bottom: 'auto',
  }
})
watch([doc, inputEl], () => {
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
watch([doc, outputEl], () => {
  nextTick(() => {
    outputOffsetTop.value = outputEl.value?.offsetTop || 0
    outputOffsetHeight.value = outputEl.value?.offsetHeight || 0
  })
})
</script>

<template>
  <Handle id="input" type="target" :position="Position.Left" :style="inputHandleStyle" />
  <div flex flex-col text-10px>
    <select ref="inputEl" v-model="doc" autocomplete="off" class="vue-flow">
      <option value="" disabled>
        Please Select
      </option>
      <option value="webHub">
        Website Info
      </option>
    </select>
    <div v-show="doc === 'webHub'">
      <div mt-2 text-gray>
        StarNexus Hub
      </div>
      <input id="apiToken" v-model="starNexusHub" class="vue-flow" type="password">
    </div>
  </div>
  <div mt-2 flex items-center justify-end text-gray>
    <div ref="outputEl">
      {{ doc === 'webHub' ? 'Website Info' : 'Text' }}
    </div>
    <Handle id="output" type="source" :position="Position.Right" :style="outputHandleStyle" />
  </div>
</template>

<style scoped>

</style>
