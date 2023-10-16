<template>
  <div class="guide-container">
    <div class="step0" v-show="step === 0">
      <div class="title">您好，我叫 Rubick</div>
      <div class="desc">快捷键 <span class="down-line">Alt + R</span> 可以快速打开我</div>
      <div class="img-container">
        <img class="img" src="./assets/img.png" />
        <div class="info">
          <svg class="top-icon" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="NorthIcon"><path d="m5 9 1.41 1.41L11 5.83V22h2V5.83l4.59 4.59L19 9l-7-7-7 7z"></path></svg>
          点击 logo 进入插件市场
        </div>
      </div>
    </div>
    <div class="step0 step1" v-show="step === 1">
      <div class="title">选择需要的插件安装</div>
      <div class="desc">基于 <span class="down-line">npm</span> 的插件包管理，像小程序一样，用完即走</div>
      <div class="img-container">
        <img class="img" src="./assets/img_1.png" />
      </div>
    </div>
    <div class="step0" v-show="step === 2">
      <div class="title"><span class="down-line">关键字</span>搜索应用和插件</div>
      <div class="desc">搜索框内输入关键字可以搜索安装的应用和插件</div>
      <div class="img-container">
        <img class="img" src="./assets/img_2.png" />
      </div>
    </div>
    <div class="step0 step1" v-show="step === 3">
      <div class="title">完全开源免费，支持内网部署</div>
      <div class="desc">进入插件市场的 <span class="down-line">账户与设置</span> 菜单，进行内网部署设置</div>
      <div class="img-container">
        <img class="img" src="./assets/img_3.png" />
      </div>
    </div>
    <div class="footer">
      <div></div>
      <div class="step">
        <span class="step-num">{{ step + 1 }} / 4</span>
        <div class="button" @click="netStep">{{ step + 1 === 4 ? '完成' : '下一步' }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const step = ref(0);
const { ipcRenderer } = window.require('electron');

const netStep = () => {
  if (step.value >= 3) {
    return ipcRenderer.send('guide:service', { type: 'close' });
  }
  step.value = step.value + 1;
}


</script>

<style lang="less">
@text-color: #574777; // 全局主色
@primary-color: #ff4ea4; // 全局主色

* {
  margin: 0;
  padding: 0;
}
.guide-container {
  .step0 {
    padding: 28px;
    padding-top: 36px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    width: 100vw;
    height: 100vh;
  }
  .title {
    font-size: 28px;
    font-weight: 600;
    color: @text-color;
  }
  .down-line {
    line-height: 24px;
    color: @primary-color;
  }
  .desc {
    padding-top: 10px;
    box-sizing: border-box;
    font-size: 24px;
  }
  .img-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .img {
    width: 680px;
  }
  .info {
    padding-top: 42px;
    margin-left: 84px;
    box-sizing: border-box;
    text-align: left;
    position: relative;
    align-self: flex-start;
    color: @text-color;
    .top-icon {
      position: absolute;
      left: 0;
      top: 0;
      user-select: none;
      width: 1em;
      height: 1em;
      display: inline-block;
      fill: currentcolor;
      flex-shrink: 0;
      transition: fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
      font-size: 1.5rem;
    }
  }
}
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  box-sizing: border-box;
  .step {
    display: flex;
    align-items: center;
  }
  .step-num {
    margin-right: 20px;
  }
  .button {
    width: 100px;
    height: 40px;
    line-height: 40px;
    background: @primary-color;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    cursor: pointer;
    user-select: none;
  }
}

.step4 {
  .img {
    width: 300px;
  }
}
.step1 {
  .img {
    width: 550px;
  }
}
</style>
