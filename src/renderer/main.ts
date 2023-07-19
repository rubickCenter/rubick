import { createApp } from 'vue';
import {
  Button,
  List,
  Spin,
  Input,
  Avatar,
  Tag,
  ConfigProvider,
} from 'ant-design-vue';
import App from './App.vue';

import 'ant-design-vue/dist/antd.variable.min.css';

const { remote } = window.require('electron');

const { perf } = remote.getGlobal('OP_CONFIG').get();

ConfigProvider.config({
  theme: perf.custom || {},
});

createApp(App)
  .use(Button)
  .use(List)
  .use(Spin)
  .use(Input)
  .use(Avatar)
  .use(Tag)
  .mount('#app');
