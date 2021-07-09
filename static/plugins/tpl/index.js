import doc from './doc.js';
import list from './list.js';

function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    if(pair[0] == variable){return pair[1];}
  }
  return(false);
}

const routes = [
  { path: '/doc', name: 'doc', component: doc },
  { path: '/list', name: 'list', component: list },
]

const router = new VueRouter({
  routes
})

new Vue({
  el: '#app',
  data: {
    config: window.exports,
    code: '',
    current: {},
  },
  mounted() {
    this.code = getQueryVariable('code');
    this.current = this.config[this.code];
    this.$router.push({
      name: this.current.mode,
      query: {
        args: JSON.stringify(this.current.args),
        rootPath: getQueryVariable('targetFile').replace('index.html', '')
      },
    })

  },
  router,
})
