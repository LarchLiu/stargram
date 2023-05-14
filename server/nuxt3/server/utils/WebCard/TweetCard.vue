<script lang="ts" setup>
defineProps({
  avator: String,
  name: String,
  screenName: String,
  content: Array<String>,
  pubTime: String,
  lang: String,
})
</script>

<template>
  <div class="h-full w-full flex flex-col justify-between bg-white p-60px text-60px">
    <div class="flex flex-col">
      <div class="flex items-center">
        <img
          alt="avatar"
          width="120"
          height="120"
          :src="avator"
          class="rounded-full"
        >
        <div class="ml-20px flex flex-col text-40px">
          <span :lang="lang ? lang : 'zh-CN'">{{ name }}</span>
          <span :lang="lang ? lang : 'zh-CN'">{{ `@${screenName}` }}</span>
        </div>
      </div>

      <div class="h-320px flex flex-col overflow-hidden pt-30px text-30px">
        <div v-for="(c, i) in content" :key="i" class="flex" :lang="lang ? lang : 'zh-CN'">
          {{ c }}
        </div>
      </div>
    </div>
    <div class="flex items-center justify-between text-24px text-[#1DA1F2]">
      <span class="text-[#586069]">{{ pubTime }}</span>
      <div class="icon-carbon:logo-twitter?w=64&h=64 flex" />
    </div>
  </div>
</template>
