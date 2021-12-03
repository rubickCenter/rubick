import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import Market from "../views/market/index.vue";
import Installed from "../views/installed/index.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/market",
    name: "market",
    component: Market,
  },
  {
    path: "/installed",
    name: "installed",
    component: Installed,
  },
  {
    path: "/:catchAll(.*)",
    name: "market",
    component: Market,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
