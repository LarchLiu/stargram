<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core'

const store = useConfigStore()
const { copy, copied, isSupported } = useClipboard()
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
</script>

<template>
  <div flex flex-col text-10px>
    <pre max-h-100 style="overflow: scroll; border:1px solid #b1aeae; border-radius: 4px;">
      <code>{{ `\n${JSON.stringify(store.outUserConfig, null, 2)}` }}</code>
    </pre>
    <pre mt-2 max-h-50 style="overflow: scroll; border:1px solid #b1aeae; border-radius: 4px;">
      <code>{{ `\n${store.encodeUserConfig}` }}</code>
    </pre>
    <button v-if="isSupported" @click="copy(store.encodeUserConfig)">
      <span v-if="!copied">Copy</span>
      <span v-else>Copied!</span>
    </button>
  </div>
  <div mt-2 flex items-center justify-end text-gray>
    <div ref="outputEl">
      Config
    </div>
    <Handle id="output" type="source" :position="Position.Right" :style="outputHandleStyle" />
  </div>
</template>

<style scoped>
</style>
