<template>
  <div class="panel-item">
    <h3 class="title">{{ title }}</h3>
    <div class="list-item">
      <a-list :grid="{ gutter: 16, column: 2 }" :data-source="list">
        <template #renderItem="{ item, index }">
          <a-list-item @click="visible=true">
            <template #actions>
              <a-button style="color: #ff4ea4;" type="text" :loading="item.isloading">
                <CloudDownloadOutlined
                  v-show="!item.isloading && !item.isdwonload"
                  @click.stop="downloadPlugin(item, index)"
                  style="font-size: 20px; cursor: pointer"
                />
              </a-button>
            </template>
            <a-list-item-meta
              :description="item.description"
            >
              <template #title>
                <span>{{ item.pluginName }}</span>
              </template>
              <template #avatar>
                <a-avatar :src="item.logo" />
              </template>
            </a-list-item-meta>
          </a-list-item>
        </template>
      </a-list>
    </div>
  </div>
  <a-drawer
    width="100%"
    placement="right"
    :closable="false"
    :visible="visible"
    :get-container="false"
    class="plugin-info"
    :style="{ position: 'absolute' }"
    @close="visible=false"
  >
    <template #title>
      <div class="plugin-title-info">
        <div class="back-icon" @click="visible=false">
          <ArrowLeftOutlined />
        </div>
        <div class="info">
          <img src="https://static.91jkys.com/activity/img/2adb63c2e5d54dc1b26001958fcdb044.jpg"
               class="plugin-icon" />
          <div class="plugin-desc">
            <div class="title">
              备忘快贴
            </div>
            <div class="desc">
              适合每个人的专业图像编辑软件
            </div>
            <a-button shape="round" type="primary">
              <template #icon>
                <CloudDownloadOutlined />
              </template>
              获取
            </a-button>
          </div>
        </div>
      </div>
    </template>
  </a-drawer>
</template>

<script setup>
import {
  CloudDownloadOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons-vue";

import { defineProps, ref } from "vue";
import { useStore } from "vuex";

const store = useStore();

const startDownload = (name) => store.dispatch("startDownload", name);
const successDownload = (name) => store.dispatch("successDownload", name);

defineProps({
  list: {
    type: [Array],
    default: () => [],
  },
  title: String,
});

const downloadPlugin = async (plugin) => {
  startDownload(plugin.name);
  await window.market.downloadPlugin(plugin);
  successDownload(plugin.name);
};

const visible = ref(false);
</script>

<style lang="less">
.panel-item {
  margin: 20px 0;
  .title {
    margin-bottom: 30px;
  }
  &:after{
    content: " ";
    display: block;
    width: 100%;
    height: 1px;
    border-bottom: 1px solid #eee;
    transform: scaleY(0.5);
  }
  .ant-list-item {
    display: flex !important;
  }

  &:last-child {
    border-bottom: none;
  }
}
.plugin-info {
  width: 100%;

  .ant-drawer-content-wrapper {
    box-shadow: none !important;
  }
}

.plugin-title-info {
  display: flex;
  align-items: flex-start;

  .back-icon {
    font-size: 16px;
    margin-right: 40px;
  }

  .info {
    display: flex;
    align-items: center;

    .plugin-icon {
      width: 100px;
      height: 100px;
      margin-right: 20px;
    }

    .plugin-desc {
      .title {
        font-size: 18px;
        font-weight: bold;
      }

      .desc {
        font-size: 12px;
        font-weight: normal;
        margin-top: 5px;
        margin-bottom: 20px;
      }
    }
  }
}
</style>
