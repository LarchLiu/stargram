<script setup lang="ts">
import { ref, computed } from 'vue'
import type { IConfig } from '../types'

interface Props {
  data: {
    select: string
    config: Record<string, IConfig>
  }
}
const props = defineProps<Props>()
const emit = defineEmits(['update'])
const model = props.data
const view = ref(false)

const inputType = computed(() => {
  return view.value ? 'text' : 'password'
})

function onViewClick() {
  view.value = !view.value
}
</script>

<template>
  <div flex flex-row items-center justify-between>
    <div flex flex-row items-center justify-start text-12px>
      <div text-12px>
        {{ model.select }}
      </div>
    </div>
    <div flex items-center>
      <div text-0.8rem :class="[view ? 'i-carbon-view-off' : 'i-carbon-view']" icon-btn @click="onViewClick" />
    </div>
  </div>
  <div text-12px>
    <div v-for="(v, k) in model.config" :key="k" flex flex-col >
      <div mt-2 mb-1 text-gray>
        {{ v.label }} <span v-if="v.require" text-red>*</span>
      </div>
      <input v-model="v.value" :type="inputType" :name="k" @change="emit('update', k, v.value)">
    </div>
  </div>
</template>

<style scoped>
input {
  border-width: 1px;
  font-size: 14px;
  height: 20px;
  border-radius: 4px;
}
</style>
