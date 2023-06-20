<script setup lang="ts">
interface TitleData {
  text: string
  icon: string
}

defineProps<{ title: TitleData }>()
</script>

<template>
  <div mb-1 flex flex-row items-center justify-start text-12px>
    <div :class="title.icon" text-1.2rem />
    <dev ml-1 text-12px>
      {{ title.text }}
    </dev>
  </div>
  <div text-10px>
    <slot name="text-input" />
    <slot name="preview-config" />
  </div>
</template>

<style scoped>

</style>
