<template>
  <div class="result">
    <PluginList
      v-if="result && !!result.length"
      @downloadSuccess="downloadSuccess"
      :title="$t('feature.market.searchResult')"
      :list="result"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import PluginList from './plugin-list.vue';

import { useStore } from 'vuex';
const store = useStore();

const totalPlugins = computed(() => store.state.totalPlugins);
const searchValue = computed(() => store.state.searchValue);

const result = computed(() => {
  if (searchValue.value.trim().length > 0) {
    const pattern = new RegExp(searchValue.value);
    return totalPlugins.value.filter((plugin) => {
      if (plugin.pluginName.match(pattern)) {
        return true;
      } else {
        return false;
      }
    });
  } else {
    return totalPlugins.value;
  }
});
</script>

<style lang="less">
.result {
  width: 100%;
  height: 100vh;
  overflow-x: hidden;
  box-sizing: border-box;
}
</style>
