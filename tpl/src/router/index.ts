import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import List from "../views/List.vue";
import Doc from "../views/Doc.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/list",
    name: "list",
    component: List,
  },
  {
    path: "/doc",
    name: "doc",
    component: Doc,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
