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
  name: "Detail",
  data() {
    return {};
  },
};
</script>

<style scoped></style>
