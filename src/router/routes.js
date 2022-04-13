const routes = [
  {
    path: "/",
    name: "Home", // 注意：这里的 name 需要和 组件中的name 一样，因为我们是通过 include 是通过 name 来做判断的
    component: () => import(/* webpackChunkName: "Home" */ "../views/Home.vue"),
    // meta 路由元信息
    meta: {
      deep: 1, // 不存在 shouldKeepAlive 则表示不需要被缓存
    },
  },
  {
    path: "/list",
    name: "List",
    component: () => import(/* webpackChunkName: "List" */ "../views/List.vue"),
    // meta 路由元信息
    meta: {
      deep: 2, // 利用 deep 来判断路由是层级，是前进还是返回
      shouldKeepAlive: true, // 该路由是否需要被 keep-alive 缓存
    },
  },
  {
    path: "/detail",
    name: "Detail",
    component: () =>
      import(/* webpackChunkName: "Detail" */ "../views/Detail.vue"),
    meta: {
      deep: 3,
    },
  },
];

export default routes;
