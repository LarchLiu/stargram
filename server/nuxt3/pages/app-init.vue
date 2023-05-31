<script setup lang="ts">
import { Cryption, errorMessage } from '@starnexus/core/utils'
import { C1, C2 } from '../constants/index'
import type { KVConfig, ServerConfig } from '../composables/config'

const cryption = new Cryption(C1, C2)
const text = ref('')
const userId = ref('')
const config = ref()
const showUserIdInput = ref(false)
async function onInitClick() {
  const decode = cryption.decode(text.value)
  if (decode.includes('app') && decode.includes('dataStorage')) {
    config.value = JSON.parse(decode) as ServerConfig<KVConfig>
    const appName = Object.keys(config.value.app)[0]
    const { error } = await useFetch(`/api/${appName}/init`, {
      method: 'POST',
      body: {
        botToken: config.value.app[appName].botToken,
        botName: config.value.app[appName].botName,
      },
    })
    if (!error.value) {
      if (appName === 'telegram')
        showUserIdInput.value = true
    }
    else {
      alert(errorMessage(error.value))
    }
  }
}
async function onAddUser() {
  if (config.value) {
    const appName = Object.keys(config.value.app)[0]
    const { error } = await useFetch(`/api/${appName}/adduser`, {
      method: 'POST',
      body: {
        botToken: config.value.app[appName].botToken,
        userId: userId.value,
        userConfig: config.value,
      },
    })
    if (error)
      alert(error)
    else
      alert('success')
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
      <div v-if="showUserIdInput">
        <div>Add User ID</div>
        <input v-model="userId" class="vue-flow">
        <button btn @click="onAddUser">
          Add
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
