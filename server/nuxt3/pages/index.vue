<!-- eslint-disable no-console -->
<script setup lang="ts">
import type { ReturnStorageData } from '@stargram/core/storage'
import { v4 as uuidv4 } from 'uuid'

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

useEventListener('scroll', async (evt) => {
  if (userId.value && loadMoreStatus.value === 'idle' && list.value && list.value.getBoundingClientRect().bottom < (windowHeight.value + cardHeight))
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
        <div mt-4 text-32px>
          Stargram
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
        <div ref="list" flex flex-col items-center justify-center>
          <div my-4 flex flex-wrap justify-center gap-4 rounded lt-sm:flex-col class="lt-sm:w-4/5">
            <div v-for="item in dataList" :key="item.id">
              <div
                border="1px solid #636161"
                class="shadow-[0_2px_4px_#0000004d] lt-sm:w-full!"
                :class="pageSize > 10 ? 'h-246px' : ''"
                w-350px cursor-pointer rounded hover:bg-gray-100
              >
                <div h-180px w-full flex justify-center>
                  <img :src="item.meta.ogImage" h-full w-full rounded-t-3px object-cover>
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
      </div>
    </ClientOnly>
  </div>
</template>
