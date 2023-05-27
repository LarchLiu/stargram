<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core'

const storage = ref('supabase-img')
const supabaseUrl = ref('')
const anonKey = ref('')
const defaultImg = ref('')
const storageBucket = ref('')
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
      <option value="supabase-img">
        Supabase Storage
      </option>
      <option value="cloudflare-img">
        Cloudflare Storage
      </option>
    </select>
    <div v-show="storage === 'supabase-img'">
      <div mt-2 text-gray>
        Supabase URL <span text-red>*</span>
      </div>
      <input id="supabase-img" v-model="supabaseUrl" class="vue-flow" type="password">
      <div mt-1 text-gray>
        Storage Bucket <span text-red>*</span>
      </div>
      <input id="kvToken" v-model="storageBucket" class="vue-flow" type="password">
      <div mt-1 text-gray>
        Anon Key <span text-red>*</span>
      </div>
      <input id="kvToken" v-model="anonKey" class="vue-flow" type="password">
      <div mt-1 text-gray>
        Default Image <span text-red>*</span>
      </div>
      <input id="kvToken" v-model="defaultImg" class="vue-flow" type="password">
    </div>
    <div v-show="storage === 'cloudflare-img'">
      <!-- <div mt-2 text-gray>
        WEBHOOK URL <span text-red>*</span>
      </div>
      <input id="webhook" v-model="botToken" class="vue-flow" type="password"> -->
    </div>
  </div>
  <div mt-2 flex items-center justify-end text-gray>
    <div ref="outputEl">
      Image Url
    </div>
    <Handle id="output" type="source" :position="Position.Right" :style="outputHandleStyle" />
  </div>
</template>

<style scoped>

</style>
