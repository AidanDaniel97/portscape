import VueRouter from "vue-router";

const router = new VueRouter({
  mode: "history",
  routes: [
    {
      path: "/home",
      component: () => import("../views/Home"),
      name: "Home"
    },
    {
      path: "/editor",
      component: () => import("../views/Editor"),
      name: "Editor"
    }
  ]
});

export default router;
