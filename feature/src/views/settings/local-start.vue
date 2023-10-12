<template>
  <div class="file-container" @drop.prevent="dropFile" @dragenter="checkDrop" @dragover="checkDrop">
    <a-alert message="可拖放文件夹到这里加入启动" type="info" show-icon />
    <a-list item-layout="horizontal" :data-source="localStartList">
      <template #renderItem="{ item }">
        <a-list-item>
          <template #actions>
            <a key="list-loadmore-edit" @click="() => remove(item)">移除</a>
          </template>
          <a-list-item-meta :description="item.desc">
            <template #title>
              <div>
                <span :class="item.del ? 'del-title' : ''">{{item.name}}</span>
                <span v-if="item.del" class="has-del">文件不存在</span>
              </div>
            </template>
            <template #avatar>
              <a-avatar shape="square" :src="item.icon" />
            </template>
          </a-list-item-meta>
        </a-list-item>
      </template>
    </a-list>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const fs = window.require('fs');
const process = window.require('process');

const dbId = 'rubick-local-start-app';

const localStartList = ref(window.rubick.dbStorage.getItem(dbId) || []);

const checkFileExists = () => {
  localStartList.value = localStartList.value.map((plugin) => {
    if (!fs.existsSync(plugin.desc)) {
      return {
        ...plugin,
        del: true,
      };
    }
    return plugin;
  });
};

checkFileExists();

const dropFile = (e) => {
  const files = Array.from(e.dataTransfer.files).map((file) => {
    const action =
      process.platform === 'win32'
        ? `start "dummyclient" "${file.path}"`
        : `open ${file.path.replace(/ /g, '\\ ')}`;
    const plugin = {
      icon: window.rubick.getFileIcon(file.path),
      value: 'plugin',
      desc: file.path,
      pluginType: 'app',
      name: file.name,
      action,
      keyWords: [file.name],
      names: [file.name],
    };
    window.market.addLocalStartPlugin(plugin);
    return plugin;
  });
  localStartList.value = [
    ...localStartList.value,
    ...files,
  ];
  window.rubick.dbStorage.setItem(
    dbId,
    JSON.parse(JSON.stringify(localStartList.value))
  );
};

const remove = (item) => {
  localStartList.value = localStartList.value.filter(
    (app) => app.desc !== item.desc
  );
  window.rubick.dbStorage.setItem(
    dbId,
    JSON.parse(JSON.stringify(localStartList.value))
  );
  window.market.removeLocalStartPlugin(JSON.parse(JSON.stringify(item)));
};

const checkDrop = (e) => {
  e.preventDefault();
};
</script>

<style lang="less">
.file-container {
  box-sizing: border-box;
  width: 100%;
  overflow-x: hidden;
  background: var(--color-body-bg);
  height: calc(~'100vh - 180px');
  .del-title {
    text-decoration-line: line-through;
    text-decoration-color: var(--ant-error-color);
  }
  .has-del {
    color: var(--ant-error-color);
    font-size: 12px;
    margin-left: 6px;
  }
}
</style>