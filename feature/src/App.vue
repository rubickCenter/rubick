<template>
  <div class="main-container">
    <div class="left-menu">
      <a-menu
        @select="({ key }) => changeMenu(key)"
        :selectedKeys="active"
        mode="vertical"
      >
        <a-menu-item key="finder">
          <template #icon>
            <StarOutlined style="font-size: 16px" />
          </template>
          {{ $t('feature.market.explore') }}
        </a-menu-item>
        <a-menu-item key="worker">
          <template #icon>
            <SendOutlined style="transform: rotate(-45deg); font-size: 16px" />
          </template>
          {{ $t('feature.market.efficiency') }}
        </a-menu-item>
        <a-menu-item key="tools">
          <template #icon>
            <SearchOutlined style="font-size: 16px" />
          </template>
          {{ $t('feature.market.searchTool') }}
        </a-menu-item>
        <a-menu-item key="image">
          <template #icon>
            <FileImageOutlined style="font-size: 16px" />
          </template>
          {{ $t('feature.market.imageTool') }}
        </a-menu-item>
        <a-menu-item key="devPlugin">
          <template #icon>
            <CodeOutlined style="font-size: 16px" />
          </template>
          {{ $t('feature.market.developTool') }}
        </a-menu-item>
        <a-menu-item key="system">
          <template #icon>
            <DatabaseOutlined style="font-size: 16px" />
          </template>
          {{ $t('feature.market.systemTool') }}
        </a-menu-item>
        <a-sub-menu class="user-info">
          <template #icon>
            <a-avatar :size="32">
              <template #icon>
                <img :src="perf.custom.logo" />
              </template>
            </a-avatar>
          </template>
          <template #title>{{ perf.custom.username }}</template>
          <a-menu-item key="settings">
            <template #icon>
              <SettingOutlined />
            </template>
            {{ $t('feature.settings.title') }}
          </a-menu-item>
          <a-menu-item key="installed">
            <template #icon>
              <HeartOutlined />
            </template>
            {{ $t('feature.installed.title') }}
          </a-menu-item>
          <a-menu-item key="dev">
            <template #icon>
              <BugOutlined />
            </template>
            {{ $t('feature.dev.title') }}
          </a-menu-item>
        </a-sub-menu>
      </a-menu>
    </div>
    <div
      :class="
        [
          'finder',
          'result',
          'devPlugin',
          'image',
          'tools',
          'worker',
          'system',
        ].includes(active[0])
          ? 'container'
          : 'more'
      "
    >
      <keep-alive>
        <router-view />
      </keep-alive>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import {
  StarOutlined,
  SendOutlined,
  SearchOutlined,
  FileImageOutlined,
  DatabaseOutlined,
  CodeOutlined,
  SettingOutlined,
  HeartOutlined,
  BugOutlined,
} from '@ant-design/icons-vue';
import { useStore } from 'vuex';
import localConfig from '@/confOp';

const store = useStore();
const router = useRouter();
const active = computed(() => store.state.active);
const { perf } = localConfig.getConfig();

const changeMenu = (key: any) => {
  store.commit('commonUpdate', { active: [key] });
  router.push(key);
};

window.rubick.onPluginEnter(({ code }: { code: string }) => {
  code = code === '已安装插件' ? 'installed' : code;
  changeMenu(code);
  store.commit('commonUpdate', { active: [code] });
});

window.rubick.setSubInput((e: any) => {
  if (
    [
      'finder',
      'result',
      'devPlugin',
      'image',
      'tools',
      'worker',
      'system',
    ].includes(active.value[0])
  ) {
    if (e.text) {
      store.commit('setSearchValue', e.text);
      router.push('result');
    } else {
      store.commit('commonUpdate', { active: ['finder'] });
      router.push('finder');
    }
  }
}, '搜索插件');

const init = () => store.dispatch('init');
init();
</script>
<style lang="less">
.ant-menu-submenu-popup {
  .ant-menu {
    background: var(--color-body-bg2) !important;
    height: 100%;
    border-right: none;
    .ant-menu-item,
    .ant-menu-submenu,
    .ant-menu-submenu-arrow {
      color: var(--color-text-content);
      &:active {
        background: none;
      }
    }
    .ant-menu-item-selected,
    .ant-menu-submenu-selected {
      background-color: var(--color-list-hover);
      color: var(--ant-primary-color);
      .ant-menu-submenu-arrow {
        color: var(--ant-primary-color);
      }
      &:after {
        display: none;
      }
    }
  }
}
</style>
<style lang="less" scoped>
@import '~@/assets/common.less';
* {
  margin: 0;
  padding: 0;
}
.main-container {
  -webkit-app-region: no-drag;
  display: flex;
  background: var(--color-body-bg);
  border-top: 1px solid var(--color-border-light);
  height: 100vh;
  box-sizing: border-box;
  align-items: flex-start;
  width: 100%;
  overflow: hidden;
  background: var(--color-menu-bg);
  .search {
    :deep(.ant-btn),
    :deep(.ant-input),
    :deep(.ant-input-group-addon) {
      color: var(--ant-primary-color) !important;
      background: var(--color-input-hover);
      border-color: var(--color-border-light);
    }
  }
  .container,
  .more {
    background: var(--color-body-bg);
    width: calc(~'100% - 183px');
    height: 100%;
    box-sizing: border-box;
    padding: 16px;
    position: relative;
    overflow: auto;
  }
  .more {
    background: var(--color-body-bg2);
  }
  .left-menu {
    padding: 16px;
    position: relative;
    height: 100vh;
    :deep(.ant-menu) {
      width: 100%;
    }
    :deep(.ant-menu-item) {
      padding-left: 12px !important;
      display: flex;
      align-items: center;
    }
    :deep(.ant-menu-item-selected),
    :deep(.ant-menu-submenu-selected) {
      background-color: var(--color-list-hover);
      border-radius: 6px;
      color: var(--ant-primary-color);
    }
    :deep(.user-info) {
      position: absolute;
      bottom: 16px;
      width: calc(100% - 32px);
      .ant-menu-submenu-title {
        padding: 0 32px 0 8px;
        .ant-menu-title-content {
          margin-left: 8px;
        }
      }
    }
    :deep(.ant-avatar) {
      background: transparent;
    }
  }
}
</style>
