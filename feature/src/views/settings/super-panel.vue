<template>
  <p>{{ $t('feature.settings.superPanel.tips') }}</p>
  <div class="super-list-item panel-item">
    <a-list
      :grid="{ gutter: 16, column: 2 }"
      :data-source="localPlugins.filter((item) => !!item)"
    >
      <template #renderItem="{ item }">
        <a-list-item v-if="item">
          <template #actions>
            <a-button
              v-if="!hasAdded(item)"
              @click="addPluginToSuperPanel(item)"
              style="color: #7ec699"
              type="text"
            >
              {{ $t('feature.settings.superPanel.add') }}
            </a-button>
            <a-button
              v-else
              @click="removePluginToSuperPanel(item)"
              style="color: #ff4ea4"
              type="text"
            >
              {{ $t('feature.settings.superPanel.remove') }}
            </a-button>
          </template>
          <a-list-item-meta>
            <template #description>
              <span class="ellipse">{{ item.description }}</span>
            </template>
            <template #title>
              <span class="ellipse">{{ item.pluginName }}</span>
            </template>
            <template #avatar>
              <a-avatar :src="item.logo" />
            </template>
          </a-list-item-meta>
        </a-list-item>
      </template>
    </a-list>
  </div>
</template>
<script setup>
import { useStore } from 'vuex';
import { computed, ref, toRaw } from 'vue';

const store = useStore();
const localPlugins = computed(() =>
  store.state.localPlugins.filter(
    (plugin) =>
      plugin.name !== 'rubick-system-feature' &&
      plugin.name !== 'rubick-system-super-panel'
  )
);

const hasAdded = (plugin) => {
  let added = false;
  superPanelPlugins.value.data.some((item) => {
    if (item.name === plugin.name) {
      added = true;
      return true;
    }
    return false;
  });
  return added;
};

const superPanelPlugins = ref(
  window.rubick.db.get('super-panel-db') || {
    data: [],
    _id: 'super-panel-db',
  }
);

const addPluginToSuperPanel = (plugin) => {
  superPanelPlugins.value.data.push(toRaw(plugin));
  window.rubick.db.put(toRaw(superPanelPlugins.value));
};

const removePluginToSuperPanel = (plugin) => {
  superPanelPlugins.value.data = toRaw(superPanelPlugins.value).data.filter(
    (item) => {
      return item.name !== plugin.name;
    }
  );
  window.rubick.db.put(toRaw(superPanelPlugins.value));
};
</script>
<style lang="less" scoped>
p {
  color: var(--color-text-primary);
}
.super-list-item.panel-item {
  &:after {
    display: none;
  }
}
</style>
