<template>
  <div class="main-container">
    <div class="slider-bar">
      <a-menu v-model:selectedKeys="active" mode="horizontal" @select="({key}) => changeMenu(key)">
        <a-menu-item key="market">
          <template #icon>
            <AppstoreOutlined />
          </template>
          插件市场
        </a-menu-item>
        <a-menu-item key="installed">
          <template #icon>
            <HeartOutlined />
          </template>
          已安装
        </a-menu-item>
        <a-menu-item key="settings">
          <template #icon>
            <SettingOutlined />
          </template>
          设置
        </a-menu-item>
        <a-menu-item key="account">
          <template #icon>
            <UserOutlined />
          </template>
          账户
        </a-menu-item>
      </a-menu>
    </div>
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import {
  HeartOutlined,
  UserOutlined,
  AppstoreOutlined,
  SettingOutlined,
} from "@ant-design/icons-vue";
import { useStore } from "vuex";
const router = useRouter();
const active = ref(["market"]);
const changeMenu = (key: any) => {
  router.push(key);
};

const store = useStore();
const init = () => store.dispatch("init");
init();

</script>
<style lang="less">
* {
  margin: 0;
  padding: 0;
}

.main-container {
  display: flex;
  align-items: flex-start;
  background: #F2EFEF;
  flex-direction: column;

  .slider-bar {
    width: 100%;
  }
}
</style>
