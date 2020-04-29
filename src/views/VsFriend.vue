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
            outlined
            class="mx-auto"
            :append-icon="roomNumber.length > 0 ? 'mdi-check-outline' : null"
            v-model="roomNumber"
            v-mask="'##?#?#?#?#?'"
            @click:append="joinRoom"
          />
        </v-flex>
      </v-layout>
    </v-expand-transition>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import io from "socket.io-client";
const vMask = require("v-mask");
const { VueMaskDirective } = vMask;
import { mapState, mapActions, mapMutations } from "vuex";

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

  createRoom() {
    fetch("http://localhost:4000/room", {
      method: "POST",
      body: JSON.stringify({ name: this.mainPlayer }),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(res => {
        this.socket = io.connect("http://localhost:4000/" + res.number);
        this.loadGame(this.socket);
        this.$router.push("/vs-friend/" + res.number);
      });
  }

  joinRoom() {
    fetch("http://localhost:4000/room/" + this.roomNumber, {
      method: "POST",
      body: JSON.stringify({ name: this.mainPlayer }),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(res => {
        this.socket = io.connect("http://localhost:4000/" + res.number);
        this.loadGame(this.socket);
        this.updateSecondaryPlayer(res.user_1);
        this.$router.push("/vs-friend/" + res.number);
      });
  }

  toggleJoiningRoom() {
    this.joiningRoom = !this.joiningRoom;
  }
}
</script>
