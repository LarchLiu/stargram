<script lang="ts" setup>
defineProps({
  title: String,
  content: Array<String>,
  favicon: String,
})
</script>

<template>
  <div class="h-full w-full flex flex-col justify-between bg-white p-60px text-60px" lang="zh-CN">
    <div class="flex flex-col">
      <div class="flex items-center text-40px">
        {{ title }}
      </div>

      <div class="h-320px flex flex-col overflow-hidden pt-30px text-30px" lang="zh-CN">
        <div v-for="(c, i) in content" :key="i" class="flex">
          {{ c }}
        </div>
      </div>
    </div>
    <div class="flex items-center justify-end text-24px">
      <div class="i-ph:shooting-star-light?64" />
      <img
        v-if="favicon"
        alt="favicon"
        width="64"
        height="64"
        :src="favicon"
        class="rounded"
      >
    </div>
  </div>
</template>
