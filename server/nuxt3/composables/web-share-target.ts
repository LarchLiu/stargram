export function useWebShareTarget(listener?: (message: MessageEvent) => void) {
  // eslint-disable-next-line node/prefer-global/process
  if (process.server)
    return

  onBeforeMount(() => {
    // PWA must be installed to use share target
    if (useNuxtApp().$pwa?.isPWAInstalled && 'serviceWorker' in navigator) {
      if (listener)
        navigator.serviceWorker.addEventListener('message', listener)

      navigator.serviceWorker.getRegistration()
        .then((registration) => {
          if (registration && registration.active) {
            // we need to signal the service worker that we are ready to receive data
            registration.active.postMessage({ action: 'ready-to-receive' })
          }
        })
        .catch(err => console.error('Could not get registration', err))

      if (listener)
        onBeforeUnmount(() => navigator.serviceWorker.removeEventListener('message', listener))
    }
  })
}
