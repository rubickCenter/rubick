import { createApp } from 'vue';
import Antd, { ConfigProvider } from 'ant-design-vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './assets/ant-reset.less';
import 'ant-design-vue/dist/antd.variable.min.css';
import registerI18n from './languages/i18n';
import localConfig from './confOp';

const config: any = localConfig.getConfig();

ConfigProvider.config({
  theme: config.perf.custom || {},
});

createApp(App).use(registerI18n).use(store).use(Antd).use(router).mount('#app');
