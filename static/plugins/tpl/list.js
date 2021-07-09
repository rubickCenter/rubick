function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    if(pair[0] == variable){return pair[1];}
  }
  return(false);
}

export default {
  template: `
    <div class="list-container">
      <div class="options" v-show="!!lists.length">
        <div  :class="currentSelect === index ? 'active op-item' : 'op-item'" v-for="(item, index) in lists"  @click="() => select(item)">
          <img class="icon" :src="item.icon" />
          <div class="content">
            <div class="title">{{item.title}}</div>
            <div class="desc">{{decodeURIComponent(item.description)}}</div>
          </div>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      query: this.$route.query,
      menu: [],
      active: 0,
      config: window.exports,
      lists: [],
      currentSelect: 0,
    }
  },
  mounted() {
    this.code = getQueryVariable('code');
    this.current = this.config[this.code];
    this.current.args.enter && this.current.args.enter({code: this.code, type: '', payload: [] }, (lists) => {
      this.lists = lists;
    });
    ipcRenderer.on(`changeCurrent`, (e, result) => {
      if (this.currentSelect + result > this.lists.length - 1 || this.currentSelect + result < 0) return;
      this.currentSelect = this.currentSelect + result;
    });
    ipcRenderer.on(`msg-back-setSubInput`, (e, result) => {
      this.current.args.search && this.current.args.search({code: this.code, type: '', payload: [] }, result, (lists) => {
        this.lists = lists;
      })
    });
  },
  methods: {
    select(item) {
      this.current.args.select && this.current.args.select({code: this.code, type: '', payload: [] }, item);
    },
    renderTitle(title) {
      const result = title.split(this.searchValue);
      return `<div>${result[0]}<span style="color: red">${this.searchValue}</span>${result[1]}</div>`
    },
  }
}
