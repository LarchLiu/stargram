<!-- eslint-disable no-console -->
<script setup lang="ts">
const runtimeConfig = useRuntimeConfig()
const userId = useLocalStorage('userId', '')
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
        console.log('subscription !!!', { ...JSON.parse(JSON.stringify(pushSubscription)), userId: userId.value })
        return $fetch('/api/subscriptions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: { ...JSON.parse(JSON.stringify(pushSubscription)), userId: userId.value },
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
</script>

<template>
  <div flex justify-center>
    <ClientOnly>
      <div flex flex-col items-center justify-center>
        <div mt-4 text-32px>
          Stargram
        </div>
        <div>
          <button btn @click="askForNotificationPermission">
            Enable Notifications
          </button>
        </div>
      </div>
    </ClientOnly>
  </div>
</template>
