<template>
  <div class="main-container">
    <div class="slider-bar">
      <div class="top">
        <div class="menu-item avatar">
          <a-avatar shape="square" :size="30">
            <template #icon><UserOutlined /></template>
          </a-avatar>
        </div>
        <div class="menu-item" @click="changeMenu('market')">
          <AppstoreOutlined :class="active === 'market' && 'active'" style="font-size: 24px;" />
        </div>
        <div class="menu-item" @click="changeMenu('installed')">
          <HeartOutlined :class="active === 'installed' && 'active'" style="font-size: 24px;" />
        </div>
        <div class="menu-item" @click="changeMenu('settings')">
          <SettingOutlined :class="active === 'installed' && 'active'" style="font-size: 24px;" />
        </div>
        <div class="menu-item" @click="changeMenu('dev')">
          <BugOutlined :class="active === 'installed' && 'active'" style="font-size: 24px;" />
        </div>
      </div>
      <div class="menu-item bottom" @click="changeMenu('more')">
        <MenuOutlined style="font-size: 24px;" />
      </div>
    </div>
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { HeartOutlined, UserOutlined, SearchOutlined, MenuOutlined, AppstoreOutlined, SettingOutlined, BugOutlined } from "@ant-design/icons-vue";

const active = ref("market");

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

  .slider-bar {
    -webkit-app-region: drag;
    width: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: column;
    padding-top: 15px;
    height: 100vh;
    background-image: linear-gradient(to top right, rgba(255, 159, 180, 0.3), rgba(255, 159, 180, 0.2));
    color: #7D7170;
    box-sizing: border-box;

    .top {
      display: flex;
      align-items: center;
      flex-direction: column;
    }

    .menu-item {
      cursor: pointer;
      margin-bottom: 40px;
      -webkit-app-region: no-drag;

      .active {
        color: #ff4ea4;
      }

      &.avatar {
        margin-bottom: 30px;
      }

      &.bottom {
        margin-bottom: 20px;
      }
    }
  }
}
</style>
