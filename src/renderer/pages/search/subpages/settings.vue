<template>
  <div class="pg-settings">
    <div class="dev-detail">
      <a-menu v-model="currentSelect" style="width: 256px; height: 100%" mode="vertical">
        <a-menu-item :key="0">
          偏好设置
        </a-menu-item>
        <a-menu-item :key="1">
          超级面板
        </a-menu-item>
      </a-menu>
      <div class="settings-detail">
        <div v-if="currentSelect[0] === 0">
          <div class="setting-item">
            <div class="title">快捷键</div>
            <div class="settings-item-li">
              <div class="label">显示/隐藏快捷键</div>
              <div class="value" tabIndex=-1 @keydown="(e) => changeShortCut(e, 'showAndHidden')">{{ config.perf.shortCut.showAndHidden }}</div>
            </div>
            <div class="settings-item-li">
              <div class="label">插件分离快捷键</div>
              <div class="value" tabIndex=-1 @keydown="(e) => changeShortCut(e, 'separate')">{{ config.perf.shortCut.separate }}</div>
            </div>
          </div>
          <div class="setting-item">
            <div class="title">通用</div>
            <div class="settings-item-li">
              <div class="label">开机启动</div>
              <a-switch v-model:checked="config.perf.common.start" checked-children="开" un-checked-children="关"></a-switch>
            </div>
            <div class="settings-item-li">
              <div class="label">空格执行</div>
              <a-switch v-model:checked="config.perf.common.space" checked-children="开" un-checked-children="关"></a-switch>
            </div>
          </div>
          <div class="setting-item">
            <div class="title">本地搜索启动</div>
            <div class="settings-item-li">
              <div class="label">搜索启动应用&文件</div>
              <a-switch v-model:checked="config.perf.local.search" checked-children="开" un-checked-children="关"></a-switch>
            </div>
          </div>
        </div>
        <div  v-if="currentSelect[0] === 1">
          <div class="setting-item">
            <div class="title">弹出面板</div>
            <a-select value="mouseRight" style="width: 200px" disabled>
              <a-select-option value="mouseRight">长按鼠标右键</a-select-option>
            </a-select>
          </div>
          <div class="setting-item">
            <div class="title">长按以下设置的毫秒响应</div>
            <a-slider :step="100" v-model:value="config.superPanel.mouseDownTime" :min="200" :max="1000" />
          </div>
          <div class="setting-item">
            <div class="title">百度搜索配置</div>
            <a-form :label-col="{ span: 3 }" :wrapper-col="{ span: 14 }">
              <a-form-item label="appid">
                <a-input v-model:value="config.superPanel.baiduAPI.appid" />
              </a-form-item>
              <a-form-item label="key">
                <a-input v-model:value="config.superPanel.baiduAPI.key" />
              </a-form-item>
            </a-form>
          </div>
          <img width="100%" src="https://static.91jkys.com/upload/202107/02/fa4a5c614234409fb32ddda70cb900aa.jpg" />
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import keycodes from '../../../assets/keycode';
import {ipcRenderer, remote} from 'electron';

const opConfig = remote.getGlobal('opConfig');

export default {
  data() {
    return {
      currentSelect: [0],
      config: JSON.parse(JSON.stringify(opConfig.get())),
    }
  },
  methods: {
    changeShortCut(e, key) {
      let change = false;
      if(e.altKey && e.keyCode !== 18){
        const compose = `Option+${keycodes[e.keyCode].toUpperCase()}`;
        this.config.perf.shortCut[key] = compose;
        change = true;
      }
      if(e.ctrlKey && e.keyCode !== 17){
        const compose = `Ctrl+${keycodes[e.keyCode].toUpperCase()}`;
        this.config.perf.shortCut[key] = compose;
        change = true;
      }
      if(e.shiftKey && e.keyCode !== 16){
        const compose = `Shift+${keycodes[e.keyCode].toUpperCase()}`;
        this.config.perf.shortCut[key] = compose;
        change = true;
      }
      if(e.metaKey && e.keyCode !== 93){
        const compose = `Command+${keycodes[e.keyCode].toUpperCase()}`;
        this.config.perf.shortCut[key] = compose;
        change = true;
      }
    }
  },
  watch: {
    config: {
      deep: true,
      handler() {
        opConfig.set('perf', this.config.perf);
        opConfig.set('superPanel', this.config.superPanel);
        ipcRenderer.send('re-register');
      }
    }
  }
}
</script>

<style lang="less">
  .pg-settings {
    height: calc(~'100vh - 110px');
    overflow: auto;
    .dev-detail {
      height: 100%;
      display: flex;
      align-items: flex-start;
      background: #fff;
    }
    .settings-detail {
      padding: 20px;
      box-sizing: border-box;
      flex: 1;
      overflow: auto;
      height: 100%;
      .setting-item {
        margin-bottom: 20px;
        .ant-form-item {
          margin-bottom: 0;
        }
        .title {
          color: #6C9FE2;
          font-size: 15px;
          margin-bottom: 10px;
        }
        .settings-item-li {
          padding-left: 20px;
          display: flex;
          width: 100%;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
          .label {
            color: #646464;
          }
          .value {
            width: 300px;
            text-align: center;
            border: 1px solid #ddd;
            color: #6C9FE2;
            font-size: 14px;
            height: 24px;
            font-weight: lighter;
          }
        }
      }
    }
  }
</style>
