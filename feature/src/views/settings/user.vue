<template>
  <div class="account">
    <!-- todo 暂时先去掉登录，等小程序做好了再加回来吧 -->
<!--    <a-result-->
<!--      v-if="!userInfo"-->
<!--      title="请先登录"-->
<!--      sub-title="登录后可开启用户个性化设置"-->
<!--    >-->
<!--      <template #extra>-->
<!--        <a-button @click="showModal" type="primary">-->
<!--          使用微信小程序登录-->
<!--        </a-button>-->
<!--      </template>-->
<!--    </a-result>-->
    <Index />
    <a-modal :footer="null" v-model:visible="visible">
      <a-result
        title="请使用微信扫码登录!"
        sub-title="使用微信扫描上面的 rubick 小程序二维码进行授权登录"
      >
        <template #icon>
          <img width="200" :src="imgCode" />
        </template>
      </a-result>
    </a-modal>
  </div>
</template>

<script setup>
import { nanoid } from 'nanoid';
import { ref, watch } from 'vue';
import { message } from 'ant-design-vue';
import Index from './index';
import service from '../../assets/service';

const userInfo = ref(window.rubick.dbStorage.getItem('rubick-user-info'));

const imgCode = ref('');
const scene = nanoid();

const visible = ref(false);
const showModal = () => {
  visible.value = true;
  if (!imgCode.value && !userInfo.value) {
    service.getScanCode({ scene }).then((res) => {
      imgCode.value = `data:image/png;base64,${res.dataUrl}`;
    });
  }
};

let timer = null;
watch([visible], () => {
  if (visible.value) {
    timer = setInterval(() => {
      service.checkLoginStatus({ scene }).then((res) => {
        console.log(res);
        if (res.openId) {
          window.rubick.dbStorage.setItem('rubick-user-info', res);
          userInfo.value = res;
          message.success('登录成功！');
          visible.value = false;
          clearInterval(timer);
          timer = null;
        }
      });
    }, 2000);
  } else {
    clearInterval(timer);
    timer = null;
  }
});
</script>

<style lang="less" scoped>
.account {
  box-sizing: border-box;
  width: 100%;
  overflow-x: hidden;
  background: var(--color-body-bg);
  :deep(.ant-result-title) {
    color: var(--color-text-primary);
  }
  :deep(.ant-result-subtitle) {
    color: var(--color-text-desc);
  }
}
</style>
