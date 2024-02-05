<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid'
import { appName } from '~/constants'

useHead({
  title: `Settings - ${appName}`,
  meta: [
    { property: 'og:title', content: `Settings - ${appName}` },
  ],
})
const buildInfo = useBuildInfo()
const userId = useLocalStorage('userId', '')
const { copy } = useClipboard()
const router = useRouter()
const _userId = ref('')
const edit = ref(false)

async function getConfigCode() {
  const data = await $fetch<string>('/api/stargram/user-config', {
    method: 'POST',
    body: {
      userId: _userId.value ? _userId.value : userId.value,
    },
  })

  return data
}

async function redirectToConfig() {
  const encode = await getConfigCode()
  if (encode)
    router.push(`/user-config?code=${encode}`)
}
</script>

<template>
  <div flex justify-center>
    <ClientOnly>
      <div mt-4 flex flex-col>
        User ID
        <div v-if="userId && !edit" mt-2 flex items-center>
          {{ userId }}
          <div uno-carbon-edit ml-2 title="Refresh" h-24px w-24px cursor-pointer @click="edit = true" />
        </div>
        <div v-else mt-2 flex items-center>
          <input
            v-model="_userId"
            class="rounded-[4px] text-[#636161]"
            type="text"
            border="1px solid #636161"
            w-340px p-2px
          >
          <div uno-fad-random-1dice ml-1 title="Refresh" h-32px w-32px cursor-pointer @click="_userId = uuidv4()" />
          <div uno-carbon-copy title="Copy" ml-1 h-24px w-24px cursor-pointer @click="copy(_userId)" />
        </div>
        <div my-4 flex justify-center>
          <button btn :disabled="!_userId" @click="userId = _userId">
            Save
          </button>
          <button ml-4 btn :disabled="(!userId && !_userId) || (edit && !_userId)" @click="redirectToConfig()">
            Config
          </button>
        </div>
        <UDivider label="About" />
        <div flex justify-between>
          <div>Version</div>
          {{ `v${buildInfo.version} (@${buildInfo.env})` }}
        </div>
        <div flex justify-between>
          <div>Build time</div>
          {{ new Date(buildInfo.time).toUTCString() }}
        </div>
      </div>
    </ClientOnly>
  </div>
</template>

<style scoped>

</style>
