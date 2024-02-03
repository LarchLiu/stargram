<!-- eslint-disable no-console -->
<script setup lang="ts">
import type { ReturnStorageData } from '@stargram/core/storage'
import { v4 as uuidv4 } from 'uuid'
import { errorMessage } from '@stargram/core/utils'

const textInput = ref<HTMLInputElement>()
const text = ref('')
const toast = useToast()

const cardWidth = 350
const cardHeight = 246
type LoadMoreStatus = 'idle' | 'loading' | 'no-more' | 'error'

const clientId = useLocalStorage('clientId', uuidv4())
const {
  shouldAskNotifications,
  askForNotificationPermission,
} = usePushManager(clientId)
const userId = useLocalStorage('userId', '')
const { width: windowWidth, height: windowHeight } = useWindowSize()
const pageSize = computed(() => {
  return Math.floor(windowWidth.value / cardWidth) * 10
})
const page = ref<string | number | undefined>()
const dataList = ref<ReturnStorageData[]>([])
const list = ref<HTMLDivElement>()
const loadMoreStatus = ref<LoadMoreStatus>('idle')
const selectedData = ref<ReturnStorageData>()
const modalOpen = ref(false)
async function getDataList() {
  loadMoreStatus.value = 'loading'

  const body = page.value
    ? {
        userId: userId.value,
        pageSize: pageSize.value,
        page: page.value,
      }
    : {
        userId: userId.value,
        pageSize: pageSize.value,
      }
  try {
    const data = await $fetch<{
      data: ReturnStorageData[]
      nextPage: string | number | undefined
    }>('/api/data-list', {
      method: 'POST',
      body,
    })
    if (data?.nextPage) {
      page.value = data.nextPage
      loadMoreStatus.value = 'idle'
    }
    else {
      page.value = undefined
      loadMoreStatus.value = 'no-more'
    }
    if (data?.data)
      dataList.value = dataList.value.concat(data.data)
  }
  catch (error) {
    loadMoreStatus.value = 'error'
  }
}

function onPageItemClick(data: ReturnStorageData) {
  selectedData.value = data
  modalOpen.value = true
}

useWebShareTarget(async ({ data: { data, action } }: any) => {
  if (action !== 'compose-with-shared-data')
    return

  textInput.value?.focus()

  text.value = (data.textParts.join('\n')) as string
})

function saveWebInfo(text: string) {
  const regex = /(http(s)?:\/\/)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+(:[0-9]{1,5})?[-a-zA-Z0-9()@:%_\\\+\.~#?&//=]*/g
  const matchs = text.match(regex)

  if (matchs) {
    let i = 0
    const uniqueUrls = new Set(matchs)
    const uniqueMatchs = [...uniqueUrls]
    while (i < uniqueMatchs.length) {
      let url = uniqueMatchs[i]
      if (!url.startsWith('http'))
        url = `https://${url}`

      $fetch('/api/save-web-info', {
        method: 'POST',
        body: {
          // context,
          url,
          // stargramHub,
          appName: 'stargram',
          // botId: context.SHARE_CONTEXT.currentBotId,
          userId: userId.value,
          clientId: clientId.value,
        },
      }).catch((err) => {
        toast.add({
          title: errorMessage(err),
          color: 'red',
          timeout: 5000,
          icon: 'i-carbon-warning',
        })
      })
      i += 1
    }
    toast.add({
      title: `Found ${i} Website. Saving...`,
      color: 'green',
      timeout: 2000,
      icon: 'i-carbon-checkmark-outline',
    })
  }
  else {
    toast.add({
      title: 'No Supported Website.',
      color: 'red',
      timeout: 5000,
      icon: 'i-carbon-warning',
    })
  }
}

useEventListener('scroll', async (evt) => {
  if (userId.value && loadMoreStatus.value === 'idle' && list.value && list.value.getBoundingClientRect().bottom < (windowHeight.value + cardHeight * 2))
    await getDataList()
})

onMounted(async () => {
  if (userId.value)
    await getDataList()
})
</script>

<template>
  <div flex justify-center>
    <ClientOnly>
      <div flex flex-col items-center justify-center>
        <div sticky top-0 z10 backdrop-blur class="w-100vw lg:w-[calc(100vw-4rem)]">
          <div flex justify-between px5 py2 border="b base">
            <div w-full flex items-center gap-3 overflow-hidden sm:py2>
              <div w-full flex truncate text-6>
                <a href="/" class="router-link-active router-link-exact-active" timeline-title-style flex items-center gap-2 aria-current="page"><span>Stargram</span></a>
              </div>
              <div h-7 w-1px sm:hidden />
            </div>
            <div flex flex-shrink-0 items-center gap-x-2>
              <div class="v-popper v-popper--theme-dropdown">
                <NuxtLink to="/settings">
                  <div uno-carbon-settings h-6 w-6 />
                </NuxtLink>
              </div>
            </div>
          </div>
          <div hidden />
        </div>
        <div v-if="shouldAskNotifications">
          <button mt-2 btn @click="askForNotificationPermission">
            Enable Notifications
          </button>
        </div>
        <div v-if="!userId" mt-2>
          <NuxtLink to="/settings">
            <button btn>
              Settings
            </button>
          </NuxtLink>
        </div>
        <div ref="list" min-h-screen w-full flex flex-col items-center justify-center>
          <div min-h="[calc(100vh-3.5rem)]" flex flex-col items-center justify-center>
            <div my-4 flex flex-wrap justify-center gap-4 rounded lt-sm:flex-col class="lt-sm:w-9/10">
              <div v-for="item in dataList" :key="item.id" @click="onPageItemClick(item)">
                <div
                  border="1px solid #0f0f0f1a"
                  class="shadow-[0_2px_4px_#0f0f0f1a] lt-sm:w-full!"
                  :class="pageSize > 10 ? 'h-246px' : ''"
                  w-350px cursor-pointer rounded hover:bg-gray-100
                >
                  <div h-180px w-full flex justify-center>
                    <img :src="item.meta.ogImage" h-full w-full rounded-t-3px object-contain>
                  </div>
                  <div border-t p-2>
                    <div class="text-[#636161]" line-clamp-2>
                      {{ item.title }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="loadMoreStatus === 'loading'" mb-4>
              <div uno-eos-icons-bubble-loading />
            </div>
            <div v-else-if="loadMoreStatus === 'no-more'" mb-4>
              No more data
            </div>
            <div v-else-if="loadMoreStatus === 'error'">
              <button btn @click="getDataList">
                Reload
              </button>
            </div>
          </div>
          <div sticky bottom-0 z10 class="w-full bg-[#fafafa] lg:w-[calc(100vw-4rem)]">
            <div flex justify-between px5 py2 border="t base">
              <div w-full flex items-center gap-1 overflow-hidden sm:py2>
                <div w-full>
                  <input ref="textInput" v-model="text" class="vue-flow" h-8 w-full type="text">
                </div>
                <div h-7 w-1px sm:hidden />
              </div>
              <div flex flex-shrink-0 items-center gap-x-2 @click="saveWebInfo(text)">
                <div uno-carbon-send-alt h-6 w-6 btn />
              </div>
            </div>
            <div hidden />
          </div>
        </div>
      </div>
      <UModal v-model="modalOpen">
        <div flex flex-col gap-2 p-4>
          <div uno-carbon-close h-24px btn @click="modalOpen = false" />
          <img :src="selectedData?.meta.ogImage">
          <div text-28px font-bold>
            {{ selectedData?.title }}
          </div>
          <div flex gap-2>
            <div font-bold>
              Summary:
            </div>
            <div break-all>
              <span class="text-14px text-[#37352f]">
                {{ selectedData?.summary }}
              </span>
            </div>
          </div>
          <div flex gap-2>
            <span font-bold>Categories: </span>
            <div flex flex-row flex-wrap gap-2>
              <div v-for="item in selectedData?.categories" :key="item">
                <UBadge color="gray" variant="solid">
                  {{ item }}
                </UBadge>
              </div>
            </div>
          </div>
          <div mb-4 truncate>
            <span font-bold>URL: </span>
            <a class="text-14px text-[#37352f] underline decoration-solid" :href="selectedData?.url" target="_blank"> {{ selectedData?.url }} </a>
          </div>
        </div>
      </UModal>
    </ClientOnly>
  </div>
</template>
