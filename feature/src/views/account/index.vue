<template>
  <div class="account">
    <a-result status="404" title="玩命开发中" sub-title="个人中心正在开发中，敬请期待...">
    </a-result>
  </div>
</template>

<script>
export default {
};
</script>

<style lang="less" scoped>
.account {
  box-sizing: border-box;
  width: 100%;
  overflow-x: hidden;
  background: var(--color-body-bg);
  height: calc(~"100vh - 46px");
  :deep(.ant-result-title) {
    color: var(--color-text-primary);
  }
  :deep(.ant-result-subtitle) {
    color: var(--color-text-desc);
  }
}
</style>
