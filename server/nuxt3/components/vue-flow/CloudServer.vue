<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core'

const server = ref('netlify-edge')
const netlifyToken = ref('')
const vercelToken = ref('')
const clToken = ref('')
const inputEl = ref<HTMLDivElement>()
const inputOffsetTop = ref(0)
const inputOffsetHeight = ref(0)
const inputHandleStyle = computed(() => {
  return {
    top: `${inputOffsetTop.value + inputOffsetHeight.value / 2}px`,
    bottom: 'auto',
  }
})
watch([server, inputEl], () => {
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
watch([server, outputEl], () => {
  nextTick(() => {
    outputOffsetTop.value = outputEl.value?.offsetTop || 0
    outputOffsetHeight.value = outputEl.value?.offsetHeight || 0
  })
})
</script>

<template>
  <Handle type="target" :position="Position.Left" :style="inputHandleStyle" />
  <div flex flex-col text-10px>
    <select ref="inputEl" v-model="server" autocomplete="off" class="vue-flow">
      <option value="" disabled>
        Please Select
      </option>
      <option value="vercel">
        Vercel Severless
      </option>
      <option value="netlify-edge">
        Netlify Edge
      </option>
      <option value="cl-worker">
        Cloudflare Worker
      </option>
    </select>
    <div v-show="server === 'vercel'">
      <div mt-2 text-gray>
        Vercel Token <span text-red>*</span>
      </div>
      <input v-model="vercelToken" class="vue-flow" type="password">
    </div>
    <div v-show="server === 'netlify-edge'">
      <div mt-2 text-gray>
        Netlify Token <span text-red>*</span>
      </div>
      <input v-model="netlifyToken" class="vue-flow" type="password">
    </div>
    <div v-show="server === 'cl-worker'">
      <div mt-2 text-gray>
        Cloudflare Token <span text-red>*</span>
      </div>
      <input v-model="clToken" class="vue-flow" type="password">
    </div>
  </div>
  <div mt-2 flex items-center justify-end text-gray>
    <div ref="outputEl">
      Server
    </div>
    <Handle id="output" type="source" :position="Position.Right" :style="outputHandleStyle" />
  </div>
</template>

<style scoped>

</style>
