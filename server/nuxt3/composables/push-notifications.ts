/* eslint-disable no-console */
import { v4 as uuidv4 } from 'uuid'

const supportsPushNotifications = typeof window !== 'undefined'
  && 'serviceWorker' in navigator
  && 'PushManager' in window
  && 'Notification' in window
  && 'getKey' in PushSubscription.prototype
const clientId = useLocalStorage('clientId', uuidv4())

export function usePushManager() {
  const runtimeConfig = useRuntimeConfig()

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
    if (supportsPushNotifications) {
      console.log('serviceWorker !!!')
      navigator.serviceWorker.ready
        .then(async (registration) => {
          console.log('registration !!!', registration)
          const subscription = await registration.pushManager.getSubscription()
          return { registration, subscription }
        })
        .then(({ registration, subscription }) => {
          console.log('subscription !!!', subscription)
          if (subscription === null) {
            // Create a new subscription
            return registration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: urlBase64ToUint8Array(runtimeConfig.public.VAPID_PUBLIC_KEY as string),
            })
          }
          else {
            return subscription
          }
        })
        .then((pushSubscription) => {
          console.log('subscription !!!', { ...pushSubscription.toJSON(), clientId: clientId.value })
          return $fetch('/api/subscriptions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: { ...pushSubscription.toJSON(), clientId: clientId.value },
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
    window.Notification.requestPermission((result) => {
      console.log('User Choice', result)
      if (result !== 'granted') {
        console.log('No notification permission granted!')
      }
      else {
        console.log('Notification permission granted!')
        configurePushSubscription()
      }
    })
  }

  const shouldAskNotifications = computed(() => {
    return supportsPushNotifications && window.Notification.permission === 'default' && !!clientId.value
  })

  return {
    displayConfirmNotification,
    askForNotificationPermission,
    shouldAskNotifications,
    unsubscribe,
  }
}
