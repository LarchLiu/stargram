<script setup lang="ts">
interface TitleData {
  text: string
  icon: string
}

defineProps<{ title: TitleData }>()
</script>

<template>
  <div mb-1 flex flex-row items-center justify-start text-12px>
    <div :class="title.icon" />
    <dev ml-1 text-12px>
      {{ title.text }}
    </dev>
  </div>
  <div text-10px>
    <slot name="kv-storage" />
    <slot name="text" />
    <slot name="app" />
    <slot name="document" />
    <slot name="og" />
    <slot name="llm" />
    <slot name="data-storage" />
    <slot name="img-storage" />
    <slot name="server" />
  </div>

  <!-- <div v-if="output" flex items-center justify-end text-10px text-gray>
    <div ref="outputEl">
      {{ output.text || 'Output' }}
    </div>
    <Handle id="output" type="source" :position="Position.Right" :style="outputHandleStyle" />
  </div> -->
</template>

<style scoped>

</style>
