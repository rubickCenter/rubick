import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import Market from "../views/market/index.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Market",
    component: Market,
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
