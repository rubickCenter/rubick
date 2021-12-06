<template>
  <div class="rubick-select">
    <div class="select-tag" v-show="currentPlugin.cmd">{{ currentPlugin.cmd }}</div>
    <a-input
      id="search"
      class="main-input"
      placeholder="Hi, Rubick2"
      @input="(e) => changeValue(e)"
      @keydown.down="() => emit('changeCurrent', 1)"
      @keydown.up="() => emit('changeCurrent', -1)"
      @keydown="checkNeedInit"
      :value="searchValue"
    >
      <template #suffix>
        <div @click="() => emit('openMenu')" class="suffix-tool" >
          <div class="rubick-logo">
            <img src="../assets/logo.png" />
          </div>
        </div>
      </template>
    </a-input>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref } from "vue";
import { ipcRenderer } from "electron";

const props = defineProps({
  searchValue: {
    type: [String, Number],
    default: "",
  },
  currentPlugin: {},
});

const changeValue = (e) => {
  emit("onSearch", e);
};

const emit = defineEmits(["onSearch", "changeCurrent", "openMenu", "changeSelect"]);

const checkNeedInit = (e) => {
  if (props.searchValue === "" && e.keyCode === 8) {
    closeTag();
  }
};

const closeTag = () => {
  emit("changeSelect", {});
  ipcRenderer.send("msg-trigger", {
    type: "removePlugin",
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
  align-items: center;
  .select-tag {
    white-space: pre;
    user-select: none;
    font-size: 18px;
    border-radius: 16px;
    height: 32px;
    position: relative;
    color: #fff;
    background-color: rgba(255, 78, 164, 0.8);
    display: inline-flex;
    align-items: center;
    margin-right: 1px;
    padding: 0 10px;
  }
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
