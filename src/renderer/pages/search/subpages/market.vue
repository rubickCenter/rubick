<template>
  <div class="market">
    <a-carousel v-if="bannerList && !!bannerList.length" arrows>
      <div
          slot="prevArrow"
          slot-scope="props"
          class="custom-slick-arrow"
          style="left: 10px;zIndex: 1"
      >
        <a-icon type="left-circle" />
      </div>
      <div slot="nextArrow" slot-scope="props" class="custom-slick-arrow" style="right: 10px">
        <a-icon type="right-circle" />
      </div>
      <div v-for="banner in bannerList">
        <img width="100%" :src="banner.src" />
      </div>
    </a-carousel>
    <a-divider v-if="bannerList && !!bannerList.length"></a-divider>
    <h2>插件</h2>
    <a-list item-layout="horizontal" style="width: 100%" :grid="{ gutter: 16, column: 2 }" :data-source="pluginList">
      <a-list-item slot="renderItem" slot-scope="item, index">
        <a-button v-if="showButton(item)" :loading="loading[index]" type="link" slot="actions" @click="download(index, item)">
          <a-icon v-show="!loading[index]" style="font-size: 20px;" type="cloud-download" />
        </a-button>


        <a-list-item-meta
            @click="showPannel(item, index)"
            :description="item.description"
        >
          <div slot="title">{{ item.pluginName }}</div>
          <a-avatar
              slot="avatar"
              :src="item.logo"
          />
        </a-list-item-meta>
      </a-list-item>
    </a-list>
    <a-drawer
      placement="right"
      :visible="show"
      @close="show=false"
      width="100%"
    >
      <div class="plugin-market-desc" slot="title">
        <img width="80" :src="currentSelect.logo"/>
        <div class="desc">
          <h4>{{currentSelect.pluginName}}</h4>
          <div class="info">
            <div class="actor">
              开发者：{{currentSelect.author}}
              <a-button
                v-if="showButton(currentSelect)"
                :loading="loading[currentSelect.index]"
                @click="download(currentSelect.index, currentSelect)"
                icon="cloud-download"
                type="primary"
              >
                获取
              </a-button>
            </div>
            <div>{{currentSelect.description}}</div>
          </div>
        </div>
      </div>
      <div class="market-plugin-detail" v-html="readme"></div>
    </a-drawer>
  </div>
</template>

<script>
import api from '../../../assets/api';
import {mapActions, mapState} from 'vuex';
import marked from "marked";
const rendererMD = new marked.Renderer();

export default {
  data() {
    return {
      pluginList: [],
      loading: {},
      bannerList: [],
      show: false,
      currentSelect: {}
    }
  },
  async created() {
    const [result, bannerRes] = await Promise.all([
      api.plugin.query(),
      api.banner.query(),
    ]);
    this.pluginList = result.result;
    this.bannerList = bannerRes.result;
    console.log(bannerRes)
  },

  methods: {
    async download(index, item) {
      if (this.loading[index]) return;
      this.$set(this.loading, index, true);
      try {
        await this.downloadPlugin(item);
      } catch (e) {
        this.$message.error(e);
      }
      this.$set(this.loading, index, false);
    },
    showButton(item) {
      return !this.devPlugins.filter(plugin => (plugin.name === item.name && plugin.type === 'prod')).length;
    },
    showPannel(item, index) {
      this.show = true;
      this.currentSelect = item;
      this.currentSelect.index = index;
    },
    ...mapActions('main', ['downloadPlugin'])
  },
  computed: {
    ...mapState('main', ['devPlugins']),
    readme() {
      marked.setOptions({
        renderer: rendererMD,
        gfm: true,
        tables: true,
        breaks: false,
        pedantic: false,
        sanitize: false,
        smartLists: true,
        smartypants: false
      });
      try {
        return marked(this.currentSelect.detail);
      } catch (e) {
        return '暂无描述信息'
      }

    }
  }
}
</script>

<style lang="less">
.market-plugin-detail {
  img {
    width: 100%;
  }
  height: 430px;
  overflow: auto;
  &::-webkit-scrollbar {
    width: 0;
  }
}
.plugin-market-desc {
  display: flex;
  img {
    margin-right: 20px;
  }
  .desc {
    flex: 1;
  }
  .info {
    font-size: 12px;
    color: #999;
    font-weight: normal;
    padding-right: 40px;
  }
  .actor {
    flex: 1;
    display: flex;
    justify-content: space-between;
  }
}
 .market {
   height: calc(~'100vh - 110px');
   background: #fff;
   padding: 20px;
   box-sizing: border-box;
   overflow: auto;
   .ant-carousel .slick-slide {
     text-align: center;
     height: 235px;
     line-height: 160px;
     background: #364d79;
     overflow: hidden;
   }

   .ant-carousel .custom-slick-arrow {
     width: 25px;
     height: 25px;
     font-size: 25px;
     color: #fff;
     background-color: rgba(31, 45, 61, 0.11);
     opacity: 0.3;
   }
   .ant-carousel .custom-slick-arrow:before {
     display: none;
   }
   .ant-carousel .custom-slick-arrow:hover {
     opacity: 0.5;
   }

   .ant-carousel .slick-slide h3 {
     color: #fff;
   }
   .ant-list-item {
     display: flex !important;
     align-items: center;
     justify-content: space-between;
   }
   .ant-list-item-meta-description {
     width: 200px;
     overflow: hidden;
     text-overflow:ellipsis;
     white-space: nowrap;
   }
 }

</style>
