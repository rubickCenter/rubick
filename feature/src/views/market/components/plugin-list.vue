<template>
  <div class="panel-item">
    <h3 class="title">{{ title }}</h3>
    <div class="list-item">
      <a-list :grid="{ gutter: 16, column: 2 }" :data-source="list">
        <template #renderItem="{ item, index }">
          <a-list-item v-if="item" @click="showDetail(item)">
            <template #actions>
              <a-button style="color: #ff4ea4;" type="text" :loading="item.isloading">
                <CloudDownloadOutlined
                  v-show="!item.isloading && !item.isdownload"
                  @click.stop="downloadPlugin(item, index)"
                  style="font-size: 20px; cursor: pointer"
                />
              </a-button>
            </template>
            <a-list-item-meta>
              <template #description>
                <span class="ellipse">{{ item.description }}</span>
              </template>
              <template #title>
                <span class="ellipse">{{ item.pluginName }}</span>
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
          <img
            :src="detail.logo"
            class="plugin-icon"
          />
          <div class="plugin-desc">
            <div class="title">
              {{ detail.pluginName }}
            </div>
            <div class="desc">
              {{ detail.description }}
            </div>
            <a-button v-if="!detail.isdownload" @click.stop="downloadPlugin(detail)" shape="round" type="primary" :loading="detail.isloading">
              <template #icon>
                <CloudDownloadOutlined v-show="!detail.isloading && !detail.isdownload" />
              </template>
              获取
            </a-button>
          </div>
        </div>
      </div>
    </template>
    <div v-html="content" class="home-page-container"></div>
  </a-drawer>
</template>

<script setup>
import {
  CloudDownloadOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons-vue";

import { defineProps, ref } from "vue";
import { useStore } from "vuex";
import { message } from "ant-design-vue";
import MarkdownIt from "markdown-it";
import request from "../../../assets/request/index";

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
  message.success(`${plugin.name}安装成功！`);
  successDownload(plugin.name);
};

const visible = ref(false);
const detail = ref({});
const markdown = new MarkdownIt();
const content = ref("");

const showDetail = async (item) => {
  visible.value = true;
  detail.value = item;
  let mdContent = "暂无内容";
  if (item.homePage) {
    mdContent = await request.getPluginDetail(item.homePage);
  }
  content.value = markdown.render(mdContent);
};
</script>

<style lang="less">
&::-webkit-scrollbar {
  width: 0;
}
.panel-item {
  margin: 20px 0;
  .title {
    margin-bottom: 30px;
  }
  .ellipse {
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
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
.home-page-container {
  img {
    width: 100%;
  }
}
</style>
