<!-- eslint-disable no-console -->
<script setup lang="ts">
function displayConfirmNotification() {
  console.log('displayConfirmNotification !!!')
  if ('serviceWorker' in navigator) {
    const options: NotificationOptions = {
      body: 'You successfully subscribed to our Notification service!',
      icon: 'src/images/icons/app-icon-96x96.png',
      image: 'src/images/main-image-sm.jpg',
      dir: 'ltr',
      lang: 'en-US', // BCP 47,
      vibrate: [100, 50, 200],
      badge: 'src/images/icons/app-icon-96x96.png',
      tag: 'confirm-notification',
      renotify: true,
      actions: [
        {
          action: 'confirm',
          title: 'Okay',
          icon: 'src/images/icons/app-icon-96x96.png',
        },
        {
          action: 'cancel',
          title: 'Cancel',
          icon: 'src/images/icons/app-icon-96x96.png',
        },
      ],
    }

    navigator.serviceWorker.ready
      .then(sw => sw.showNotification('Successfully subscribed (from SW)!', options))
  }
}

function configurePushSubscription() {
  console.log('configurePushSubscription !!!')
  if ('serviceWorker' in navigator) {
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
            applicationServerKey: 'BPg36y0YwKrMOgutw18ZeX9Ps3fBy5tNnA_OdPIoraBn4u7ptTxJKt14bNcT3WC67b_zaMe5UQgflinBotYubEM',
          })
        }
        else {
          return subscription
        }
      })
      .then((pushSubscription) => {
        console.log('subscription !!!', JSON.stringify(pushSubscription))
        return $fetch('/api/subscriptions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(pushSubscription),
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
