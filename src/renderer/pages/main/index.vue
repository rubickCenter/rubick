<template>
  <div
    tabindex="1"
    class="search-content"
    @keydown.down="(e) => changeCurrent(1)"
    @keydown.up="() => changeCurrent(-1)"
  >
    <div class="top-search">
      <a-input
        @change="(e) => search(e.target.value)"
        class="main-search"
        placeholder="搜索"
      />
      <div class="subfix">
      </div>
    </div>
    <div
      class="main-content"
    >
      <div class="search-container">
        <a-skeleton
          v-for="i in 7"
          active
          class="list-skeleton"
          v-if="!currentPlugin"
          :avatar="{
          shape: 'square',
          size: 30
        }"
          :paragraph="{
          rows: 1,
        }"
        >
        </a-skeleton>
        <div class="search-list" v-if="currentPlugin">
          <div
            :class="currentIndex === index ? 'search-item active' : 'search-item'"
            :key="index"
            v-for="(plugin, index) in searchList"
            @click="currentIndex = index"
            @dblclick="openPluginMs(index)"
          >
            <img :src="plugin.icon" />
            <div class="desc">
              <div class="title" v-html="renderTitle(plugin.name)"></div>
              <div class="path">{{getPath(plugin.desc)}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="detail-container">
        <a-skeleton
          active
          class="detail-skeleton"
          :loading="!currentPlugin"
          :title="{width: 100}"
          :paragraph="{
          rows: 6,
          width: [100, 360, 360, 360, 360, 360]
        }"
        >
          <div class="detail-container" v-if="!!currentPlugin">
            <img :src="currentPlugin.icon">
            <div class="title">{{currentPlugin.name}}</div>
            <div class="summary">
              <div class="app-item">
                <div class="label">文件路径</div>
                <div class="detail">{{currentPlugin.desc}}</div>
              </div>
              <div class="app-item">
                <div class="label">应用版本</div>
                <div class="detail">{{ currentPlugin.version }}</div>
              </div>
              <div class="app-item">
                <div class="label">安装源</div>
                <div class="detail">{{currentPlugin.obtained_from}}</div>
              </div>
              <div class="app-item">
                <div class="label">最近修改时间</div>
                <div class="detail">{{ currentPlugin.lastModified | formatDate }}</div>
              </div>
              <div class="app-item" v-show="currentPlugin.info">
                <div class="label">描述信息</div>
                <div class="detail">{{currentPlugin.info}}</div>
              </div>
            </div>
          </div>
        </a-skeleton>
      </div>
    </div>
  </div>

</template>

<script>
import {mapState, mapActions} from 'vuex'
import dayjs from 'dayjs'

import {debounce} from '../../../common/utils'

export default {
  data () {
    return {
      searchValue: '',
      currentIndex: 0,
      ding: false,
      searchFn: null
    }
  },
  methods: {
    ...mapActions('search', ['openPlugin', 'onSearch']),
    renderTitle (title) {
      if (typeof title !== 'string') return
      if (!this.searchValue) return title
      const result = title.toLowerCase().split(this.searchValue.toLowerCase())
      if (result && result.length > 1) {
        return `<div>${result[0]}<span style="color: red">${this.searchValue}</span>${result[1]}</div>`
      } else {
        return `<div>${result[0]}</div>`
      }
    },
    changeCurrent (index) {
      if (this.currentIndex + index > this.searchList.length - 1 || this.currentIndex + index < 0) {
        return
      }
      this.currentIndex = this.currentIndex + index
    },
    openPluginMs (index) {
      setTimeout(() => {
        this.openPlugin(this.currentPlugin)
      }, 10)
    },
    /**
     * 路径显示，超出34个字符，中间显示省略号
     * @param path
     * @returns {string|*}
     */
    getPath (path) {
      if (path.length > 34) {
        return `${path.substr(0, 17)}...${path.substr(path.length - 14, path.length)}`
      }
      return path
    },
    search (value) {
      if (!this.searchFn) {
        this.searchFn = debounce(this.onSearch, 200)
      }
      this.searchFn(value)
    }
  },
  computed: {
    ...mapState('search', ['searchList']),
    currentPlugin () {
      return this.searchList[this.currentIndex]
    }
  },
  filters: {
    formatDate (time) {
      return dayjs(time).format('YYYY/MM/DD hh:mm:ss')
    }
  }
}
</script>

<style lang="less">
::-webkit-scrollbar {
  display: none;
}
.search-content {
  .top-search {
    -webkit-app-region: drag;
    width: 100%;
    padding: 15px 15px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #ddd;
    .main-search {
      width: 100%;
      border: none;
      padding: 0 !important;
      font-size: 18px;
      height: 24px;
      background: #F2EFEF;
      -webkit-app-region: no-drag;
      box-shadow: none !important;
    }
    .subfix {
      display: flex;
      align-items: center;
      margin-left: 10px;
      -webkit-app-region: no-drag;
      .active, .normal {
        font-size: 16px;
        color: #ddd;
      }
      .active {
        color: #ff4ea4;
      }
    }

  }
}
.main-content {
  display: flex;
  align-items: center;
  outline: none;
  .search-container {
    width: 300px;
    border-right: 1px solid #ddd;
    height: calc(~'100vh - 58px');
    padding-top: 10px;
    position: relative;
    .loading {
      position: absolute;
      top: 100px;
      left: 50%;
      transform: translateX(-50%);
    }
    .list-skeleton {
      padding: 10px 20px;
      .ant-skeleton-title {
        margin-top: 0 !important;
      }
      .ant-skeleton-paragraph {
        margin-top: 10px !important;
      }
    }
    .search-list {
      height: 100%;
      overflow: auto;
      &.list-skeleton {
        padding: 0;
      }
      .search-item {
        display: flex;
        align-items: center;
        margin: 0 10px;
        padding: 10px;
        border-radius: 8px;
        box-sizing: border-box;
        &:hover {
          background: rgba(0,0,0,0.1);
        }
        &.active {
          background: #307AFF;
          .title, .path {
            color: #fff !important;
          }
        }
        img {
          width: 30px;
          height: 30px;
          margin-right: 6px;
        }
        .desc {
          .title {
            font-size: 16px;
            color: #000;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
            width: 220px;
          }
          .path {
            color: #999;
            font-size: 12px;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
            width: 220px;
          }
        }
      }
    }
  }
  .detail-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 440px;
    .detail-skeleton {
      width: 360px;
      .ant-skeleton-paragraph, .ant-skeleton-content {
        display: flex;
        align-items: center;
        flex-direction: column;
      }
      .ant-skeleton-title {
        height: 100px !important;
      }
    }

    img {
      width: 100px;
      height: 100px;
    }
    .summary {
      margin-top: 20px;
      width: 360px;
      .app-item {
        border-bottom: 1px solid #ddd;
        padding: 10px 0;
        font-size: 12px;
        display: flex;
        justify-content: space-between;
        .label {
          color: #999;
          width: 100px;
        }
        .detail {
          flex: 1;
          color: #000;
          text-align: right;
        }
      }
    }
    .title {
      margin-top: 30px;
      font-size: 20px;
      color: #000;
    }
    .desc {
      color: #999;
      font-size: 14px;
    }
  }
}
</style>
