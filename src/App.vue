<template>
  <div id="app">
    <!-- 1，通过 include 来在需要缓存的组件的基础上，做进一步的细分，不是所有情况都需要被缓存 -->

    <keep-alive :include="includes">
      <!-- 2. 需要被缓存的路由用keep-alive包裹，shouldKeepAlive是定死的，不会变化 -->
      <router-view v-if="$route.meta.shouldKeepAlive" />
    </keep-alive>

    <!-- 不需要缓存的路由 -->
    <router-view v-if="!$route.meta.shouldKeepAlive" />
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      includes: [], // app组件相当于全局组件，不会被卸载，所有data会一致被被保存
    };
  },
  watch: {
    // watch $route 是组件响应路由变化的解决方案之一，还可以使用 beforeRouteUpdate 守卫
    // 1
    $route(to, from) {
      if (to.meta.shouldKeepAlive && !this.includes.includes(to.name)) {
        this.includes.push(to.name);
      }

      // 如果 当前路由需要被缓存，并且是返回操作(详情->列表->首页) 就删除当前路由，则不再被缓存
      if (from.meta.shouldKeepAlive && to.meta.deep < from.meta.deep) {
        const index = this.includes.findIndex((name) => name === from.name);
        index !== -1 && this.includes.splice(index, 1);
      }
    },
  },
  updated() {
    console.log("this.includes", this.includes);
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
