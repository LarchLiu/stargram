<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core'

const kv = ref('vercel')
const kvUrl = ref('')
const kvToken = ref('')
const outputEl = ref<HTMLDivElement>()
const outputOffsetTop = ref(0)
const outputOffsetHeight = ref(0)
const outputHandleStyle = computed(() => {
  return {
    top: `${outputOffsetTop.value + outputOffsetHeight.value / 2}px`,
    bottom: 'auto',
  }
})
watch([kv, outputEl], () => {
  nextTick(() => {
    outputOffsetTop.value = outputEl.value?.offsetTop || 0
    outputOffsetHeight.value = outputEl.value?.offsetHeight || 0
  })
})
</script>

<template>
  <div flex flex-col text-10px>
    <select v-model="kv" autocomplete="off" class="vue-flow">
      <option value="" disabled>
        Please Select
      </option>
      <option value="vercel">
        Vercel KV
      </option>
      <option value="cloudflare">
        Cloudflare KV
      </option>
    </select>
    <div v-show="kv === 'vercel'">
      <div mt-2 text-gray>
        KV URL <span text-red>*</span>
      </div>
      <input id="kvUrl" v-model="kvUrl" class="vue-flow" type="password">
      <div mt-1 text-gray>
        API Token <span text-red>*</span>
      </div>
      <input id="kvToken" v-model="kvToken" class="vue-flow" type="password">
    </div>
  </div>
  <div mt-2 flex items-center justify-end text-gray>
    <div ref="outputEl">
      Env Vars
    </div>
    <Handle id="output" type="source" :position="Position.Right" :style="outputHandleStyle" />
  </div>
</template>

<style scoped>

</style>
