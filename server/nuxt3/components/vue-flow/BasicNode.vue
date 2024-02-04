<script setup lang="ts">
interface TitleData {
  text: string
  icon: string
}

defineProps<{ title: TitleData, needViewButton?: boolean }>()

const view = ref(false)
function onViewClick() {
  view.value = !view.value
}
</script>

<template>
  <div mb-1 flex flex-row items-center justify-between>
    <div flex flex-row items-center justify-start text-12px>
      <div :class="title.icon" text-1.2rem />
      <div ml-1 text-12px>
        {{ title.text }}
      </div>
    </div>
    <div v-if="needViewButton" flex items-center>
      <div text-0.8rem :class="[view ? 'uno-carbon-view-off' : 'uno-carbon-view']" icon-btn @click="onViewClick" />
    </div>
  </div>
  <div text-10px>
    <slot name="text-input" />
    <slot name="preview-config" :view="view" />
  </div>
</template>

<style scoped>

</style>
