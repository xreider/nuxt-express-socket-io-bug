<template>
  <div>
    <h1>{{ $t("about") }}</h1>
    <div>
      <NuxtLink :to="localePath('/')">to Index</NuxtLink>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: mapState(["user"]),
};
</script>

<style scoped>
</style>
