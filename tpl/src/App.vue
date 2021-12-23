<template>
  <router-view />
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();
window.rubick.onPluginEnter(({ code, type, payload }) => {
  const current = window.exports[code];
  router.push({
    name: current.mode,
    params: {
      code, type, payload
    },
  });
});
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
</style>
