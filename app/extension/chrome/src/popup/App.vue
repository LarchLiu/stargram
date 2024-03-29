<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { iconGithub, iconLanguage, iconSetting, iconSync, iconPlay, iconStop, starSrc, version } from '~/const'
import type { ContentRequest, ListenerSendResponse, ListenerResponse } from '~/types'
import SelectConfig from '~/components/SelectConfig.vue'

const { t, locale } = useI18n()
const saveStatus = ref('')
const showSettings = ref(false)
const showLanguage = ref(false)
const showSync = ref(false)
const uiLangSelect = ref('en')
const userConfigInput = ref('')
const githubToken = ref('')
const githubUser = ref('')
const userConfig = ref()
const promptsLangSelect = ref('en')
const saveBtn = ref<HTMLDivElement>()
const saveBtnEnable = ref(true)
const stopSyncMarks = ref(false)
const stopSyncGithub = ref(false)
const marksCount = ref(0)
const marksIdx = ref(0)
const githubCount = ref(0)
const githubIdx = ref(0)
const syncMarksSuccessCount = ref(0)
const syncMarksFailCount = ref(0)
const syncGithubSuccessCount = ref(0)
const syncGithubFailCount = ref(0)
const syncMarksEnd = ref(false)
const syncGithubEnd = ref(false)
const fetchGithubStarredEnd = ref(true)
const showGithubSetting = ref(false)
const showGithubError = ref(false)
let bookmarks: string[] = []
let starTimer: NodeJS.Timeout
let bubblyTimer: NodeJS.Timeout
const colorPreset = [
  '#264653', '#2a9d8f', '#e9c46a', '#f4a261', '#e76f51',
  '#ffbe0b', '#fb5607', '#ff006e', '#8338ec', '#3a86ff',
  '#ef476f', '#ffd166', '#06d6a0', '#118ab2', '#073b4c',
  '#5f0f40', '#9a031e', '#fb8b24', '#e36414', '#0f4c5c',
]
const randomColor1 = ref('#ff0000')
const randomColor2 = ref('#ff0000')
const randomColor3 = ref('#ff0000')
const randomColor4 = ref('#ff0000')
const randomColor5 = ref('#ff0000')

async function onSaveClick() {
  if (!saveBtnEnable.value)
    return

  animateButton()
  await new Promise(resolve => setTimeout(resolve, 100))

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length && tabs[0].id) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'saveToDB' }, (response: ListenerResponse) => {
        if (chrome.runtime.lastError) {
          saveStatus.value = `${t('popup.error')}: ${chrome.runtime.lastError.message}`
        }
        else {
          if (response && response.error)
            saveStatus.value = `${t('popup.error')}: ${response.message}`
        }
      })
    }
  })
}

function saveSettings() {
  if (userConfig.value) {
    chrome.storage.sync.set(
      {
        userConfig: JSON.stringify(userConfig.value)
      },
      () => {
        showSettings.value = false
      },
    )
  }
  else {
    chrome.storage.sync.set(
      {
        userConfig: userConfigInput.value
      },
      () => {
        showSettings.value = false
      },
    )
  }
}

function clearSettings() {
  userConfigInput.value = ''
  userConfig.value = undefined
  chrome.storage.sync.set(
    {
      userConfig: ''
    },
  )
}

function onSettingsClick() {
  showLanguage.value = false
  showSync.value = false
  showSettings.value = !showSettings.value
  if (showSettings.value) {
    chrome.storage.sync.get(['userConfig'], (result) => {
      userConfigInput.value = result.userConfig || ''
      if (userConfigInput.value)
        userConfig.value = JSON.parse(userConfigInput.value)
    })
  }
}
function onLanguageClick() {
  showSettings.value = false
  showSync.value = false
  showLanguage.value = !showLanguage.value
  if (showLanguage.value) {
    chrome.storage.sync.get(['uiLang', 'promptsLang'], (result) => {
      uiLangSelect.value = result.uiLang || ''
      promptsLangSelect.value = result.promptsLang || ''
    })
  }
}

function onSyncClick() {
  showSettings.value = false
  showLanguage.value = false
  showSync.value = !showSync.value
  if (showSync.value) {
    chrome.storage.sync.get(['githubToken', 'githubUser'], (result) => {
      githubToken.value = result.githubToken || ''
      githubUser.value = result.githubUser || ''
    })
  }
}

function saveGithubToken() {
  chrome.storage.sync.set({ githubToken: githubToken.value})
}

function saveGithubUser() {
  chrome.storage.sync.set({ githubUser: githubUser.value})
}

function getBookmarks(tree: chrome.bookmarks.BookmarkTreeNode[]) {
  tree.map((item) => {
    if (item.children) {
      getBookmarks(item.children)
    }
    else {
      marksCount.value++
      bookmarks.push(item.url || '')
    }
  })
}

function sendSyncBookmarksState() {
  stopSyncMarks.value = !stopSyncMarks.value
  chrome.runtime.sendMessage(
    {
      action: 'syncBookmarksState',
      syncState: stopSyncMarks.value,
    },
  )
}

function sendSyncGithubState() {
  stopSyncGithub.value = !stopSyncGithub.value
  chrome.runtime.sendMessage(
    {
      action: 'syncGithubState',
      syncState: stopSyncGithub.value,
    },
  )
}

function onBookmarksSync() {
  chrome.bookmarks.getTree((bookmarkTreeNodes) => {
    const bookmarkTree = bookmarkTreeNodes[0].children ?? []
    marksCount.value = 0
    marksIdx.value = 0
    bookmarks = []
    getBookmarks(bookmarkTree)
    chrome.runtime.sendMessage(
      {
        action: 'syncBookmarks',
        syncData: bookmarks,
      },
    )
  })
}

async function onGithubSync() {
  if (githubToken.value) {
    showGithubError.value = false
    githubCount.value = 0
    githubIdx.value = 0
    fetchGithubStarredEnd.value = false
    chrome.runtime.sendMessage(
      {
        action: 'syncGithubStarred',
        fetchGithubData: {
          token: githubToken.value,
          user: githubUser.value,
        }
      },
    )
  }
  else {
    showGithubError.value = true
  }
}

function genRandomColor() {
  randomColor1.value = colorPreset[Math.floor(Math.random() * 20)]
  randomColor2.value = colorPreset[Math.floor(Math.random() * 20)]
  randomColor3.value = colorPreset[Math.floor(Math.random() * 20)]
  randomColor4.value = colorPreset[Math.floor(Math.random() * 20)]
  randomColor5.value = colorPreset[Math.floor(Math.random() * 20)]
}
function animateButton() {
  genRandomColor()
  if (starTimer)
    clearTimeout(starTimer)
  if (bubblyTimer)
    clearTimeout(bubblyTimer)

  saveBtnEnable.value = false
  saveBtn.value?.classList.remove('star-emit')
  saveBtn.value?.classList.remove('bubbly-animate')
  saveBtn.value?.classList.remove('star-wait')
  saveBtn.value?.classList.remove('star-back')
  saveBtn.value?.classList.add('star-emit')

  starTimer = setTimeout(() => {
    saveBtn.value?.classList.add('star-wait')
  }, 900)
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
  chrome.storage.sync.get(['uiLang', 'userConfig'], (result) => {
    userConfigInput.value = result.userConfig || ''
    uiLangSelect.value = result.uiLang || 'en'
    promptsLangSelect.value = result.promptsLang || 'en'
    locale.value = uiLangSelect.value
    if (userConfigInput.value)
      userConfig.value = JSON.parse(userConfigInput.value)
  })
  chrome.runtime.sendMessage({
    action: 'syncBookmarksStatus',
  })
  chrome.runtime.sendMessage({
    action: 'syncGithubStatus',
  })
  chrome.runtime.onMessage.addListener(async (request: ContentRequest, sender, sendResponse: ListenerSendResponse) => {
    const action = request.action
    if (action === 'savedStatusToPopup') {
      saveBtnEnable.value = true
      saveBtn.value?.classList.add('star-back')
      setTimeout(() => {
        if (request.data?.error) {
          saveBtnEnable.value = true
          saveBtn.value?.classList.remove('star-emit')
          saveBtn.value?.classList.remove('star-wait')
          saveBtn.value?.classList.remove('star-back')
        }
        else {
          saveBtn.value?.classList.add('bubbly-animate')
          bubblyTimer = setTimeout(() => {
            saveBtnEnable.value = true
            saveBtn.value?.classList.remove('star-emit')
            saveBtn.value?.classList.remove('star-wait')
            saveBtn.value?.classList.remove('star-back')
            saveBtn.value?.classList.remove('bubbly-animate')
          }, 800)
        }
      }, 800)
    }
    if (action === 'syncBookmarksStatus') {
      const status = request.syncStatus
      sendResponse({ message: 'ok' })
      if (status) {
        marksIdx.value = status.index
        marksCount.value = status.count
        stopSyncMarks.value = status.state
        syncMarksSuccessCount.value = status.successCount
        syncMarksFailCount.value = status.failCount
        syncMarksEnd.value = status.isEnd
      }
    }
    else if (action === 'syncGithubStatus') {
      const status = request.syncStatus
      sendResponse({ message: 'ok' })
      if (status) {
        githubIdx.value = status.index
        githubCount.value = status.count
        stopSyncGithub.value = status.state
        syncGithubSuccessCount.value = status.successCount
        syncGithubFailCount.value = status.failCount
        syncGithubEnd.value = status.isEnd
        fetchGithubStarredEnd.value = status.fetchEnd
      }
    }
  })
})
</script>

<template>
  <div class="scrollbar-none">
    <el-scrollbar max-height="600px">
      <div w-240px>
        <div p-5 flex justify-center>
          <button
            ref="saveBtn"
            :disabled="!saveBtnEnable"
            class="gh-btn gh-btn-sm inline-flex items-center disabled:cursor-not-allowed"
            @click="onSaveClick"
          >
            <img :src="starSrc" height="18"><span ml-2>Stargram</span>
          </button>
        </div>
        <footer class="mt-2 flex flex-col bg-[#f0f0f0] p-2 text-12px">
          <div flex items-center justify-between>
            <div flex items-center>
              <div class="setting" cursor-pointer @click="onSettingsClick">
                <img :src="iconSetting" height="18">
              </div>
              <div class="language" ml-2 cursor-pointer @click="onLanguageClick">
                <img :src="iconLanguage" height="18">
              </div>
              <div class="sync" ml-2 cursor-pointer @click="onSyncClick">
                <img :src="iconSync" height="20">
              </div>
            </div>
            <div flex items-center>
              <div class="github" mx-2 cursor-pointer>
                <a href="https://github.com/LarchLiu/stargram" target="_blank">
                  <img :src="iconGithub" height="18">
                </a>
              </div>
              <span text-gray>{{ `v${version}` }}</span>
            </div>
          </div>
        </footer>
        <div v-if="showSettings" flex flex-col bg-white p-2 text-14px>
          <div>{{ t('settings.userConfig') }}</div>
          <div class="divider mb-2" />
          <div v-if="userConfig">
            <div v-for="(model, key) in userConfig" :key="model.select" class="basicflow customnodeflow">
              <div v-if="!model.public" class="vue-flow__node-select" mb-2>
                <SelectConfig :data="model" @update="(k: string, v: any) => userConfig[key].config[k].value = v" />
              </div>
            </div>
          </div>
          <div v-else flex flex-col>
            <input id="userConfig" v-model="userConfigInput" placeholder="Copy from website" class="my-2" type="text" name="notionApiKey">
          </div>
          <button class="gh-btn mt-2" type="submit" @click="saveSettings">
            {{ t('settings.saveSettings') }}
          </button>
          <button class="gh-btn mt-2 bg-red! text-white!" type="submit" @click="clearSettings">
            {{ t('settings.clearSettings') }}
          </button>
        </div>
        <div v-if="showLanguage" bg-white p-2 text-14px>
          <div>{{ t('settings.languageSettings') }}</div>
          <div class="divider" />
          <div my-2 flex justify-between>
            <label class="inline-block h-5">{{ t('settings.uiLanguage') }}</label>
            <select v-model="uiLangSelect" autocomplete="off" class="min-select" style="max-width: 128px;">
              <option value="en">
                {{ t('settings.en') }}
              </option>
              <option value="zh-CN">
                {{ t('settings.zhCN') }}
              </option>
            </select>
          </div>
          <div mb-2 flex justify-between>
            <label class="inline-block h-5">{{ t('settings.summarizeLanguage') }}</label>
            <select v-model="promptsLangSelect" autocomplete="off" class="min-select" style="max-width: 128px;">
              <option value="en">
                {{ t('settings.en') }}
              </option>
              <option value="zh-CN">
                {{ t('settings.zhCN') }}
              </option>
              <option value="de">
                {{ t('settings.de') }}
              </option>
              <option value="es">
                {{ t('settings.es') }}
              </option>
              <option value="fr">
                {{ t('settings.fr') }}
              </option>
              <option value="kr">
                {{ t('settings.kr') }}
              </option>
              <option value="nl">
                {{ t('settings.nl') }}
              </option>
              <option value="it">
                {{ t('settings.it') }}
              </option>
              <option value="ja">
                {{ t('settings.ja') }}
              </option>
              <option value="pt">
                {{ t('settings.pt') }}
              </option>
              <option value="ru">
                {{ t('settings.ru') }}
              </option>
            </select>
          </div>
        </div>
        <div v-if="showSync" bg-white p-2 text-14px>
          <div>{{ t('settings.syncSettings') }}</div>
          <div class="divider" />
          <div my-2 flex justify-between items-center>
            <label class="inline-block h-5">{{ t('settings.syncBookmarks') }}</label>
            <div flex items-cente>
              <div v-if="marksIdx < marksCount" flex items-center>
                <div cursor-pointer @click="sendSyncBookmarksState()">
                  <img class="hover:bg-#E6E6E6 hover:border hover:rounded-full" :src="stopSyncMarks ? iconPlay : iconStop" height="16">
                </div>
              </div>
              <div ml-2 cursor-pointer @click="onBookmarksSync">
                <img class="hover:bg-#E6E6E6 hover:border hover:rounded-full" :src="iconSync" height="18">
              </div>
            </div>
          </div>
          <div v-if="marksIdx < marksCount || syncMarksEnd" flex items-center>
            <el-tooltip
              effect="dark"
              :content="`Total: ${marksCount} Success: ${syncMarksSuccessCount} Fail: ${syncMarksFailCount}`"
              placement="top"
            >
              <div w-full>
                <el-progress
                  :text-inside="true"
                  :stroke-width="16"
                  :percentage="marksIdx/marksCount*100"
                  color="black"
                >
                  <span>{{marksIdx}}</span>
                </el-progress>
              </div>
            </el-tooltip>
          </div>
          <div my-2 flex justify-between items-center>
            <div flex items-center>
              <label class="inline-block h-5" pr-2>{{ t('settings.syncGithub') }}</label>
              <div cursor-pointer @click="showGithubSetting = !showGithubSetting">
                <img class="hover:bg-#E6E6E6 hover:border hover:rounded-full" :src="iconSetting" height="14">
              </div>
            </div>
            <div flex items-center>
              <div v-if="fetchGithubStarredEnd && githubIdx < githubCount">
                <div cursor-pointer @click="sendSyncGithubState()">
                  <img class="hover:bg-#E6E6E6 hover:border hover:rounded-full" :src="stopSyncGithub ? iconPlay : iconStop" height="16">
                </div>
              </div>
              <div cursor-pointer @click="onGithubSync">
                <img class="hover:bg-#E6E6E6 hover:border hover:rounded-full" :src="iconSync" height="18">
              </div>
            </div>
          </div>
          <div v-if="!fetchGithubStarredEnd" flex items-center>
            <div w-full>
              <el-progress 
                :percentage="100"
                :indeterminate="true"
                color="black"
                :text-inside="true"
                :stroke-width="16"
              >
                <span></span>
              </el-progress>
            </div>
          </div>
          <div v-if="(githubIdx < githubCount || syncGithubEnd) && fetchGithubStarredEnd" flex items-center>
            <el-tooltip
              effect="dark"
              :content="`Total: ${githubCount} Success: ${syncGithubSuccessCount} Fail: ${syncGithubFailCount}`"
              placement="top"
            >
              <div w-full>
                <el-progress
                  :text-inside="true"
                  :stroke-width="16"
                  :percentage="githubIdx/githubCount*100"
                  color="black"
                >
                  <span>{{githubIdx}}</span>
                </el-progress>
              </div>
            </el-tooltip>
          </div>
          <div v-if="showGithubError && !githubToken">
            <span text-12px text-red>{{ t('settings.githubError') }}</span>
          </div>
          <div v-if="showGithubSetting">
            <div my-2 flex justify-between items-center>
              <label class="inline-block h-5" pr-2>Token <span text-red>*</span></label>
              <input v-model="githubToken" text-12px placeholder="Github Token" type="password" name="githubToken" @change="saveGithubToken">
            </div>
            <div my-2 flex justify-between items-center>
              <label class="inline-block h-5" pr-2>{{ t('settings.githubUser') }}</label>
              <input v-model="githubUser" text-12px :placeholder="t('settings.githubUserPlaceholder')" name="githubUser" @change="saveGithubUser">
            </div>
          </div>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<style lang="scss" scoped>
.scrollbar-none {
  scrollbar-width: none; /* firefox */
  -ms-overflow-style: none; /* IE 10+ */
  overflow-x: hidden;
  overflow-y: auto;
}
.gh-btn {
  position: relative;
  color: var(--color-btn-text);
  background-color: var(--color-btn-bg);
  border-color: var(--color-btn-border) !important;
  box-shadow: var(--color-btn-shadow),var(--color-btn-inset-shadow);
  transition: 80ms cubic-bezier(0.33, 1, 0.68, 1);
  transition-property: color,background-color,box-shadow,border-color;

  &:before, &:after{
    position: absolute;
    content: '';
    display: block;
    width: 140%;
    height: 100%;
    left: -20%;
    z-index: -1000;
    transition: all ease-in-out 0.5s;
    background-repeat: no-repeat;
  }

  &:before{
    display: none;
    top: -75%;
    background-image:
      radial-gradient(circle, v-bind(randomColor1) 20%, transparent 20%),
      radial-gradient(circle,  transparent 20%, v-bind(randomColor2) 20%, transparent 30%),
      radial-gradient(circle, v-bind(randomColor3) 20%, transparent 20%),
      radial-gradient(circle, v-bind(randomColor4) 20%, transparent 20%),
      radial-gradient(circle,  transparent 10%, v-bind(randomColor5) 15%, transparent 20%),
      radial-gradient(circle, v-bind(randomColor1) 20%, transparent 20%),
      radial-gradient(circle, v-bind(randomColor2) 20%, transparent 20%),
      radial-gradient(circle, v-bind(randomColor3) 20%, transparent 20%),
      radial-gradient(circle, v-bind(randomColor4) 20%, transparent 20%);
    background-size: 10% 10%, 20% 20%, 15% 15%, 20% 20%, 18% 18%, 10% 10%, 15% 15%, 10% 10%, 18% 18%;
    //background-position: 0% 80%, -5% 20%, 10% 40%, 20% 0%, 30% 30%, 22% 50%, 50% 50%, 65% 20%, 85% 30%;
  }

  &:after{
    display: none;
    bottom: -75%;
    background-image:
      radial-gradient(circle, v-bind(randomColor5) 20%, transparent 20%),
      radial-gradient(circle, v-bind(randomColor1) 20%, transparent 20%),
      radial-gradient(circle,  transparent 10%, v-bind(randomColor2) 15%, transparent 20%),
      radial-gradient(circle, v-bind(randomColor3) 20%, transparent 20%),
      radial-gradient(circle, v-bind(randomColor4) 20%, transparent 20%),
      radial-gradient(circle, v-bind(randomColor5) 20%, transparent 20%),
      radial-gradient(circle, v-bind(randomColor1) 20%, transparent 20%);
    background-size: 15% 15%, 20% 20%, 18% 18%, 20% 20%, 15% 15%, 10% 10%, 20% 20%;
    //background-position: 5% 90%, 10% 90%, 10% 90%, 15% 90%, 25% 90%, 25% 90%, 40% 90%, 55% 90%, 70% 90%;
  }

  &:hover {
    img {
      animation: twink 0.5s 0.25s;
    }
    background-color: var(--color-btn-hover-bg);
    border-color: var(--color-btn-hover-border) !important;
  }
  &:enabled:active {
    transform: scale(0.9);
  }
  &.star-emit {
    img {
      animation: star-emit 1s;
    }
  }
  &.star-wait {
    img {
      animation: star-wait 120s;
    }
  }
  &.star-back {
    img {
      animation: star-back 0.8s;
    }
  }
  &.bubbly-animate {
    &:before{
      display: block;
      animation: topBubbles ease-in-out 0.75s forwards;
    }
    &:after{
      display: block;
      animation: bottomBubbles ease-in-out 0.75s forwards;
    }
  }
}
.sync:hover img,
.setting:hover img {
  animation: spin 0.5s 0.5s;
}
.github:hover img,
.language:hover img {
  animation: ping 0.5s 0.5s;
}
.rotate {
  animation: rotate 0.5s 0s infinite
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
  border-radius: 4px;
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
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes twink {
  0% {
    transform: translate(-5px)
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
  100% {
    transform: translate(0px)
  }
}
@keyframes star-emit {
  0% {
    transform: translate(3px, -3px)
  }
  20% {
    transform: translate(0px)
  }
  40% {
    transform: translate(5px, -5px)
  }
  70% {
    transform: translate(0px)
  }
  100% {
    transform: translate(100px, -100px)
  }
}
@keyframes star-wait {
  0% {
    transform: translate(100px, -100px)
  }
  100% {
    transform: translate(200px, -200px)
  }
}
@keyframes star-back {
  0% {
    transform: translate(-90px, 90px)
  }
  100% {
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
@keyframes topBubbles {
  0%{
    background-position: 5% 90%, 10% 90%, 10% 90%, 15% 90%, 25% 90%, 25% 90%, 40% 90%, 55% 90%, 70% 90%;
  }
  50% {
    background-position: 0% 80%, 0% 20%, 10% 40%, 20% 0%, 30% 30%, 22% 50%, 50% 50%, 65% 20%, 90% 30%;}
  100% {
    background-position: 0% 70%, 0% 10%, 10% 30%, 20% -10%, 30% 20%, 22% 40%, 50% 40%, 65% 10%, 90% 20%;
    background-size: 0% 0%, 0% 0%,  0% 0%,  0% 0%,  0% 0%,  0% 0%;
  }
}

@keyframes bottomBubbles {
  0%{
    background-position: 10% -10%, 30% 10%, 55% -10%, 70% -10%, 85% -10%, 70% -10%, 70% 0%;
  }
  50% {
    background-position: 0% 80%, 20% 80%, 45% 60%, 60% 100%, 75% 70%, 95% 60%, 105% 0%;}
  100% {
    background-position: 0% 90%, 20% 90%, 45% 70%, 60% 110%, 75% 80%, 95% 70%, 110% 10%;
    background-size: 0% 0%, 0% 0%,  0% 0%,  0% 0%,  0% 0%,  0% 0%;
  }
}

.customnodeflow {
  .vue-flow__node-select {
    border:1px solid #777;
    padding:10px;
    border-radius:4px;
    background: white;
    display:flex;
    flex-direction:column;
    gap:4px;

    &:hover {
      border-color: #292524;
      box-shadow:0 2px 3px #0000004d;
    }

    &.selected {
      border:1px solid transparent;
      box-shadow:0 2px 3px #0000004d;
      background: linear-gradient(90deg, #fff, #fff), linear-gradient(45deg, #54c8fa,#be1cfa, #54c8fa);
      background-origin: border-box;
      background-clip: padding-box,border-box;
    }
  }
}
.customnodeflow.dark {
  .vue-flow__node-select {
    &.selected {
      border:1px solid transparent;
      box-shadow:0 5px 10px #0000004d;
      background: linear-gradient(90deg, #292524, #292524), linear-gradient(45deg, #54c8fa,#be1cfa, #54c8fa);
      background-origin: border-box;
      background-clip: padding-box,border-box;
    }
  }
}
</style>
