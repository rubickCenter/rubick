<template>
  <div class="dev">
    <a-alert style="margin-bottom: 40px;" message="rubick 插件系统依托于 npm 管理，本地调试需要先在本地插件当前目录执行 npm link" type="warning" />
    <a-form
      ref="formRef"
      :model="formState"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-item label="插件名称" name="name">
        <a-input v-model:value="formState.name" />
      </a-form-item>

      <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
        <a-button :loading="loading" type="primary" @click="onSubmit">安装</a-button>
        <a-button @click="refresh" style="margin-left: 10px;">刷新插件</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { message } from "ant-design-vue";

const formRef = ref();
const formState = reactive({
  name: undefined,
});
const rules = {
  name: {
    required: true,
    message: "Please input name",
  },
};
const onSubmit = () => {
  formRef.value.validate().then(() => {
    downloadPlugin(formState.name);
  });
};

const loading = ref(false);
const downloadPlugin = async (pluginName) => {
  loading.value = true;
  await window.market.downloadPlugin({
    name: pluginName,
    isDev: true,
  });
  message.success(`${pluginName}安装成功！`);
  loading.value = false;
};

const refresh = () => {
  formRef.value.validate().then(() => {
    window.market.refreshPlugin({
      name: formState.name,
    });
    message.success(`${formState.name}刷新成功！`);
  });
};

const labelCol = { span: 4 };
const wrapperCol = { span: 14 };
</script>

<style lang="less">
.dev {
  box-sizing: border-box;
  width: 100%;
  overflow-x: hidden;
  background: #fff;
  height: calc(~"100vh - 46px");
  padding: 20px;
}
</style>
