<template>
  <div class="result">
    <PluginList
      v-if="result && !!result.length"
      @downloadSuccess="downloadSuccess"
      :title="$t('feature.market.searchResult')"
      :list="result"
    />
    <a-result
      class="error-content"
      v-else
      sub-title="哎呀，暂时还没有这个插件哟！"
    >
      <template #icon>
        <Vue3Lottie :animationData="emptyJson" :height="240" :width="240" />
      </template>
    </a-result>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import emptyJson from '@/assets/lottie/empty.json';
import PluginList from './plugin-list.vue';

import { useStore } from 'vuex';
const store = useStore();

const totalPlugins = computed(() => store.state.totalPlugins);
const searchValue = computed(() => store.state.searchValue);

const result = computed(() => {
  if (searchValue.value.trim().length > 0) {
    const pattern = new RegExp(searchValue.value.toLowerCase());
    return totalPlugins.value.filter((plugin) => {
      if (plugin.pluginName.toLowerCase().match(pattern)) {
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
  overflow-x: hidden;
  box-sizing: border-box;
  .error-content {
    padding-top: 40px;
  }
}
</style>
