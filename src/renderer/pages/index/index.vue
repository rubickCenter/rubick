<template>
  <div>
    <a-list item-layout="horizontal" :data-source="data">
      <a-list-item slot="renderItem" slot-scope="item, index">
        <a-list-item-meta>
          <div class="desc" slot="description">
            Ant Design, a design language for background applications, is refined by Ant UED Team
          </div>
          <div slot="title">
            {{ item.title }}
            <a-tag color="green">标签</a-tag>
          </div>
          <a-avatar
              slot="avatar"
              src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
          />
        </a-list-item-meta>
        <div class="fava-btn">
          <a-icon type="star" /> 添加
        </div>

      </a-list-item>
    </a-list>
  </div>
</template>
<script>
const data = [
  {
    title: 'Ant Design Title 1',
  },
  {
    title: 'Ant Design Title 2',
  },
  {
    title: 'Ant Design Title 3',
  },
  {
    title: 'Ant Design Title 4',
  },
];
export default {
  data() {
    return {
      data,
    };
  },
}
</script>
<style lang="less">
  .fava-btn {
    cursor: pointer;
    &:hover {
      color: #f50;
    }
  }
  .desc {
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    width: 400px;
  }
</style>
