<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { ListenerResponse } from '~/types'

const { t } = useI18n()
const saveButton = ref()
const saveStatus = ref('')

async function onSaveClick() {
  await new Promise(resolve => setTimeout(resolve, 100))

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'saveToNotion' }, (response: ListenerResponse) => {
      if (chrome.runtime.lastError) {
        saveStatus.value = `${t('popup.error')}: ${chrome.runtime.lastError.message}`
      }
      else {
        if (response && response.error)
          saveStatus.value = `${t('popup.error')}: ${response.message}`
      }
    })
  })
}
</script>

<template>
  <div m-5 w-240px>
    <button id="saveButton" ref="saveButton" class="btn" @click="onSaveClick">
      {{ t('popup.save') }}
    </button>
    <div mt-4>
      <a href="../settings/index.html" target="_blank">{{ t('settings.title') }}</a>
    </div>
    <p id="status">
      {{ saveStatus }}
    </p>
  </div>
</template>

<style scoped>

</style>
