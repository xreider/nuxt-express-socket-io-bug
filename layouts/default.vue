<template>
  <v-app app dark>
    <v-navigation-drawer app v-model="drawer" mobile-breakpoint="650px">
      <v-list-tile v-for="u in users" :key="u.id" @click.prevent>
        <v-list-tile-content>
          <v-list-tile-title>
            {{ u.name }}
          </v-list-tile-title>
        </v-list-tile-content>
        <v-list-tile-action>
          <v-icon :color="u.id === user.id ? 'primary' : 'gray'">
            chat_bubble
          </v-icon>
        </v-list-tile-action>
      </v-list-tile>
    </v-navigation-drawer>
    <v-toolbar app>
      <v-toolbar-side-icon @click="drawer = !drawer">1111</v-toolbar-side-icon>
      <v-btn icon @click="exit" no-prefetch>
        <v-icon dark right> mdi-checkbox-marked-circle </v-icon>
      </v-btn>

      <v-toolbar-title style="display: contents"
        >{{ $t("room") }} {{ user.room }}</v-toolbar-title
      >
    </v-toolbar>

    <v-main>
      <div style="height: 100%">
        <Nuxt />
      </div>
    </v-main>
  </v-app>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  data: () => ({
    drawer: true,
  }),
  computed: mapState(["user", "users"]),
  methods: {
    ...mapMutations(["clearData"]),
    exit() {
      this.$socket.emit("userLeft", this.user.id, () => {
        this.$router.push(this.localePath("/?message=leftChat"));
        this.clearData();
      });
    },
  },
};

// {
// mounted() {
//   // window.socket = io();
//   // this.$store.commit("addIo", io);
//   window.addEventListener("beforeunload", (event) => {
//     // window.socket.emit("destroy");
//   });
// },
// destroyed() {
//   // window.socket.emit("destroy");
// },
// };
</script>

<style scoped>
.v-toolbar {
  display: contents;
}
</style>
