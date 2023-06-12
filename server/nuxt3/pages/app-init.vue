<script setup lang="ts">
import { errorMessage } from '@stargram/core/utils'
import { cryption } from '../constants/index'
import type { OutputConfig, ServerConfig } from '../composables/config'

const text = ref('')
const config = ref<ServerConfig<OutputConfig>>()
const showUserIdInput = ref(false)
async function onInitClick() {
  const decode = cryption.decode(text.value)
  if (decode.includes('app') && decode.includes('dataStorage')) {
    config.value = JSON.parse(decode)
    const appName = config.value?.app.select
    const { error } = await useFetch(`/api/${appName}/init`, {
      method: 'POST',
      body: text.value, // config.value.app[appName],
    })
    if (error.value)
      alert(errorMessage(error.value))
    else
      showUserIdInput.value = true
  }
  else {
    alert('Config code error')
  }
}
</script>

<template>
  <div flex justify-center>
    <div>
      <textarea v-model="text" class="vue-flow" cols="120" rows="10" />
      <button btn @click="onInitClick">
        Init
      </button>
      <div v-if="showUserIdInput" mt-4>
        <div>Setup your bot then send command <code>/start</code> to configure your custom settings.</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
