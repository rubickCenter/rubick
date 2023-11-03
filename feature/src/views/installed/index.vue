<template>
  <div class="installed">
    <div class="view-title">{{ $t('feature.installed.title') }}</div>
    <div class="view-container">
      <div v-if="!localPlugins.length">
        <a-result
          class="error-content"
          sub-title="哎呀，暂时还没有安装任何插件！"
        >
          <template #icon>
            <Vue3Lottie :animationData="emptyJson" :height="240" :width="240" />
          </template>
          <template #extra>
            <a-button @click="gotoFinder" key="console" type="primary">去插件市场看看吧</a-button>
          </template>
        </a-result>
      </div>
      <div class="container" v-else>
        <div class="installed-list">
          <div
            :class="currentSelect[0] === plugin.name ? 'item active' : 'item'"
            :key="index"
            @click="currentSelect = [plugin.name]"
            v-for="(plugin, index) in localPlugins"
          >
            <img :src="plugin.logo" />
            <div class="info">
              <div class="title">
                {{ plugin.pluginName }}
              </div>
              <div class="desc">{{ plugin.description }}</div>
            </div>
          </div>
        </div>
        <div class="plugin-detail">
          <div class="plugin-top">
            <div class="left">
              <div class="title">
                {{ pluginDetail.pluginName }}
                <a-tag>{{ pluginDetail.version }}</a-tag>
              </div>
              <div class="desc">
                {{ $t('feature.installed.developer') }}：{{
                  `${pluginDetail.author || $t('feature.installed.unknown')}`
                }}
              </div>
              <div class="desc">
                {{ pluginDetail.description }}
              </div>
            </div>
            <div class="right">
              <a-button
                type="primary"
                size="small"
                shape="round"
                :loading="pluginDetail.isloading"
                @click="deletePlugin(pluginDetail)"
              >
                {{ $t('feature.installed.remove') }}
              </a-button>
            </div>
          </div>
          <div class="feature-container">
            <template
              :key="index"
              v-for="(item, index) in pluginDetail.features"
            >
              <div
                class="desc-item"
                v-if="item.cmds.filter(cmd => !cmd.label).length > 0"
              >
                <div>{{ item.explain }}</div>
                <template :key="cmd" v-for="cmd in item.cmds">
                  <a-dropdown
                    v-if="!cmd.label"
                    :class="{ executable: !cmd.label }"
                  >
                    <template #overlay>
                      <a-menu @click="({key}) => handleMenuClick(key, item, cmd)">
                        <a-menu-item key="open">
                          <CaretRightOutlined />
                          运行
                        </a-menu-item>
                        <a-menu-item v-if="!hasAdded(cmd)" key="add">
                          <PushpinOutlined />
                          固定到超级面板
                        </a-menu-item>
                        <a-menu-item v-else key="remove">
                          <PushpinFilled />
                          从超级面板中取消固定
                        </a-menu-item>
                      </a-menu>
                    </template>
                    <a-button size="small" class="keyword-tag">
                      {{ cmd.label || cmd }}
                      <DownOutlined />
                    </a-button>
                  </a-dropdown>
                </template>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useStore } from 'vuex';
import { computed, ref, toRaw, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import path from 'path';
import {
  PushpinOutlined,
  PushpinFilled,
  CaretRightOutlined,
  DownOutlined,
} from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';

import emptyJson from '@/assets/lottie/empty.json';

const { ipcRenderer } = window.require('electron');

const remote = window.require('@electron/remote');
const fs = window.require('fs');

const appPath = remote.app.getPath('userData');
const baseDir = path.join(appPath, './rubick-plugins');

const store = useStore();
const route = useRoute();
const router = useRouter();

const localPlugins = computed(() =>
  store.state.localPlugins.filter(
    (plugin) => plugin.name !== 'rubick-system-feature'
  )
);
const updateLocalPlugin = () => store.dispatch('updateLocalPlugin');
const startUnDownload = (name) => store.dispatch('startUnDownload', name);
const errorUnDownload = (name) => store.dispatch('errorUnDownload', name);

const currentSelect = ref([route.query.plugin || localPlugins?.value[0]?.name]);

watch(localPlugins, () => {
  currentSelect.value = [localPlugins?.value[0]?.name];
});

const pluginDetail = computed(() => {
  return (
    localPlugins.value.find((v) => v.name === currentSelect.value[0]) || {}
  );
});

const superPanelPlugins = ref(
  window.rubick.db.get('super-panel-user-plugins') || {
    data: [],
    _id: 'super-panel-user-plugins',
  }
);

const handleMenuClick = (key, item, cmd) => {
  if(key === 'open') {
    openPlugin({
      code: item.code,
      cmd,
    });
  } else if (key === 'add') {
    addCmdToSuperPanel({cmd, code: item.code});
  } else {
    removePluginToSuperPanel({cmd, name: item.name})
  }
};

const addCmdToSuperPanel = ({ cmd, code }) => {
  const plugin = {
    ...toRaw(pluginDetail.value),
    cmd,
    ext: {
      code,
      type: 'text',
      payload: null,
    },
  };
  superPanelPlugins.value.data.push(plugin);
  const { rev } = window.rubick.db.put(JSON.parse(JSON.stringify(superPanelPlugins.value)));
  superPanelPlugins.value._rev = rev;
};

const removePluginToSuperPanel = ({ cmd, name }) => {
  superPanelPlugins.value.data = toRaw(superPanelPlugins.value).data.filter(
    (item) => {
      if (name) return item.name !== name;
      return item.cmd !== cmd;
    }
  );
  const { rev } = window.rubick.db.put(toRaw(superPanelPlugins.value));
  superPanelPlugins.value._rev = rev;
};

const hasAdded = (cmd) => {
  let added = false;
  superPanelPlugins.value.data.some((item) => {
    if (item.cmd === cmd) {
      added = true;
      return true;
    }
    return false;
  });
  return added;
};

const openPlugin = ({ cmd, code }) => {
  window.rubick.openPlugin(
    JSON.parse(
      JSON.stringify({
        ...pluginDetail.value,
        cmd,
        ext: {
          code,
          type: 'text',
          payload: null,
        },
      })
    )
  );
};

const deletePlugin = async (plugin) => {
  startUnDownload(plugin.name);
  const timer = setTimeout(() => {
    errorUnDownload(plugin.name);
    message.error('卸载超时，请重试！');
  }, 20000);
  await window.market.deletePlugin(plugin);
  removePluginToSuperPanel({ name: plugin.name });
  updateLocalPlugin();
  clearTimeout(timer);
};

const gotoFinder = () => {
  router.push('/finder');
  store.commit('commonUpdate', { active: ['finder'] });
};
</script>

<style lang="less" scoped>
.installed {
  box-sizing: border-box;
  width: 100%;
  overflow: hidden;
  height: calc(~'100vh - 34px');
  .view-title {
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 16px;
    color: var(--color-text-primary);
  }
  .view-container {
    border-radius: 8px;
    background: var(--color-body-bg);
    overflow: auto;
    height: calc(~'100vh - 84px');
  }
  :deep(.ant-result-title) {
    color: var(--color-text-primary);
  }
  :deep(.ant-result-subtitle) {
    color: var(--color-text-desc);
  }
  .keyword-tag {
    font-size: 13px;
    margin: 4px;
  }

  .container {
    box-sizing: border-box;
    width: 100%;
    overflow: hidden;
    background: #f3efef;
    height: 100%;
    display: flex;
  }

  .installed-list {
    width: 38%;
    background: var(--color-body-bg);
    height: 100%;
    padding: 10px 0;
    border-right: 1px solid var(--color-border-light);
    overflow: auto;

    .item {
      padding: 10px 20px;
      display: flex;
      align-items: center;
      color: var(--color-text-content);
      border-bottom: 1px dashed var(--color-border-light);
      cursor: pointer;
      &:last-child {
        border-bottom: none;
      }
      img {
        width: 34px;
        height: 34px;
        margin-right: 12px;
      }

      .desc {
        font-size: 12px;
        color: var(--color-text-desc);
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
        -webkit-line-clamp: 2;
        text-overflow: ellipsis;
      }

      &.active {
        color: var(--ant-primary-color);
        background: var(--color-list-hover);
      }
    }
  }

  .plugin-detail {
    padding: 20px 20px 0 20px;
    box-sizing: border-box;
    width: 62%;
    height: 100%;
    background: var(--color-body-bg);
    .plugin-top {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      border-bottom: 1px solid #eee;
      padding-bottom: 12px;
      margin-bottom: 12px;
      .title {
        font-size: 16px;
        display: flex;
        align-items: center;
        color: var(--color-text-primary);
        .ant-tag {
          background: var(--color-input-hover);
          border: 1px solid var(--color-border-light);
          color: var(--color-text-content);
          margin-left: 8px;
        }
      }

      .desc {
        font-size: 13px;
        color: var(--color-text-desc);
      }
    }

    .detail-container,
    .feature-container {
      height: 380px;
      overflow: auto;
      color: var(--color-text-content);
      img {
        width: 100%;
      }
    }

    .desc-item {
      padding: 10px 0;
      color: var(--color-text-content);
      .ant-tag {
        margin-top: 6px;

        &.executable {
          cursor: pointer;
          color: var(--ant-info-color);
          &:hover {
            transform: translateY(-2px);
          }
        }
      }

      .desc-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .desc-info {
        color: var(--color-text-desc);
      }
    }
  }
}
</style>
