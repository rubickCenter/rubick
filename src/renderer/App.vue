<template>
  <a-layout id="components-layout-demo-custom-trigger">
    <div class="rubick-select">
      <div class="tag-container" v-if="selected">
        <a-tag
            :key="selected.key"
            @close="closeTag"
            class="select-tag"
            color="green"
            closable
        >
          {{ selected.name }}
        </a-tag>
      </div>
      <a-input
          id="search"
          placeholder="Hi, Rubick"
          class="main-input"
          @change="onSearch"
          :value="searchValue"
          :maxLength="selected ? 0 : 1000"
      >
        <a-icon class="icon-tool" type="tool" slot="suffix" @click="() => {
          showMainUI();
          changePath({key: 'market'})
        }"/>
        }
      </a-input>
      <div class="options" v-show="showOptions">
        <a-list item-layout="horizontal" :data-source="options">
          <a-list-item @click="() => item.click($router)" class="op-item"  slot="renderItem" slot-scope="item, index">
            <a-list-item-meta
                :description="item.desc"
            >
              <span slot="title" >{{ item.name }}</span>
              <a-avatar
                  slot="avatar"
                  src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
              />
            </a-list-item-meta>
          </a-list-item>
        </a-list>
      </div>
    </div>
    <router-view></router-view>
  </a-layout>
</template>
<script>
import {mapActions, mapMutations, mapState} from "vuex";
import {ipcRenderer} from "electron";
import {getWindowHeight} from "./assets/common/utils";

export default {
  mounted() {
    document.getElementById('search').addEventListener('keydown', this.checkNeedInit)
  },
  beforeDestroy() {
  },
  methods: {
    ...mapActions('main', ['onSearch', 'showMainUI']),
    ...mapMutations('main', ['commonUpdate']),
    checkNeedInit(e) {
      if (this.searchValue === '' && e.keyCode === 8) {
        this.closeTag();
      }
    },
    changePath({key}) {
      this.$router.push({path: `/home/${key}`});
      this.commonUpdate({
        current: [key]
      })
    },
    closeTag(v) {
      this.commonUpdate({
        selected: null,
        showMain: false,
      });
      ipcRenderer.send('changeWindowSize', {
        height: getWindowHeight([]),
      });
      this.$router.push({
        path: '/home',
      });
    }
  },
  computed: {
    ...mapState('main', ['showMain', 'current', 'options', 'selected', 'searchValue']),
    showOptions() {
      // 有选项值，且不在显示主页
      if (this.options.length && !this.showMain) {
        return true;
      }
    }
  }
};
</script>
<style lang="scss">
* {
  margin: 0;
  padding: 0;
}
</style>
