<template>
  <v-layout align-center justify-center column fill-height>
    <v-flex xs12 sm8>
      <v-card min-width="400">
        <v-snackbar v-model="snackbar" :timeout="6000" top>
          {{ message }}

          <template v-slot:action="{ attrs }">
            <v-btn color="blue" text v-bind="attrs" @click="snackbar = false">
              Close
            </v-btn>
          </template>
        </v-snackbar>

        <v-card-title>Nuxt chat</v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-text-field
              v-model="name"
              :counter="16"
              :rules="nameRules"
              label="Name"
              required
            ></v-text-field>

            <v-text-field
              v-model="room"
              :rules="roomRules"
              label="Room number"
              required
            ></v-text-field>

            <v-btn
              :disabled="!valid"
              color="primary"
              class="mr-4"
              @click="submit"
            >
              Enter
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapMutations } from "vuex";
export default {
  layout: "empty",
  head() {
    return {
      // title: this.$i18n.messages[this.$i18n.locale].welcome,
      // title: this.$i18n.t("welcome"),
      title: this.$t("welcome"),
    };
  },
  sockets: {
    connect: function () {
      console.log("Client IO connected");
    },
  },
  data: () => ({
    valid: true,
    name: "",
    message: "",
    snackbar: "",
    nameRules: [
      (v) => !!v || "Name is required",
      (v) => (v && v.length <= 16) || "Name must be less than 16 characters",
    ],
    room: "",
    roomRules: [
      (v) => !!v || "Room is required",
      (v) => (v && v.length <= 16) || "Name must be less than 16 characters",
    ],
  }),
  mounted() {
    const { message } = this.$route.query;
    if (message === "noUser") {
      this.message = "Input data";
    } else if (message === "leftChat") {
      this.message = "You went gone";
    }

    this.snackbar;
  },
  methods: {
    ...mapMutations(["setUser"]),
    submit() {
      if (this.$refs.form.validate()) {
        const user = {
          name: this.name,
          room: this.room,
        };

        this.$socket.emit("userJoined", user, (data) => {
          if (typeof data === "string") {
            console.error(data);
          } else {
            user.id = data.userId;
            this.setUser(user);
            this.$router.push(this.localePath("chat"));
          }
        });

        this.setUser(user);
        this.$router.push(this.localePath("chat"));
      }
    },
  },
};

// export default {
//   sockets: {
//     connect: function () {
//       console.log("Client IO connected");
//     },
//     newMesage: function (data) {
//       console.dir(data);
//     },
//   },
//   methods: {
//     message() {
//       this.$socket.emit("createMessage", {
//         text: "FROM CLIENT",
//       });
//     },
//   },
// };
//
</script>


<style scoped>
</style>
