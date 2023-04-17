<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  document.addEventListener('DOMContentLoaded', () => {
  const settingsForm = document.getElementById('settingsForm')
  const notionApiKeyInput = document.getElementById('notionApiKey') as HTMLInputElement
  const notionPageLinkInput = document.getElementById('notionPageLink') as HTMLInputElement

  // Load saved settings
  chrome.storage.sync.get(['notionApiKey', 'notionPageLink'], (result) => {
    notionApiKeyInput.value = result.notionApiKey || ''
    notionPageLinkInput.value = result.notionPageLink || ''
  })

  // Save settings
  settingsForm.addEventListener('submit', (event) => {
    event.preventDefault()

    const notionPageLink = notionPageLinkInput.value
    const notionDatabaseId = extractDatabaseIdFromPageLink(notionPageLink)

    chrome.storage.sync.set(
      {
        notionApiKey: notionApiKeyInput.value,
        notionDatabaseId,
        notionPageLink,
      },
      () => {
        alert('Settings saved!')
      },
    )
  })
})

function extractDatabaseIdFromPageLink(pageLink: string) {
  const regex = /([a-f0-9]{32})/
  const match = pageLink.match(regex)

  if (match)
    return match[0]

  return ''
}

})
</script>

<template>
  <div class="container">
    <h1>Settings</h1>
    <form id="settingsForm">
      <label for="notionApiKey">Notion API Key:</label>
      <input class="formInput" type="text" id="notionApiKey" name="notionApiKey">
      
      <label for="notionPageLink">Notion Page Link:</label>
      <input class="formInput" type="text" id="notionPageLink" name="notionPageLink">
      <div><a href="https://github.com/op7418/Prompt-hunter/blob/main/README.md" target="_blank">Notion及页面ID获取方式</a></div>
      <button class="formButton" type="submit">Save</button>
    </form>
  </div>
</template>

<style scoped>
  
</style>
