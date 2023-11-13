<template>
  <div class="panel-item">
    <h3 class="title">{{ title }}</h3>
    <div class="list-item">
      <a-list
        :grid="{ gutter: 16, column: 2 }"
        :data-source="list.filter((item) => !!item)"
      >
        <template #renderItem="{ item, index }">
          <a-list-item v-if="item" @click="showDetail(index)">
            <template #actions>
              <a-button
                class="download-plugin-btn"
                type="text"
                :loading="item.isloading"
              >
                <CloudDownloadOutlined
                  v-if="!item.isloading && !item.isdownload"
                  @click.stop="downloadPlugin(item, index)"
                  style="font-size: 20px; cursor: pointer"
                />
                <SelectOutlined
                  v-if="!item.isloading && item.isdownload"
                  @click.stop="openPlugin(item)"
                  style="font-size: 18px; cursor: pointer"
                />
              </a-button>
            </template>
            <a-list-item-meta>
              <template #description>
                <span class="ellipse desc">{{ item.description }}</span>
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
    <a-drawer
      width="77%"
      v-if="visible"
      placement="right"
      :closable="false"
      :visible="visible"
      class="plugin-info"
      :style="{ position: 'absolute' }"
      @close="visible = false"
    >
      <template #title>
        <div class="plugin-title-info">
          <div class="info">
            <img :src="detail.logo" class="plugin-icon" />
            <div class="plugin-desc">
              <div>
                <div class="title">
                  {{ detail.pluginName }}
                </div>
                <div class="desc">
                  {{ detail.description }}
                </div>
              </div>
              <a-button
                v-if="!detail.isdownload"
                @click.stop="downloadPlugin(detail)"
                shape="round"
                type="primary"
                :loading="detail.isloading"
              >
                <template #icon>
                  <CloudDownloadOutlined
                    v-show="!detail.isloading && !detail.isdownload"
                  />
                </template>
                {{ $t('feature.market.install') }}
              </a-button>
            </div>
          </div>
        </div>
      </template>
      <a-spin :spinning="!content" tip="内容加载中...">
        <div v-if="content !== 'error'" v-html="content" class="home-page-container"></div>
        <a-result
          class="error-content"
          v-else
          sub-title="插件主页内容走丢啦！"
        >
          <template #icon>
            <Vue3Lottie :animationData="notFountJson" :height="240" :width="240" />
          </template>
        </a-result>
      </a-spin>
    </a-drawer>
  </div>
</template>

<script setup>
import {
  CloudDownloadOutlined,
  ArrowLeftOutlined,
  SelectOutlined
} from '@ant-design/icons-vue';

import { defineProps, ref, computed } from 'vue';
import { useStore } from 'vuex';
import { message } from 'ant-design-vue';
import MarkdownIt from 'markdown-it';
import { useRouter } from 'vue-router';
import request from '@/assets/request/index';
import notFountJson from '@/assets/lottie/404.json';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const store = useStore();
const router = useRouter();

const startDownload = (name) => store.dispatch('startDownload', name);
const successDownload = (name) => store.dispatch('successDownload', name);

const props = defineProps({
  list: {
    type: [Array],
    default: () => [],
  },
  title: String,
});

const downloadPlugin = async (plugin) => {
  startDownload(plugin.name);
  await window.market.downloadPlugin(plugin);
  message.success(t('feature.dev.installSuccess', { pluginName: plugin.pluginName }));
  successDownload(plugin.name);
};

const visible = ref(false);
const showIndex = ref(0);
const markdown = new MarkdownIt();
const content = ref('');

const showDetail = async (index) => {
  const item = props.list[index];
  visible.value = true;
  showIndex.value = index;
  content.value = '';
  let mdContent = '暂无内容';
  try {
    if (item.homePage) {
      mdContent = await request.getPluginDetail(item.homePage);
    }
    content.value = markdown.render(mdContent);
  } catch (e) {
    content.value = 'error';
  }
};

const detail = computed(() => props.list[showIndex.value]);

const openPlugin = (item) => {
  store.commit('commonUpdate', {active: ['installed']})
  router.push({
    path: '/installed',
    query: {plugin: item.name}
  });
};
</script>

<style lang="less">
&::-webkit-scrollbar {
  width: 0;
}
.panel-item {
  margin-bottom: 17px;
  .download-plugin-btn {
    color: var(--ant-primary-color);
  }
  .title {
    margin-bottom: 30px;
    color: var(--color-text-primary);
  }
  .ellipse {
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
    color: var(--color-text-content);
    &.desc {
      color: var(--color-text-desc);
    }
  }
  &:after {
    content: ' ';
    display: block;
    width: 100%;
    height: 1px;
    border-bottom: 1px solid var(--color-border-light);
    transform: scaleY(0.5);
  }
  .ant-list-item {
    display: flex !important;
  }

  &:last-child {
    &:after {
      border-bottom: none;
    }
  }
}
.plugin-info {
  width: 100%;

  .ant-drawer-content-wrapper {
    box-shadow: none !important;
    .ant-drawer-content {
      background: var(--color-body-bg);
    }
    .ant-drawer-header {
      background: var(--color-body-bg);
      border-bottom: 1px solid var(--color-border-light);
    }
  }
}

.dark {
  .plugin-title-info {
    .back-icon {
      filter: invert(1) brightness(200%);
    }
  }
}

.plugin-title-info {
  display: flex;
  align-items: flex-start;
  width: 100%;
  .info {
    width: 100%;
    display: flex;
    align-items: flex-start;

    .plugin-icon {
      width: 40px;
      height: 40px;
      margin-right: 20px;
    }

    .plugin-desc {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .title {
        font-size: 18px;
        font-weight: bold;
        color: var(--color-text-primary);
      }

      .desc {
        font-size: 12px;
        font-weight: normal;
        color: var(--color-text-desc);
      }
    }
  }
}
.error-content {
  &.ant-result {
    padding: 0;
  }
}
.home-page-container {
  min-height: 200px;
  * {
    color: var(--color-text-content);
  }
  img {
    width: 100%;
  }
}
</style>
