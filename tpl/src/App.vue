<template>
  <router-view />
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();
window.rubick.onPluginEnter(({ code }) => {
  const current = window.exports[code];
  router.push({
    name: current.mode,
    params: {
      code,
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
