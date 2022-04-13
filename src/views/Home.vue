<template>
  <div class="home">
    <h1>Home</h1>
    <button @click="$router.push('/list')">列表页</button>
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Home",
  data() {
    return {};
  },
};
</script>

<style scoped></style>
