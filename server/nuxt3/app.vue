<script setup lang="ts">

</script>

<template>
  <NuxtPage />
</template>

<style>
@import '@vue-flow/core/dist/style.css';
@import '@vue-flow/core/dist/theme-default.css';
@import '@vue-flow/controls/dist/style.css';
@import '@vue-flow/minimap/dist/style.css';

html, body , #__nuxt{
  height: 100vh;
  margin: 0;
  padding: 0;
}

html.dark {
  background: #222;
  color: white;
}

:focus-visible,
:focus {
  outline: none;
}

input {
  border-color:rgb(98, 93, 100);
  border-style: solid;
}

.divider {
  border-top: 1px solid #b0b9c4;
}

select.vue-flow {
  border: 1px solid #636161;
  border-radius: 4px;
  color: #636161;
  padding: 2px;
  text-overflow: ellipsis;
}
input.vue-flow {
  width: 100%;
  border: 1px solid #636161;
  border-radius: 4px;
  color: #636161;
  padding: 2px;
}
textarea.vue-flow {
  width: 100%;
  border: 1px solid #636161;
  border-radius: 4px;
  color: #636161;
  padding: 2px;
}
:root {
  --vf-node-color: #777;
}
</style>
