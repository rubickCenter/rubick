<template>
  <div class="rubick-select">
    <a-input
      class="main-input"
      placeholder="Hi, Rubick2"
      @change="(e) => emit('onSearch', e)"
      @keydown.down="() => emit('changeCurrent', 1)"
      @keydown.up="() => emit('changeCurrent', -1)"
    >
      <template #suffix>
        <div @click="openMenu" class="suffix-tool" >
          <div class="rubick-logo">
            <img src="../assets/logo.png" />
          </div>
        </div>
      </template>
    </a-input>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, toRaw } from "vue";
import { ipcRenderer } from "electron";

const props = defineProps({
  menuPluginInfo: {},
});

const emit = defineEmits(["onSearch", "changeCurrent"]);

const openMenu = async () => {
  ipcRenderer.sendSync("msg-trigger", {
    type: "openPlugin",
    plugin: toRaw(props.menuPluginInfo),
  });
};
</script>

<style lang="less">
.rubick-select {
  display: flex;
  padding-left: 10px;
  background: #fff;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  .main-input {
    height: 60px !important;
    box-sizing: border-box;
    flex: 1;
    border: none;
    outline: none;
    box-shadow: none !important;
    .ant-select-selection, .ant-input, .ant-select-selection__rendered {
      height: 100% !important;
      font-size: 22px;
      border: none !important;
    }
  }
  .rubick-logo {
    width: 40px;
    height: 40px;
    background: #574778;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 100%;
    img {
      width: 32px;
    }
  }
  .ant-input:focus {
    border: none;
    box-shadow: none;
  }
}
</style>
