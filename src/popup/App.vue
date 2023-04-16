<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  document.getElementById('saveButton').addEventListener('click', async () => {
  // 延迟以确保 content script 已加载
    await new Promise(resolve => setTimeout(resolve, 100))

    // 向 content script 发送消息，请求保存操作
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'saveToNotion' }, (response) => {
        const statusElement = document.getElementById('status')
        if (chrome.runtime.lastError) {
          statusElement.textContent = `Error: ${chrome.runtime.lastError.message}`
        }
        else {
          if (response && response.error)
            statusElement.textContent = `Error: ${response.message}`
        }
      })
    })
  })

  chrome.runtime.onMessage.addListener(async (request: { action: string; data: { message: string; error: boolean } }, sender, sendResponse) => {
    if (request.action === 'saveToNotionFinish') {
      const statusElement = document.getElementById('status')
      // console.log(request)
      if (request.data && request.data.error)
        statusElement.textContent = `Error: ${request.data.message}`
      else
        statusElement.textContent = '成功保存至 Notion'

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
  <p>点击 "保存到 Notion"按钮来保存当前页的内容到你的Notion页面。</p>
  <button id="saveButton">
    保存到 Notion
  </button>
  <p>首次使用需要去下面设置页面填写NotionAPI和Notion页面地址</p>
  <a href="../settings/index.html" target="_blank">设置页面</a>
  <p id="status" />
</template>

<style scoped>

</style>
