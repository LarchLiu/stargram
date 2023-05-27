<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core'

const storage = ref('notion-data')
const notionSecrect = ref('')
const databaseId = ref('')
const inputEl = ref<HTMLDivElement>()
const inputOffsetTop = ref(0)
const inputOffsetHeight = ref(0)
const inputHandleStyle = computed(() => {
  return {
    top: `${inputOffsetTop.value + inputOffsetHeight.value / 2}px`,
    bottom: 'auto',
  }
})
watch([storage, inputEl], () => {
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
watch([storage, outputEl], () => {
  nextTick(() => {
    outputOffsetTop.value = outputEl.value?.offsetTop || 0
    outputOffsetHeight.value = outputEl.value?.offsetHeight || 0
  })
})
</script>

<template>
  <Handle type="target" :position="Position.Left" :style="inputHandleStyle" />
  <div flex flex-col text-10px>
    <select ref="inputEl" v-model="storage" autocomplete="off" class="vue-flow">
      <option value="" disabled>
        Please Select
      </option>
      <option value="notion-data">
        Notion Storage
      </option>
      <option value="supabase-data">
        Supabase Storage
      </option>
      <option value="planetscale-data">
        Planetscale Storage
      </option>
    </select>
    <div v-show="storage === 'notion-data'">
      <div mt-2 text-gray>
        Notion Secret <span text-red>*</span>
      </div>
      <input v-model="notionSecrect" class="vue-flow" type="password">
      <div mt-1 text-gray>
        Database ID <span text-red>*</span>
      </div>
      <input v-model="databaseId" class="vue-flow" type="password">
    </div>
  </div>
  <div mt-2 flex items-center justify-end text-gray>
    <div ref="outputEl">
      Result
    </div>
    <Handle id="output" type="source" :position="Position.Right" :style="outputHandleStyle" />
  </div>
</template>

<style scoped>

</style>
