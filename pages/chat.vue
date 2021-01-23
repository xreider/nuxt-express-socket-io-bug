<template>
  <div class="chat-wrap">
    <div class="chat-list" ref="block">
      <!-- <ul>
        <li v-for="m in messages" :key="m.text">{{ m.text }}</li>
      </ul> -->

      <Message
        v-for="m in messages"
        :key="m.text"
        :name="m.name"
        :text="m.text"
        :owner="m.id === user.id"
      />
    </div>
    <div class="chat-form">
      <ChatForm />
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  middleware: ["chat"],
  head() {
    return {
      title: `${this.$t("room")} ${this.user.room}`,
    };
  },
  computed: mapState(["user", "messages"]),
  watch: {
    messages() {
      setTimeout(() => {
        this.$refs.block.scrollTop = this.$refs.block.scrollHeight;
      });
    },
  },
};
</script>

<style scoped>
.chat-wrap {
  position: relative;
  overflow: hidden;
  height: 100%;
}

.chat-form {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  height: 80px;
  background: #212121;
}

.chat-list {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 80px;
  padding: 1rem;
  overflow-y: auto;
}
</style>
