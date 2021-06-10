export default {
  template: `
    <div class="doc-container">
      <div class="menu">
        <div @click="active = index" :class="active === index ? 'active item' : 'item'" v-for="(item, index) in menu">
          <div class="title">{{item.t}}</div>
          <div class="desc">{{item.d}}</div>
        </div>
      </div>
      <iframe class="frame" :src="path" />
    </div>
  `,
  data() {
    return {
      query: this.$route.query,
      menu: [],
      active: 0,
    }
  },
  mounted() {
    this.menu = JSON.parse(this.query.args).indexes || [];
  },
  computed: {
    path() {
      return decodeURIComponent(this.query.rootPath) + (this.menu[this.active] || {}).p
    }
  }
}
