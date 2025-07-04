<template>
  <div class="finder">
    <div class="flex-col gap-16px">
      <span>依赖</span>
      <div class="flex gap-16px">
        <div class="flex-col items-center gap-4px rounded-8px p-8px w-100px" v-for="(dependency, name) in dependencies"
          :class="{ 'opacity-50': dependency.version === '未安装' }">
          <component :is="dependency.icon" class="text-24px" />
          <span class="text-12px whitespace-nowrap">{{ name }}@{{ dependency.version }}</span>
        </div>
      </div>
    </div>
    <a-divider />
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, reactive } from "vue";
import Git from "@/icons/DeviconGit.vue";
import Volta from "@/icons/FluentEmojiHighVoltage.vue";

const dependencies = reactive({
	Volta: {
		version: "未安装",
		icon: Volta,
		update: updateVoltaVersion,
	},
	Git: {
		version: "未安装",
		icon: Git,
		update: updateGitVersion,
	},
});

function updateVoltaVersion() {
	window.rubick.getVoltaVersion().then((version: string) => {
		dependencies.Volta.version = version;
	});
}

function updateGitVersion() {
	window.rubick.getGitVersion().then((version: string) => {
		dependencies.Git.version = version;
	});
}

onBeforeMount(() => {
	updateVoltaVersion();
	updateGitVersion();
});
</script>

<style lang="less">
.finder {
  position: relative;
  width: 100%;
  overflow-x: hidden;
  box-sizing: border-box;

  &::-webkit-scrollbar {
    width: 0;
  }

  .ant-divider-horizontal {
    margin: 17px 0;
  }
}
</style>
