import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import Market from "../views/market/index.vue";
import Installed from "../views/installed/index.vue";
import Account from "../views/account/index.vue";
import Settings from "../views/settings/index.vue";
import Dev from "../views/dev/index.vue";

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
    path: "/account",
    name: "account",
    component: Account,
  },
  {
    path: "/settings",
    name: "settings",
    component: Settings,
  },
  {
    path: "/dev",
    name: "dev",
    component: Dev,
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
