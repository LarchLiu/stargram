<!-- eslint-disable no-console -->
<script setup lang="ts">
import type { StorageData } from '@stargram/core/storage'

type LoadMoreStatus = 'idle' | 'loading' | 'no-more'

const runtimeConfig = useRuntimeConfig()
const _userId = useLocalStorage('userId', '')
const pageSize = ref(30)
const page = ref<string | number | undefined>()
const dataList = ref<StorageData[]>([])
const list = ref<HTMLDivElement>()
const loadMoreStatus = ref<LoadMoreStatus>('idle')
async function getDataList() {
  loadMoreStatus.value = 'loading'

  const body = page.value
    ? {
        userId: _userId.value,
        pageSize: pageSize.value,
        page: page.value,
      }
    : {
        userId: _userId.value,
        pageSize: pageSize.value,
      }
  const data = await $fetch<{
    data: StorageData[]
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
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = `${base64String}${padding}`
    .replace(/-/g, '+')
    .replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i)
    outputArray[i] = rawData.charCodeAt(i)

  return outputArray
}
function displayConfirmNotification() {
  console.log('displayConfirmNotification !!!')
  if ('serviceWorker' in navigator) {
    const options: NotificationOptions = {
      body: 'You successfully subscribed to our Notification service!',
      // icon: 'src/images/icons/app-icon-96x96.png',
      // image: 'src/images/main-image-sm.jpg',
      dir: 'auto',
      lang: 'en-US', // BCP 47,
      vibrate: [100, 50, 200],
      // badge: 'src/images/icons/app-icon-96x96.png',
      tag: 'confirm-notification',
      data: {
        url: '/',
      },
      renotify: true,
      actions: [
        {
          action: 'confirm',
          title: 'Okay',
        },
        {
          action: 'cancel',
          title: 'Cancel',
        },
      ],
    }

    navigator.serviceWorker.ready
      .then(sw => sw.showNotification('Successfully subscribed (from SW)!', options))
  }
}

function configurePushSubscription() {
  console.log('configurePushSubscription !!!')
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    console.log('serviceWorker !!!')
    let serviceWorkerRegistration: ServiceWorkerRegistration
    navigator.serviceWorker.ready
      .then((registration) => {
        console.log('registration !!!', registration)
        serviceWorkerRegistration = registration
        return registration.pushManager.getSubscription()
      })
      .then((subscription) => {
        console.log('subscription !!!', subscription)
        if (subscription === null) {
          // Create a new subscription
          return serviceWorkerRegistration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(runtimeConfig.public.VAPID_PUBLIC_KEY as string),
          })
        }
        else {
          return subscription
        }
      })
      .then((pushSubscription) => {
        console.log('subscription !!!', { ...JSON.parse(JSON.stringify(pushSubscription)), userId: _userId.value })
        return $fetch('/api/subscriptions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: { ...JSON.parse(JSON.stringify(pushSubscription)), userId: _userId.value },
        })
      })
      .then(() => {
        // if (response.ok)
        console.log('Successfully subscribed!')
        displayConfirmNotification()
      })
      .catch(error => console.log(error))
  }
}

function unsubscribe() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((serviceWorkerRegistration) => {
        return serviceWorkerRegistration.pushManager.getSubscription()
      })
      .then((subscription) => {
        if (!subscription) {
          console.log('Not subscribed, nothing to do.')
          return
        }
        return subscription.unsubscribe()
      })
      .then(() => console.log('Successfully unsubscribed!.'))
      .catch(error => console.error('Error thrown while unsubscribing from push messaging', error))
  }
}

function askForNotificationPermission() {
  Notification.requestPermission((result) => {
    console.log('User Choice', result)
    if (result !== 'granted') {
      console.log('No notification permission granted!')
    }
    else {
      console.log('Notification permission granted!')
      // displayConfirmNotification();
      configurePushSubscription()
    }
  })
}

const displayButton = computed(() => {
  return ('Notification' in window)
})

onMounted(async () => {
  if (_userId.value)
    await getDataList()

  window.addEventListener('scroll', async (evt) => {
    if (loadMoreStatus.value === 'idle' && list.value && list.value.getBoundingClientRect().bottom < (window.innerHeight + 246)) // 246 = data card height
      await getDataList()
  })
})
</script>

<template>
  <div flex justify-center>
    <ClientOnly>
      <div flex flex-col items-center justify-center>
        <div mt-4 text-32px>
          Stargram
        </div>
        <div v-if="_userId">
          <button btn @click="askForNotificationPermission">
            Enable Notifications
          </button>
        </div>
        <div ref="list" flex flex-col items-center justify-center>
          <div my-4 flex flex-wrap justify-center gap-4 rounded lt-sm:flex-col class="lt-sm:w-4/5">
            <div v-for="item in dataList" :key="item.url">
              <div border="1px solid #636161" class="lt-sm:w-full!" h-246px w-350px rounded>
                <div h-180px w-full flex justify-center>
                  <img :src="item.meta.ogImage" h-full w-full rounded-t object-cover>
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
          <div v-if="loadMoreStatus === 'no-more'" mb-4>
            No more data
          </div>
        </div>
      </div>
    </ClientOnly>
  </div>
</template>
