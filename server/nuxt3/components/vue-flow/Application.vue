<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core'

const app = ref('tg-bot')
const botToken = ref('')
const inputEl = ref<HTMLDivElement>()
const inputOffsetTop = ref(0)
const inputOffsetHeight = ref(0)
const inputHandleStyle = computed(() => {
  return {
    top: `${inputOffsetTop.value + inputOffsetHeight.value / 2}px`,
    bottom: 'auto',
  }
})
watch([app, inputEl], () => {
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
watch([app, outputEl], () => {
  nextTick(() => {
    outputOffsetTop.value = outputEl.value?.offsetTop || 0
    outputOffsetHeight.value = outputEl.value?.offsetHeight || 0
  })
})
</script>

<template>
  <Handle id="input" type="target" :position="Position.Left" :style="inputHandleStyle" />
  <div flex flex-col text-10px>
    <select ref="inputEl" v-model="app" autocomplete="off" class="vue-flow">
      <option value="" disabled>
        Please Select
      </option>
      <option value="tg-bot">
        Telegram Bot
      </option>
      <option value="slack-bot">
        Slack Bot
      </option>
    </select>
    <div v-show="app === 'tg-bot'">
      <div mt-2 text-gray>
        Bot Token <span text-red>*</span>
      </div>
      <input id="botToken" v-model="botToken" class="vue-flow" type="password">
    </div>
    <div v-show="app === 'slack-bot'">
      <div mt-2 text-gray>
        Webhook URL <span text-red>*</span>
      </div>
      <input id="webhook" v-model="botToken" class="vue-flow" type="password">
    </div>
  </div>
  <div mt-2 flex items-center justify-end text-gray>
    <div ref="outputEl">
      Text
    </div>
    <Handle id="output" type="source" :position="Position.Right" :style="outputHandleStyle" />
  </div>
  <Handle id="result" type="target" :position="Position.Bottom" />
</template>

<style scoped>

</style>
