<template>
  <div>
    <div v-show="showMain">
      <a-menu :selectedKeys="current" mode="horizontal" @select="changePath">
        <a-menu-item key="market">
          <a-icon type="appstore"/>
          插件中心
        </a-menu-item>
        <a-menu-item key="plugin">
          <a-icon type="heart"/>
          已安装
        </a-menu-item>
        <a-menu-item key="dev">
          <a-icon type="code"/>
          开发者
        </a-menu-item>
        <a-menu-item key="settings">
          <a-icon type="setting"/>
          设置
        </a-menu-item>
      </a-menu>
    </div>
    <router-view v-show="showMain"/>
  </div>
</template>

<script>
import {mapActions, mapState, mapMutations} from 'vuex';

export default {
  name: "search",
  methods: {
    ...mapActions('main', ['onSearch', 'showMainUI']),
    ...mapMutations('main', ['commonUpdate']),
    changePath({key}) {
      this.$router.push({path: `/home/${key}`});
      this.commonUpdate({
        current: [key]
      })
    },
  },
  computed: {
    ...mapState('main', ['showMain', 'current', 'options', 'selected', 'searchValue'])
  }
}
</script>

<style lang="less">
.main-input {
  height: 60px !important;
  flex: 1;

  .ant-select-selection, .ant-input, .ant-select-selection__rendered {
    height: 60px !important;
    font-size: 22px;
    border: none !important;
  }

  .icon-tool {
    font-size: 24px;
    background: #314659;
    color: #fff;
    height: 40px;
    width: 40px;
    border-radius: 100%;
    line-height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
}
</style>
