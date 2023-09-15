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
              <div>{{item.name}}</div>
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
const dbId = 'rubick-local-start-app';

const localStartList = ref(window.rubick.dbStorage.getItem(dbId) || []);

const dropFile = (e) => {
  const files = Array.from(e.dataTransfer.files).map((file) => {
    const plugin = {
      icon: window.rubick.getFileIcon(file.path),
      value: 'plugin',
      desc: file.path,
      pluginType: 'app',
      name: file.name,
      action: `open ${file.path.replace(/ /g, '\\ ')}`,
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
  window.rubick.dbStorage.setItem(dbId, JSON.parse(JSON.stringify(localStartList.value)));
};

const remove = (item) => {
  localStartList.value = localStartList.value.filter(app => app.desc !== item.desc);
  window.rubick.dbStorage.setItem(dbId, JSON.parse(JSON.stringify(localStartList.value)));
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
  height: calc(~'100vh - 106px');
}
</style>