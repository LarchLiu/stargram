<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid'
import { errorMessage } from '@stargram/core/utils'

const textInput = ref<HTMLInputElement>()
const text = ref('')
const userId = useLocalStorage('userId', '')
const clientId = useLocalStorage('clientId', uuidv4())
const toast = useToast()

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
</script>

<template>
  <div flex justify-center>
    <ClientOnly>
      <div v-if="userId">
        <textarea
          ref="textInput"
          v-model="text"
          class="rounded-[4px] text-[#636161]"
          type="text"
          name="text"
          border="1px solid #636161"
          cols="40"
          rows="3"
          mt-4 p-2px
        />
        <div mt-4 flex justify-center>
          <button btn @click="saveWebInfo(text)">
            Send
          </button>
        </div>
      </div>
      <div v-else mt-4>
        <div flex flex-col>
          There is no user config.
          <div mt-4 flex justify-center>
            <NuxtLink to="/settings">
              <button btn>
                Settings
              </button>
            </NuxtLink>
          </div>
        </div>
      </div>
    </ClientOnly>
  </div>
</template>
