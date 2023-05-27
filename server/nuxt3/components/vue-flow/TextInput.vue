<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core'

const text = ref('')
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
    <textarea class="vue-flow" name="Text1" cols="40" rows="3" />
  </div>
  <div mt-2 flex items-center justify-end text-gray>
    <div ref="outputEl">
      Text
    </div>
    <Handle id="output" type="source" :position="Position.Right" :style="outputHandleStyle" />
  </div>
</template>

<style scoped>
</style>
