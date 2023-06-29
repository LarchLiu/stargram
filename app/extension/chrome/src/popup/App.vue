<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { iconGithub, iconLanguage, iconSetting, starSrc, version } from '~/const'
import type { ListenerResponse } from '~/types'
import SelectConfig from '~/components/SelectConfig.vue'

const { t, locale } = useI18n()
const saveStatus = ref('')
const showSettings = ref(false)
const showLanguage = ref(false)
const uiLangSelect = ref('en')
const userConfigInput = ref('')
const userConfig = ref()
const promptsLangSelect = ref('en')
const saveBtn = ref<HTMLDivElement>()
const saveBtnEnable = ref(true)
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
    console.log(userConfig.value)
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

function onSettingsClick() {
  showLanguage.value = false
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
  showLanguage.value = !showLanguage.value
  if (showLanguage.value) {
    chrome.storage.sync.get(['uiLang', 'promptsLang'], (result) => {
      uiLangSelect.value = result.uiLang || ''
      promptsLangSelect.value = result.promptsLang || ''
    })
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
  saveBtn.value?.classList.remove('star-animate')
  saveBtn.value?.classList.remove('bubbly-animate')
  saveBtn.value?.classList.add('star-animate')

  starTimer = setTimeout(() => {
    saveBtn.value?.classList.add('bubbly-animate')
    bubblyTimer = setTimeout(() => {
      saveBtnEnable.value = true
      saveBtn.value?.classList.remove('star-animate')
      saveBtn.value?.classList.remove('bubbly-animate')
    }, 900)
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
})
</script>

<template>
  <div w-240px>
    <div m-5 flex justify-center>
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
            <a href="https://github.com/LarchLiu/stargram" target="_blank">
              <img :src="iconGithub" height="18">
            </a>
          </div>
          <span text-gray>{{ `v${version}` }}</span>
        </div>
      </div>
    </footer>
    <div v-if="showSettings" flex flex-col bg-white p-2 text-14px>
      <div v-if="userConfig">
        <div v-for="(model, key) in userConfig" :key="model.select" class="basicflow customnodeflow">
          <div v-if="!model.public" class="vue-flow__node-select" mb-2>
            <SelectConfig :data="model" @update="(k: string, v: any) => userConfig[key].config[k] = v" />
          </div>
        </div>
      </div>
      <div v-else>
        <label for="userConfig">{{ t('settings.userConfig') }}</label>
        <input id="userConfig" v-model="userConfigInput" class="my-2" type="text" name="notionApiKey">
      </div>
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
            {{ t('settings.en') }}
          </option>
          <option value="zh-CN">
            {{ t('settings.zhCN') }}
          </option>
        </select>
      </div>
      <div mb-2 flex justify-between>
        <label class="inline-block h-5">{{ t('settings.promptsLanguage') }}</label>
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
  </div>
</template>

<style lang="scss" scoped>
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
  &.star-animate {
    img {
      animation: star-emit 1.8s;
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
  10% {
    transform: translate(0px)
  }
  20% {
    transform: translate(5px, -5px)
  }
  35% {
    transform: translate(0px)
  }
  50% {
    transform: translate(100px, -100px)
  }
  99% {
    transform: translate(90px, -90px)
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
      box-shadow:0 5px 10px #0000004d;
    }

    &.selected {
      border:1px solid transparent;
      box-shadow:0 5px 10px #0000004d;
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
