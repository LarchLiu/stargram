<script setup lang="ts">
const textInput = ref<HTMLInputElement>()
const text = ref('')
useWebShareTarget(async ({ data: { data, action } }: any) => {
  if (action !== 'compose-with-shared-data')
    return

  textInput.value?.focus()

  text.value = (data.textParts.join('\n')) as string
})

// eslint-disable-next-line n/prefer-global/process
const pwaIsInstalled = process.client && !!useNuxtApp().$pwa?.isPWAInstalled
</script>

<template>
  <div mt-4 flex justify-center>
    <textarea
      v-if="pwaIsInstalled"
      ref="textInput"
      v-model="text"
      class="rounded-[4px] text-[#636161]"
      type="text"
      name="text"
      border="1px solid #636161"
      p-2px
      cols="40"
      rows="3"
    />
    <div v-else>
      In order to share content with Stargram, Stargram must be installed.
    </div>
  </div>
  <div mt-4 flex justify-center>
    <button btn>
      Send
    </button>
  </div>
</template>
