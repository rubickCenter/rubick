import { createApp } from 'vue';
import Vue3Lottie from 'vue3-lottie';
import {
  ConfigProvider,
  Button,
  Divider,
  Row,
  Col,
  Dropdown,
  Menu,
  Form,
  Input,
  Radio,
  Select,
  Switch,
  Avatar,
  Collapse,
  List,
  Tooltip,
  Alert,
  Drawer,
  Modal,
  Result,
  Spin,
} from 'ant-design-vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './assets/ant-reset.less';
import 'ant-design-vue/dist/antd.variable.min.css';
import registerI18n from './languages/i18n';
import localConfig from './confOp';

const config: any = localConfig.getConfig();

// 暗夜模式
if (config.perf.common.darkMode) {
  document.body.classList.add('dark');
  window.rubick.theme = 'dark';
}

ConfigProvider.config({
  theme: config.perf.custom || {},
});

window.rubick.changeTheme = () => {
  const config: any = localConfig.getConfig();
  ConfigProvider.config({
    theme: config.perf.custom || {},
  });
};

createApp(App)
  .use(registerI18n)
  .use(store)
  .use(Button)
  .use(Divider)
  .use(Row)
  .use(Col)
  .use(Dropdown)
  .use(Menu)
  .use(Form)
  .use(Input)
  .use(Radio)
  .use(Select)
  .use(Switch)
  .use(Avatar)
  .use(Collapse)
  .use(List)
  .use(Tooltip)
  .use(Alert)
  .use(Drawer)
  .use(Modal)
  .use(Result)
  .use(Spin)
  .use(router)
  .use(Vue3Lottie)
  .mount('#app');
