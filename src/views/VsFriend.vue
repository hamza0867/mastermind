<template>
  <div class="d-flex flex-column pa-4">
    <v-layout row justify-center class="px-4 mb-2">
      <v-flex class="mb-2 mr-md-2" xs12 md2>
        <v-btn outlined style="width:100%" color="primary" @click="createRoom"
          >Create room</v-btn
        >
      </v-flex>
      <v-flex xs12 md2>
        <v-btn
          outlined
          style="width:100%"
          color="primary"
          @click="toggleJoiningRoom"
          >Join room</v-btn
        >
      </v-flex>
    </v-layout>
    <v-expand-transition>
      <v-layout row justify-center v-show="joiningRoom" class="px-4 mt-md-4">
        <v-flex md4 xs12>
          <v-text-field
            label="Room Number"
            type="number"
            outlined
            class="mx-auto text-center"
            :append-icon="roomNumber.length > 0 ? 'mdi-check-outline' : null"
            v-model="roomNumber"
            v-mask="'##?#?#?#?#?'"
            @click:append="joinRoom"
          />
        </v-flex>
      </v-layout>
    </v-expand-transition>
    <v-snackbar :timeout="2000" v-model="snackbarError" color="error" top>
      <div class="text-center" style="width: 100%">
        {{ snackbarMessage }}
      </div>
    </v-snackbar>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import io from "socket.io-client";
const vMask = require("v-mask");
const { VueMaskDirective } = vMask;
import { mapState, mapActions, mapMutations } from "vuex";
import { API_URL, API } from "../api";

@Component({
  computed: {
    ...mapState(["mainPlayer"])
  },
  methods: {
    ...mapActions("vsFriend", ["sendReady", "loadGame"]),
    ...mapMutations(["updateSecondaryPlayer"])
  },
  directives: {
    mask: VueMaskDirective
  }
})
export default class VsFriend extends Vue {
  mainPlayer!: string;
  joiningRoom = false;
  roomNumber = "";
  socket?: SocketIOClient.Socket = undefined;
  sendReady!: (myPwd: string) => void;
  loadGame!: (socket: SocketIOClient.Socket) => void;
  updateSecondaryPlayer!: (name: string) => void;
  snackbarError = false;
  snackbarMessage = "";

  createRoom() {
    API.post("/room", { name: this.mainPlayer })
      .then(res => {
        // eslint-disable-next-line no-console
        console.log(res.data.number);
        this.socket = io.connect(API_URL + "/" + res.data.number);
        this.loadGame(this.socket);
        this.$router.push("/vs-friend/" + res.data.number);
      })
      // eslint-disable-next-line no-console
      .catch(err => {
        this.snackbarError = true;
        this.snackbarMessage = err.response.data;
      });
  }

  joinRoom() {
    API.post("/room/" + this.roomNumber, { name: this.mainPlayer })
      .then(res => {
        this.socket = io.connect(API_URL + "/" + res.data.number);
        this.loadGame(this.socket);
        this.updateSecondaryPlayer(res.data.user_1);
        this.$router.push("/vs-friend/" + res.data.number);
      })
      // eslint-disable-next-line no-console
      .catch(err => {
        this.snackbarError = true;
        this.snackbarMessage = err.response.data;
      });
  }

  toggleJoiningRoom() {
    this.joiningRoom = !this.joiningRoom;
  }

  beforeMount() {
    if (!this.mainPlayer) {
      this.$router.push("/");
    }
  }
}
</script>

<style scoped>
.center-text >>> input {
  text-align: center;
}

.text-center >>> input {
  text-align: center;
}
</style>
