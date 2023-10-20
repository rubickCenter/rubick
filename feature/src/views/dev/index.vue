<template>
  <div class="dev">
    <div class="view-title">{{ $t('feature.dev.title') }}</div>
    <div class="view-container">
      <a-alert
        style="margin-bottom: 40px"
        :message="$t('feature.dev.tips')"
        type="warning"
      />
      <a-form
        ref="formRef"
        :model="formState"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-item :label="$t('feature.dev.pluginName')" name="name">
          <a-input v-model:value="formState.name" />
        </a-form-item>
    
        <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
          <a-button :loading="loading" type="primary" @click="onSubmit">
            {{ $t('feature.dev.install') }}
          </a-button>
          <a-button @click="refresh" style="margin-left: 10px">
            {{ $t('feature.dev.refreshPlugins') }}
          </a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { message } from 'ant-design-vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const formRef = ref();
const formState = reactive({
  name: undefined,
});
const rules = {
  name: {
    required: true,
    message: 'Please input name',
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
  message.success(t('feature.dev.installSuccess', { pluginName: pluginName }));
  loading.value = false;
};

const refresh = () => {
  formRef.value.validate().then(() => {
    window.market.refreshPlugin({
      name: formState.name,
    });
    message.success(
      t('feature.dev.refreshSuccess', { pluginName: formState.name })
    );
  });
};

const labelCol = { span: 4 };
const wrapperCol = { span: 14 };
</script>

<style lang="less" scoped>
.dev {
  box-sizing: border-box;
  width: 100%;
  overflow-x: hidden;
  height: calc(~'100vh - 34px');
  .view-title {
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 16px;
    color: var(--color-text-primary);
  }
  .view-container {
    padding: 10px;
    box-sizing: border-box;
    border-radius: 8px;
    background: var(--color-body-bg);
    overflow: auto;
    height: calc(~'100vh - 84px');
  }
  :deep(label) {
    color: var(--color-text-content);
  }
  :deep(.ant-input) {
    background: var(--color-input-hover) !important;
    color: var(--color-text-content);
  }
}
</style>
