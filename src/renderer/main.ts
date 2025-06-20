import {
	Avatar,
	Button,
	Col,
	ConfigProvider,
	Divider,
	Input,
	List,
	Row,
	Spin,
	Tag,
} from "ant-design-vue";
import { createApp } from "vue";
import App from "./App.vue";
import localConfig from "./confOp";

import "ant-design-vue/dist/antd.variable.min.css";

const config: any = localConfig.getConfig();

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
	.use(Button)
	.use(List)
	.use(Spin)
	.use(Input)
	.use(Avatar)
	.use(Tag)
	.use(Row)
	.use(Col)
	.use(Divider)
	.mount("#app");
