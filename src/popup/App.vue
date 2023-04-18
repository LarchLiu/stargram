<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { SendResponse } from '~/types'

const { t } = useI18n()
const saveButton = ref()
const saveStatus = ref('')

async function onSaveClick() {
  await new Promise(resolve => setTimeout(resolve, 100))

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'saveToNotion' }, (response: SendResponse) => {
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

onMounted(() => {
  chrome.runtime.sendMessage({ action: 'popupViewOpen' })
  chrome.runtime.onMessage.addListener(async (request: { action: string; data: { message: string; error: boolean } }, sender, sendResponse) => {
    if (request.action === 'savedStatusToPopup') {
      if (request.data && request.data.error)
        saveStatus.value = `${t('popup.error')}: ${request.data.message}`
      else
        saveStatus.value = t('popup.savedToNotion')

      setTimeout(() => {
        saveStatus.value = ''
      }, 3000)
    }
    sendResponse({ message: 'ok' })
    return true
  })
})
onMounted(() => {
  chrome.runtime.sendMessage({ action: 'popupViewClose' })
})
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
