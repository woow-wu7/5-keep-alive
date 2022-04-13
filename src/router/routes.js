const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import(/* webpackChunkName: "Home" */ "../views/Home.vue"),
  },
  {
    path: "/list",
    name: "List",
    component: () => import(/* webpackChunkName: "List" */ "../views/List.vue"),
  },
  {
    path: "/detail",
    name: "Detail",
    component: () =>
      import(/* webpackChunkName: "Detail" */ "../views/Detail.vue"),
  },
];

export default routes;
