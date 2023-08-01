<template>
  <div class="main-container">
    <div class="slider-bar">
      <a-menu
        v-model:selectedKeys="active"
        mode="horizontal"
        @select="({ key }) => changeMenu(key)"
      >
        <a-menu-item key="market">
          <template #icon>
            <AppstoreOutlined />
          </template>
          {{ $t('feature.market.title') }}
        </a-menu-item>
        <a-menu-item key="installed">
          <template #icon>
            <HeartOutlined />
          </template>
          {{ $t('feature.installed.title') }}
        </a-menu-item>
        <a-menu-item key="settings">
          <template #icon>
            <SettingOutlined />
          </template>
          {{ $t('feature.settings.title') }}
        </a-menu-item>
        <a-menu-item key="dev">
          <template #icon>
            <BugOutlined />
          </template>
          {{ $t('feature.dev.title') }}
        </a-menu-item>
      </a-menu>
    </div>
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import {
  HeartOutlined,
  UserOutlined,
  AppstoreOutlined,
  SettingOutlined,
  BugOutlined,
} from '@ant-design/icons-vue';
import { useStore } from 'vuex';
const router = useRouter();
const active = ref(['market']);
const changeMenu = (key: any) => {
  router.push(key);
};

window.rubick.onPluginEnter(({ code }: { code: string }) => {
  changeMenu(code);
  active.value = [code];
});

const store = useStore();
const init = () => store.dispatch('init');
init();
</script>
<style lang="less" scoped>
* {
  margin: 0;
  padding: 0;
}

.main-container {
  display: flex;
  align-items: flex-start;
  background: var(--color-body-bg);
  flex-direction: column;

  .slider-bar {
    width: 100%;
    .ant-menu {
      background: var(--color-body-bg);
      border-color: var(--color-border-light);
      :deep(.ant-menu-item) {
        &:not(.ant-menu-item-selected) {
          color: var(--color-text-primary);
        }
      }
    }
  }
}
</style>
