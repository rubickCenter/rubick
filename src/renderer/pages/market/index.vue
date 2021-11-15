<template>
  <div class="market">
    <div class="left-menu">
      <a-input-search placeholder="搜索插件" style="width: 180px" @search="onSearch" />
      <a-menu class="market-menu" v-model="current">
        <a-menu-item key="uiPlugin"> <a-icon type="mail" /> UI 类插件 </a-menu-item>
        <a-menu-item key="sysPlugin"> <a-icon type="mail" /> 系统类插件 </a-menu-item>
      </a-menu>
    </div>
    <div class="plugin-container">
      <div v-if="current[0] === 'uiPlugin'">
        <h3 style="margin-bottom: 20px;">推荐</h3>
        <a-list
          item-layout="horizontal"
          style="width: 100%"
          :grid="{ gutter: 16, column: 2 }"
          :data-source="allPlugins.concat(allPlugins)"
        >
          <a-list-item slot="renderItem" slot-scope="item, index">
            <a-button
              v-if="showButton(item)"
              :loading="loading[index]"
              type="link"
              slot="actions"
              @click="download(index, item, 'uiPlugins')"
            >
              <a-icon
                v-show="!loading[index]"
                style="font-size: 20px;"
                type="cloud-download"
              />
            </a-button>

            <a-list-item-meta
              @click="showPannel(item, index)"
              :description="item.description"
            >
              <div slot="title">{{ item.pluginName }}</div>
              <a-avatar slot="avatar" :src="item.logo" />
            </a-list-item-meta>
          </a-list-item>
        </a-list>
      </div>
      <div v-else>
        <h3 style="margin-bottom: 20px;">推荐</h3>
        <a-list
          item-layout="horizontal"
          style="width: 100%"
          :grid="{ gutter: 16, column: 2 }"
          :data-source="sysPlugins"
        >
          <a-list-item slot="renderItem" slot-scope="item, index">
            <a-button
              v-if="showButton(item)"
              :loading="loading[index]"
              type="link"
              slot="actions"
              @click="download(index, item, 'sysPlugins')"
            >
              <a-icon
                v-show="!loading[index]"
                style="font-size: 20px;"
                type="cloud-download"
              />
            </a-button>

            <a-list-item-meta
              @click="showPannel(item, index)"
              :description="item.description"
            >
              <div slot="title">{{ item.pluginName }}</div>
              <a-avatar slot="avatar" :src="item.logo" />
            </a-list-item-meta>
          </a-list-item>
        </a-list>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState, mapActions} from 'vuex'

export default {
  data () {
    return {
      current: ['uiPlugin'],
      loading: {}
    }
  },
  mounted () {
    this.getPlugins()
  },
  methods: {
    onSearch () {
    },
    showButton (item) {
      return !this.uiPlugins.filter(
        (plugin) => plugin.name === item.name
      ).length
    },
    async download (index, item, type) {
      if (this.loading[index]) return
      this.$set(this.loading, index, true)
      try {
        await this.downloadPlugin({
          ...item,
          type
        })
      } catch (e) {
        this.$message.error(e)
      }
      this.$set(this.loading, index, false)
    },
    showPannel () {},
    ...mapActions('market', ['getPlugins']),
    ...mapActions('search', ['downloadPlugin'])
  },
  computed: {
    ...mapState('market', ['allPlugins', 'sysPlugins']),
    ...mapState('search', ['uiPlugins'])
  }
}
</script>

<style lang="less">
  .market {
    display: flex;
    width: 100%;
    .left-menu {
      padding-top: 20px;
      width: 200px;
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 100vh;
      background: #F2EFEF;
    }
    .market-menu {
      width: 200px;
      border: none;
      margin-top: 10px;
      background: #F2EFEF;
    }
    .ant-list-item {
      display: flex !important;
      align-items: center;
      justify-content: space-between;
    }
    .ant-list-item-meta-description {
      width: 150px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .ant-list-item-action {
      margin-left: 0;
    }
    .plugin-container {
      flex: 1;
      background: #fff;
      padding: 20px;
      box-sizing: border-box;
      height: 100vh;
    }
  }
</style>
