<script setup lang="ts">
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

onMounted(() => {
  document.getElementById('saveButton').addEventListener('click', async () => {
  // 延迟以确保 content script 已加载
    await new Promise(resolve => setTimeout(resolve, 100))

    // 向 content script 发送消息，请求保存操作
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'saveToNotion' }, (response) => {
        const statusElement = document.getElementById('status')
        if (chrome.runtime.lastError) {
          statusElement.textContent = `${t('popup.error')}: ${chrome.runtime.lastError.message}`
        }
        else {
          if (response && response.error)
            statusElement.textContent = `${t('popup.error')}: ${response.message}`
        }
      })
    })
  })

  chrome.runtime.onMessage.addListener(async (request: { action: string; data: { message: string; error: boolean } }, sender, sendResponse) => {
    if (request.action === 'saveToNotionFinish') {
      const statusElement = document.getElementById('status')
      // console.log(request)
      if (request.data && request.data.error)
        statusElement.textContent = `${t('popup.error')}: ${request.data.message}`
      else
        statusElement.textContent = t('popup.savedToNotion')

      setTimeout(() => {
        statusElement.textContent = ''
      }, 3000)
    }
    sendResponse('ok')
    return true
  })
})
</script>

<template>
  <div m-5 w-240px>
    <button id="saveButton" class="btn">
      {{ t('popup.save') }}
    </button>
    <div mt-4>
      <a href="../settings/index.html" target="_blank">{{ t('settings.title') }}</a>
    </div>
    <p id="status" />
  </div>
</template>

<style scoped>

</style>
