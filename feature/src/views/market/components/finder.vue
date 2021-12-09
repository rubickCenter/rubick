<template>
  <div class="finder">
    <a-carousel arrows>
      <template #prevArrow>
        <div class="custom-slick-arrow" style="left: 10px; z-index: 1">
          <left-circle-outlined />
        </div>
      </template>
      <template #nextArrow>
        <div class="custom-slick-arrow" style="right: 10px">
          <right-circle-outlined />
        </div>
      </template>
      <div :key="index" v-for="(banner, index) in (data.banners || [])">
        <img @click="jumpTo(banner.link)" width="100%" :src="banner.src" />
      </div>
    </a-carousel>
    <PluginList
      v-if="recommend && !!recommend.length"
      @downloadSuccess="downloadSuccess"
      title="推荐"
      :list="recommend"
    />
    <PluginList
      v-if="newList && !!newList.length"
      title="最近更新"
      :list="newList"
    />
  </div>
</template>

<script setup>
import {
  LeftCircleOutlined,
  RightCircleOutlined,
} from "@ant-design/icons-vue";
import { ref, computed, onBeforeMount } from "vue";
import request from "../../../assets/request/index";
import PluginList from "./plugin-list.vue";

import { useStore } from "vuex";
const store = useStore();
const totalPlugins = computed(() => store.state.totalPlugins);

const data = ref([]);

onBeforeMount(async () => {
  data.value = await request.getFinderDetail();
});

const recommend = computed(() => {
  const defaultData = data.value.recommend || [];
  if (!defaultData.length) return [];
  return defaultData.map((plugin) => {
    let searchInfo = null;
    totalPlugins.value.forEach((t) => {
      if (t.name === plugin) {
        searchInfo = t;
      }
    });
    return searchInfo;
  });
});

const newList = computed(() => {
  const defaultData = data.value.new || [];
  if (!defaultData.length) return [];
  return defaultData.map((plugin) => {
    let searchInfo = null;
    totalPlugins.value.forEach((t) => {
      if (t.name === plugin) {
        searchInfo = t;
      }
    });
    return searchInfo;
  });
});

</script>

<style lang="less">
.finder {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  box-sizing: border-box;
  &::-webkit-scrollbar {
    width: 0;
  }
  .ant-carousel .slick-slide {
    text-align: center;
    height: 235px;
    line-height: 160px;
    overflow: hidden;
    border-radius: 4px;
    img {
      width: 100%;
      height: 235px;
    }
  }
  .ant-carousel .custom-slick-arrow {
    width: 25px;
    height: 25px;
    font-size: 25px;
    color: #fff;
    background-color: rgba(31, 45, 61, 0.11);
    opacity: 0.3;
  }

  .ant-carousel .custom-slick-arrow.slick-next:focus {
    color: #fff;
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
}
</style>
