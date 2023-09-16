<template>
  <div
    v-show="!currentPlugin.name"
    class="options"
    ref="scrollDom"
  >
    <div class="history-plugins" v-if="!options.length || !(searchValue || !!clipboardFile.length)">
      <a-row>
        <a-col
          @click="() => item.click()"
          :class="currentSelect === index ? 'active history-item' : 'history-item'"
          :span="3"
          v-for="(item, index) in pluginHistory"
          :key="index"
        >
          <a-avatar style="border-radius: 0" :src="item.icon" />
          <div class="name ellpise">{{item.pluginName || item._name || item.name}}</div>
        </a-col>
      </a-row>
    </div>
    <a-list v-else item-layout="horizontal" :dataSource="sort(options)">
      <template #renderItem="{ item, index }">
        <a-list-item
          @click="() => item.click()"
          :class="currentSelect === index ? 'active op-item' : 'op-item'"
        >
          <a-list-item-meta :description="renderDesc(item.desc)">
            <template #title>
              <span v-html="renderTitle(item.name, item.match)"></span>
            </template>
            <template #avatar>
              <a-avatar style="border-radius: 0" :src="item.icon" />
            </template>
          </a-list-item-meta>
        </a-list-item>
      </template>
    </a-list>
  </div>
</template>

<script lang="ts" setup>
import BScroll from '@better-scroll/core';
import { defineProps, onMounted, ref } from 'vue';

const scrollDom = ref(null);

onMounted(() => {
  new BScroll(scrollDom.value);
});

const props = defineProps({
  searchValue: {
    type: [String, Number],
    default: '',
  },
  options: {
    type: Array,
    default: (() => [])(),
  },
  currentSelect: {
    type: Number,
    default: 0,
  },
  currentPlugin: {},
  pluginHistory: (() => [])(),
  clipboardFile: (() => [])(),
});

const renderTitle = (title, match) => {
  if (typeof title !== 'string') return;
  if (!props.searchValue || !match) return title;
  const result = title.substring(match[0], match[1] + 1);
  return `<div>${title.substring(0, match[0])}<span style='color: var(--ant-error-color)'>${result}</span>${title.substring(match[1]+1, title.length)}</div>`;
};

const renderDesc = (desc) => {
  if (desc.length > 80) {
    return `${desc.substr(0, 63)}...${desc.substr(
      desc.length - 14,
      desc.length
    )}`;
  }
  return desc;
};

const sort = (options) => {
  for (let i = 0; i < options.length; i++) {
    for (let j = i + 1; j < options.length; j++) {
      if (options[j].zIndex > options[i].zIndex) {
        let temp = options[i];
        options[i] = options[j];
        options[j] = temp;
      }
    }
  }
  return options;
};
</script>

<style lang="less">
.ellpise {
  overflow:hidden;
  text-overflow:ellipsis;
  display:-webkit-box;
  -webkit-line-clamp:1;
  -webkit-box-orient:vertical;
}

.options {
  position: absolute;
  top: 60px;
  left: 0;
  width: 100%;
  z-index: 99;
  max-height: calc(~'100vh - 60px');
  overflow: auto;
  background: var(--color-body-bg);
  .history-plugins {
    width: 100%;
    border-top: 1px dashed #ddd;
    box-sizing: border-box;
    .history-item {
      box-sizing: border-box;
      height: 79px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      border-right: 1px dashed #ddd;
      &.active {
        background: var(--color-list-hover);
      }
    }
    .name {
      margin-top: 4px;
      width: 100%;
      text-align: center;
    }
  }
  .op-item {
    padding: 0 10px;
    height: 60px;
    line-height: 50px;
    max-height: 500px;
    overflow: auto;
    background: var(--color-body-bg);
    color: var(--color-text-content);
    border-color: var(--color-border-light);
    border-bottom: 1px solid var(--color-border-light);
    &.active {
      background: var(--color-list-hover);
    }
    .ant-list-item-meta-title {
      color: var(--color-text-content);
    }
    .ant-list-item-meta-description {
      color: var(--color-text-desc);
    }
  }
}
</style>
