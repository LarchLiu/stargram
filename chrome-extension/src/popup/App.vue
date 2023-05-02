<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { iconGithub, iconLanguage, iconSetting, starSrc, version } from '~/const'
import type { ListenerResponse } from '~/types'

const { t, locale } = useI18n()
const notionApiKeyInput = ref('')
const notionPageLinkInput = ref('')
const openaiApiKeyInput = ref('')
const pictureBedInput = ref('')
const webHubInput = ref('')
const saveStatus = ref('')
const showSettings = ref(false)
const showLanguage = ref(false)
const uiLangSelect = ref('en')
const promptsLangSelect = ref('en')

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
      pictureBed: pictureBedInput.value,
      webHub: webHubInput.value,
      notionDatabaseId,
      notionPageLink,
    },
    () => {
      showSettings.value = false
    },
  )
}

function onSettingsClick() {
  showLanguage.value = false
  showSettings.value = !showSettings.value
  if (showSettings.value) {
    chrome.storage.sync.get(['notionApiKey', 'notionPageLink', 'openaiApiKey', 'pictureBed', 'webHub'], (result) => {
      notionApiKeyInput.value = result.notionApiKey || ''
      notionPageLinkInput.value = result.notionPageLink || ''
      openaiApiKeyInput.value = result.openaiApiKey || ''
      pictureBedInput.value = result.pictureBed || ''
      webHubInput.value = result.webHub || ''
    })
  }
}
function onLanguageClick() {
  showSettings.value = false
  showLanguage.value = !showLanguage.value
  if (showLanguage.value) {
    chrome.storage.sync.get(['uiLang', 'promptsLang'], (result) => {
      uiLangSelect.value = result.uiLang || ''
      promptsLangSelect.value = result.promptsLang || ''
    })
  }
}

watch(uiLangSelect, (n, _) => {
  locale.value = n
  chrome.storage.sync.set(
    {
      uiLang: n,
    },
  )
})

watch(promptsLangSelect, (n, _) => {
  chrome.storage.sync.set(
    {
      promptsLang: n,
    },
  )
})

onMounted(() => {
  chrome.storage.sync.get(['notionApiKey', 'notionPageLink', 'openaiApiKey', 'pictureBed', 'webHub', 'uiLang', 'promptsLang'], (result) => {
    notionApiKeyInput.value = result.notionApiKey || ''
    notionPageLinkInput.value = result.notionPageLink || ''
    openaiApiKeyInput.value = result.openaiApiKey || ''
    pictureBedInput.value = result.pictureBed || ''
    webHubInput.value = result.webHub || ''
    uiLangSelect.value = result.uiLang || 'en'
    promptsLangSelect.value = result.promptsLang || 'en'
    locale.value = uiLangSelect.value
  })
})
</script>

<template>
  <div w-240px>
    <div m-5 flex justify-center>
      <div target="_blank" class="gh-btn gh-btn-sm inline-flex items-center" @click="onSaveClick">
        <img :src="starSrc" height="18"><span ml-2>StarNexus</span>
      </div>
    </div>
    <footer class="mt-2 flex flex-col bg-[#f0f0f0] p-2 text-12px">
      <div flex items-center justify-between>
        <div flex>
          <div class="setting" cursor-pointer @click="onSettingsClick">
            <img :src="iconSetting" height="18">
          </div>
          <div class="language" ml-2 cursor-pointer @click="onLanguageClick">
            <img :src="iconLanguage" height="18">
          </div>
        </div>
        <div flex items-center>
          <div class="github" mx-2 cursor-pointer>
            <a href="https://github.com/LarchLiu/star-nexus" target="_blank">
              <img :src="iconGithub" height="18">
            </a>
          </div>
          <span text-gray>{{ `v${version}` }}</span>
        </div>
      </div>
    </footer>
    <div v-if="showSettings" flex flex-col bg-white p-2 text-14px>
      <label for="notionApiKey">{{ t('settings.notionApiKey') }}</label>
      <input id="notionApiKey" v-model="notionApiKeyInput" class="my-2" type="text" name="notionApiKey">

      <label for="notionPageLink">{{ t('settings.notionPageLink') }}</label>
      <input id="notionPageLink" v-model="notionPageLinkInput" class="my-2" type="text" name="notionPageLink">

      <label for="openaiApiKey">{{ t('settings.openaiApiKey') }}</label>
      <input id="openaiApiKey" v-model="openaiApiKeyInput" class="my-2" type="text" name="notionPageLink">

      <label for="pictureBed">{{ t('settings.pictureBed') }}</label>
      <input id="pictureBed" v-model="pictureBedInput" class="my-2" type="text" name="notionPageLink">

      <label for="webHub">{{ t('settings.starNexusHub') }}</label>
      <input id="webHub" v-model="webHubInput" class="my-2" type="text" name="notionPageLink">

      <button class="gh-btn mt-2" type="submit" @click="saveSettings">
        {{ t('settings.saveSettings') }}
      </button>
    </div>
    <div v-if="showLanguage" bg-white p-2 text-14px>
      <div>{{ t('settings.languageSettings') }}</div>
      <div class="divider" />
      <div my-2 flex justify-between>
        <label class="inline-block h-5">{{ t('settings.uiLanguage') }}</label>
        <select v-model="uiLangSelect" autocomplete="off" class="min-select" style="max-width: 128px;">
          <option value="en">
            English
          </option>
          <option value="zh-CN">
            简体中文
          </option>
        </select>
      </div>
      <div mb-2 flex justify-between>
        <label class="inline-block h-5">{{ t('settings.promptsLanguage') }}</label>
        <select v-model="promptsLangSelect" autocomplete="off" class="min-select" style="max-width: 128px;">
          <option value="en">
            English
          </option>
          <option value="zh-CN">
            简体中文
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<style scoped>
.gh-btn {
  color: var(--color-btn-text);
  background-color: var(--color-btn-bg);
  border-color: var(--color-btn-border) !important;
  box-shadow: var(--color-btn-shadow),var(--color-btn-inset-shadow);
  transition: 80ms cubic-bezier(0.33, 1, 0.68, 1);
  transition-property: color,background-color,box-shadow,border-color;
}
.gh-btn:hover {
  background-color: var(---color-btn-hover-bg);
  border-color: var(--color-btn-hover-border) !important;
}
.gh-btn:hover img {
  animation: twink 0.75s 0.5s;
}
.setting:hover img {
  animation: spin 0.5s 0.5s;
}
.github:hover img,
.language:hover img {
  animation: ping 0.5s 0.5s;
}
.gh-btn-sm {
  padding: 3px 12px;
  font-size: 12px;
  line-height: 20px;
}
.gh-btn {
  padding: 5px 16px;
  font-size: 14px;
  font-weight: var(--base-text-weight-medium, 500);
  line-height: 20px;
  border: 1px solid;
  border-radius: 6px;
  white-space: nowrap;
  vertical-align: middle;
  cursor: pointer;
  -webkit-user-select: none;
  user-select: none;
  -webkit-appearance: none;
  appearance: none;
}
input {
  border-width: 1px;
  font-size: 14px;
  height: 20px;
}
label {
  color: #838892;
}
select.min-select {
  margin-bottom: 0;
  max-width: 128px;
  font-size: 14px;
  border: none;
  padding: 0;
  padding-right: 2px;
  background-position: center right 0;
  background-size: 16px auto;
  text-overflow: ellipsis;
  text-align: right;
}
.divider {
  border-top: 1px solid #b0b9c4;
  margin-top: 8px;
}
@keyframes twink {
  0% {
    transform: translate(0px)
  }
  25% {
    transform: translate(5px)
  }
  50% {
    transform: translate(-5px)
  }
  75% {
    transform: translate(5px)
  }
  10% {
    transform: translate(0px)
  }
}
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(180deg) scale(1.2);
  }
}
@keyframes ping {
  100% {
    transform: scale(1.2);
  }
}
</style>
