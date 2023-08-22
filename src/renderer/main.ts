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

const { getGlobal } = window.require('@electron/remote');

const { perf } = getGlobal('OP_CONFIG').get();

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
