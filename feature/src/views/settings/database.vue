<template>
  <div class="export-header">
    <a-button @click="exportData" size="small" type="primary" style="margin-right: 10px;">
      导出数据
      <template #icon>
        <ExportOutlined />
      </template>
    </a-button>
    <a-button @click="importData" danger size="small" style="margin-right: 10px; background-color: var(--color-input-hover)">
      导入数据
      <template #icon>
        <ImportOutlined />
      </template>
    </a-button>
    <a-button type="link" size="small" @click="showSetting = true">
      <template #icon>
        <SettingOutlined />
      </template>
    </a-button>
  </div>
  <a-list item-layout="horizontal" :data-source="dataPlugins">
    <template #renderItem="{ item }">
      <a-list-item>
        <template #actions>
          <a v-if="!item.plugin?.isdownload && !item.plugin?.isloading" key="list-loadmore-edit"
             @click="() => downloadPlugin(item.plugin)">
            <CloudDownloadOutlined style="font-size: 18px;"/>
          </a>
          <a v-if="item.plugin?.isloading" key="list-loadmore-edit">
            <LoadingOutlined style="font-size: 18px;"/>
          </a>
          <a key="list-loadmore-edit" @click="() => showKeys(item)">
            <DatabaseOutlined style="font-size: 18px;"/>
          </a>
        </template>
        <a-list-item-meta>
          <template #title>
            <div style="color: var(--color-text-content)">
              <span>{{ item.plugin?.pluginName }}</span>
            </div>
          </template>
          <template #avatar>
            <a-avatar shape="square" :src="item.plugin?.logo"/>
          </template>
          <template #description>
            <div style="color: var(--color-text-desc)">
              <span>{{ item.keys.length }} 份文档</span>
            </div>
          </template>
        </a-list-item-meta>
      </a-list-item>
    </template>
  </a-list>
  <a-drawer
    v-model:visible="open"
    width="400"
    :closable="false"
    :title="currentSelect.plugin.pluginName"
    placement="right"
    class="exportDrawer"
  >
    <p
      class="key-item"
      :key="key"
      @click="() => showDetail(key)"
      v-for="key in currentSelect.keys"
    >
      {{ key }}
    </p>
  </a-drawer>
  <a-modal
    centered
    :bodyStyle="{
      maxHeight: '500px',
      overflow: 'auto',
      backgroundColor: 'var(--color-body-bg)',
      color: 'var(--color-text-primary)'
    }"
    :footer="null"
    :closable="false"
    v-model:visible="show"
  >
    <pre>{{ JSON.stringify(detail, null, 2) }}</pre>
  </a-modal>
  <a-modal
    v-model:visible="showSetting"
    title="webdav 账户配置"
    :footer="null"
    class="webdavModel"
  >
    <a-alert v-if="formState.suport === 'jianguo'" style="margin-bottom: 20px;" type="info" show-icon>
      <template #message>
        <div
          @click="openHelp"
          class="openHelp">
          点击查看如何获取坚果云账号密码
        </div>
      </template>
    </a-alert>
    <a-form
      :model="formState"
      name="basic"
      :label-col="{ span: 8 }"
      :wrapper-col="{ span: 16 }"
      autocomplete="off"
      @finish="handleOk"
    >
      <a-form-item
        label="webdav 提供商"
        name="suport"
      >
        <a-select v-model:value="formState.suport">
          <a-select-option value="jianguo">坚果云</a-select-option>
          <a-select-option value="auto">自定义</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        label="服务器地址"
        name="url"
        v-show="formState.suport === 'auto'"
        :rules="[{ required: true, message: '请填写服务器地址!' }]"
      >
        <a-input v-model:value="formState.url" />
      </a-form-item>
      <a-form-item
        label="账户"
        name="username"
        :rules="[{ required: true, message: '请填写 username!' }]"
      >
        <a-input v-model:value="formState.username" />
      </a-form-item>
      <a-form-item
        label="密码"
        name="password"
        :rules="[{ required: true, message: '请填写 password!' }]"
      >
        <a-input-password v-model:value="formState.password" />
      </a-form-item>
      <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
        <a-button type="primary" html-type="submit">保存设置</a-button>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script setup>
import { useStore } from 'vuex';
import { computed, ref, reactive } from 'vue';
import {
  DatabaseOutlined,
  CloudDownloadOutlined,
  LoadingOutlined,
  ExportOutlined,
  ImportOutlined,
  SettingOutlined,
} from '@ant-design/icons-vue';
import { message, Modal } from 'ant-design-vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const open = ref(false);
const show = ref(false);
const showSetting = ref(false);
const currentSelect = ref({ plugin: {} });
const detail = ref({});

const defaultConfig = window.rubick.dbStorage.getItem(
  'rubick-db-jg-webdav'
) || {
  url: 'https://dav.jianguoyun.com/dav/',
  username: '',
  password: '',
};

if (!defaultConfig.suport) {
  defaultConfig.suport = 'jianguo';
}

const formState = reactive(defaultConfig);

const showKeys = (item) => {
  open.value = true;
  currentSelect.value = item;
};

const handleOk = () => {
  window.rubick.dbStorage.setItem(
    'rubick-db-jg-webdav',
    JSON.parse(JSON.stringify(formState))
  );
  message.success('保存成功');
  showSetting.value = false;
};

const showDetail = (key) => {
  show.value = true;
  detail.value = window.rubick.db.get(key);
};

const exportData = () => {
  if (!formState.password || !formState.username) {
    return showSetting.value = true;
  }
  window.market.dbDump(JSON.parse(JSON.stringify(formState)));
};

const importData = () => {
  if (!formState.password || !formState.username) {
    return showSetting.value = true;
  }
  Modal.confirm({
    title: '导入确认',
    content: '导入坚果云数据将会覆盖本地数据，是否确认导入？',
    onOk() {
      window.market.dbImport(JSON.parse(JSON.stringify(formState)));
    },
  });
};

const openHelp = () => {
  window.rubick.shellOpenExternal('https://help.jianguoyun.com/?p=2064');
};

const store = useStore();

const pluginsData = window.rubick.db.get('RUBICK_PLUGIN_INFO');

const totalPlugins = computed(() => store.state.totalPlugins);

const dataPlugins = computed(() => {
  if (!pluginsData) return [];
  return pluginsData.data.map((item) => {
    let plugin = null;
    if (['rubick-system-feature'].includes(item.name)) {
      plugin = {
        pluginName: '主程序',
        isdownload: true,
        logo: require('../../assets/logo.png'),
      };
    } else {
      plugin = totalPlugins.value.find((p) => p.name === item.name);
    }
    const data = item.keys.map((key) => window.rubick.db.get(key));
    return {
      ...item,
      plugin,
      data,
    };
  });
});

const startDownload = (name) => store.dispatch('startDownload', name);
const successDownload = (name) => store.dispatch('successDownload', name);

const downloadPlugin = async (plugin) => {
  startDownload(plugin.name);
  await window.market.downloadPlugin(plugin);
  message.success(t('feature.dev.installSuccess', { pluginName: plugin.name }));
  successDownload(plugin.name);
};
</script>
<style lang="less">
.openHelp {
  cursor: pointer;
  text-decoration: underline;
}
.export-header {
  width: 100%;
  height: 40px;
  border-bottom: 1px solid var(--color-border-light);
  text-align: right;
}
.key-item {
  cursor: pointer;

  &:hover {
    color: var(--ant-primary-color);
  }
}
.exportDrawer{
  .ant-drawer-header{
    background-color: var(--color-body-bg);
    border-bottom: 1px solid var(--color-border-light);
    .ant-drawer-title{
      color: var(--color-text-primary);
    }
  }
  .ant-drawer-body{
    background-color: var(--color-body-bg);
    color: var(--color-text-content)
  }
}
.webdavModel{
  .ant-modal-close-x{
    color: var(--color-text-content);
  }
  .ant-modal-header{
    background-color: var(--color-body-bg);
    border-bottom: 1px solid var(--color-border-light);
    .ant-modal-title{
      color: var(--color-text-primary);
    }
  }
  .ant-form-item-label>label {
    color: var(--color-text-content);
  }
  .ant-modal-body {
    background-color: var(--color-body-bg);
    .ant-input,
    .ant-input-password,
    .ant-select-selector {
      background: var(--color-input-hover) !important;
      color: var(--color-text-content);
    }
    .ant-input-password-icon, .ant-select-arrow {
      color: var(--color-action-color);
     }
  }
}
</style>