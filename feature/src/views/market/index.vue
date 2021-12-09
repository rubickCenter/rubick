<template>
  <div class="market">
    <div class="left-menu">
      <div class="search-container">
        <a-input-search
          v-model:value="searchValue"
          placeholder="搜索插件"
          style="width: 100%"
          @search="onSearch"
        />
      </div>

      <a-menu v-model:selectedKeys="current" mode="inline">
        <a-menu-item key="finder">
          <template #icon>
            <StarOutlined />
          </template>
          探索
        </a-menu-item>
        <a-menu-item key="worker">
          <template #icon>
            <SendOutlined style="transform: rotate(-45deg)" />
          </template>
          效率
        </a-menu-item>
        <a-menu-item key="tools">
          <template #icon>
            <SearchOutlined />
          </template>
          搜索工具
        </a-menu-item>
        <a-menu-item key="image">
          <template #icon>
            <FileImageOutlined />
          </template>
          图像
        </a-menu-item>
        <a-menu-item key="dev">
          <template #icon>
            <CodeOutlined />
          </template>
          开发
        </a-menu-item>
        <a-menu-item key="system">
          <template #icon>
            <DatabaseOutlined />
          </template>
          系统
        </a-menu-item>
      </a-menu>
    </div>
    <div class="container">
      <component :totalPlugins="totalPlugins" :is="Components[current[0]]" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  StarOutlined,
  SendOutlined,
  SearchOutlined,
  FileImageOutlined,
  DatabaseOutlined,
  CodeOutlined,
} from "@ant-design/icons-vue";
import { reactive, toRefs, computed } from "vue";
import { useStore } from "vuex";
import Finder from "./components/finder.vue";
import System from "./components/system.vue";

const Components = {
  finder: Finder,
  system: System,
};

const state = reactive({
  searchValue: "",
  current: ["finder"],
});

const store = useStore();

const totalPlugins = computed(() => store.state.totalPlugins);

const { searchValue, current } = toRefs(state);
</script>

<style lang="less">
.market {
  display: flex;
  box-sizing: border-box;
  align-items: flex-start;
  width: 100%;
  overflow: hidden;
  background: #F3EFEF;
  height: calc(~"100vh - 46px");
  .left-menu {
    width: 200px;
    height: 100vh;
    .search-container {
      padding: 10px;
    }
    .ant-input-affix-wrapper {
      border: none;
    }
    .ant-menu {
      background: #F3EFEF;
      .ant-menu-item-selected {
        background-color: #E2E2E2;
        color: #141414;
        &:after {
          display: none;
        }
      }
    }
  }
  .container {
    background: #fff;
    width: calc(~'100% - 200px');
    height: 100%;
    box-sizing: border-box;
    padding: 10px 20px;
    position: relative;
  }
}
</style>
