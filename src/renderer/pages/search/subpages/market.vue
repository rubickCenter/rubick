<template>
  <div class="market">
    <a-carousel arrows>
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
      <div><h3>1</h3></div>
      <div><h3>2</h3></div>
      <div><h3>3</h3></div>
      <div><h3>4</h3></div>
    </a-carousel>
    <a-divider></a-divider>
    <h2>插件</h2>
    <a-list item-layout="horizontal" style="width: 100%" :grid="{ gutter: 16, column: 2 }" :data-source="pluginList">
      <a-list-item slot="renderItem" slot-scope="item, index">
        <a-button :loading="loading[index]" type="link" slot="actions" @click="download(index, item)">
          <a-icon v-show="!loading[index]" style="font-size: 20px;" type="cloud-download" />
        </a-button>


        <a-list-item-meta
            :description="item.description"
        >
          <a slot="title" href="https://www.antdv.com/">{{ item.title }}</a>
          <a-avatar
              slot="avatar"
              src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
          />
        </a-list-item-meta>
      </a-list-item>
    </a-list>
  </div>
</template>

<script>
import api from '../../../assets/api';
import {mapActions} from 'vuex';

export default {
  data() {
    return {
      pluginList: [],
      loading: {},
    }
  },
  async created() {
    const result = await api.plugin.query();
    this.pluginList = result.result;
  },

  methods: {
    async download(index, item) {
      if (this.loading[index]) return;
      this.$set(this.loading, index, true);
      console.log(this.loading);
      await this.downloadPlugin(item);
      this.$set(this.loading, index, false);
      console.log(this.loading);

    },
    ...mapActions('main', ['downloadPlugin'])
  }
}
</script>

<style lang="scss">
 .market {
   height: calc(100vh - 110px);
   background: #fff;
   padding: 20px;
   box-sizing: border-box;
   .ant-carousel .slick-slide {
     text-align: center;
     height: 200px;
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
 }

</style>
