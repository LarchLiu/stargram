<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const notionApiKeyInput = ref('')
const notionPageLinkInput = ref('')
const openaiApiKeyInput = ref('')
const stargramHubInput = ref('')
const browserlessTokenInput = ref('')

function extractDatabaseIdFromPageLink(pageLink: string) {
  const regex = /([a-f0-9]{32})/
  const match = pageLink.match(regex)

  if (match)
    return match[0]

  return ''
}

function saveSettings() {
  const notionPageLink = notionPageLinkInput.value
  const notionDatabaseId = extractDatabaseIdFromPageLink(notionPageLink)

  chrome.storage.sync.set(
    {
      notionApiKey: notionApiKeyInput.value,
      openaiApiKey: openaiApiKeyInput.value,
      stargramHub: stargramHubInput.value,
      browserlessToken: browserlessTokenInput.value,
      notionDatabaseId,
      notionPageLink,
    },
  )
}
onMounted(() => {
  chrome.storage.sync.get(['notionApiKey', 'notionPageLink', 'openaiApiKey', 'stargramHub', 'browserlessToken'], (result) => {
    notionApiKeyInput.value = result.notionApiKey || ''
    notionPageLinkInput.value = result.notionPageLink || ''
    openaiApiKeyInput.value = result.openaiApiKey || ''
    stargramHubInput.value = result.stargramHub || ''
    browserlessTokenInput.value = result.browserlessToken || ''
  })
})
</script>

<template>
  <div flex justify-center text-16px>
    <div class="w-640px flex-col justify-center">
      <h1>{{ t('settings.title') }}</h1>
      <label for="notionApiKey">{{ t('settings.notionApiKey') }}</label>
      <input id="notionApiKey" v-model="notionApiKeyInput" class="mb-6 mt-2 w-full" type="text" name="notionApiKey">

      <label for="notionPageLink">{{ t('settings.notionPageLink') }}</label>
      <input id="notionPageLink" v-model="notionPageLinkInput" class="mb-6 mt-2 w-full" type="text" name="notionPageLink">

      <label for="openaiApiKey">{{ t('settings.openaiApiKey') }}</label>
      <input id="openaiApiKey" v-model="openaiApiKeyInput" class="mb-6 mt-2 w-full" type="text" name="notionPageLink">

      <label for="browserlessToken">{{ t('settings.browserlessToken') }}</label>
      <input id="browserlessToken" v-model="browserlessTokenInput" class="mb-6 mt-2 w-full" type="text" name="browserlessToken">

      <label for="stargramHub">{{ t('settings.stargramHub') }}</label>
      <input id="stargramHub" v-model="stargramHubInput" class="mt-2 w-full" type="text" name="notionPageLink">

      <button class="mt-6 btn" type="submit" @click="saveSettings">
        {{ t('settings.saveSettings') }}
      </button>
    </div>
  </div>
</template>

<style scoped>

</style>
