<template>
  <div class="list">
    <h1>List</h1>
    <div>{{ count }}</div>
    <button @click="count++">修改count，测试是否被keep-alive缓存</button>

    <div>
      <button @click="$router.push('/')">首页</button>
      <button @click="$router.push('/detail')">详情</button>
    </div>
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "List",
  data() {
    return {
      count: 0,
    };
  },
};
</script>

<style scoped></style>
