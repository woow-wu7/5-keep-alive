<template>
  <div class="detail">
    <h1>Detail</h1>
    <button @click="$router.push('/')">首页</button>
    <button @click="$router.push('/list')">列表页</button>
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Detail", // 注意 name 需要和 路由对象中的name 一样，因为我们这里 include 通过name来判断是否需要被缓存
  data() {
    return {};
  },
};
</script>

<style scoped></style>
