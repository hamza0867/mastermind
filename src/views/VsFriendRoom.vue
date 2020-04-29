<template>
  <div class="d-flex flex-column pa-4">
    <v-layout column>
      <v-layout row justify-center class="px-4 mb-md-2">
        <v-flex md2 xs12>
          <v-text-field
            label="Room Number"
            class="center-text"
            outlined
            readonly
            :value="$route.params.roomNumber"
          />
        </v-flex>
      </v-layout>
      <v-layout row justify-center class="px-4 mb-md-2">
        <v-flex md4 xs12>
          <v-text-field
            label="Your password"
            class="center-text"
            outlined
            :readonly="pwdValidated"
            v-model="myDirtyPwd"
            :append-icon="showAppendIcon ? 'mdi-check-outline' : null"
            @click:append="registerDirtyPwd"
            :rules="passwordRules"
            v-mask="'#####'"
          />
        </v-flex>
      </v-layout>
      <v-layout row justify-center class="px-4 mb-md-2">
        <v-flex md4 xs12>
          <v-btn outlined color="primary" width="100%" @click="ready"
            >Ready</v-btn
          >
        </v-flex>
      </v-layout>
    </v-layout>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { mapMutations, mapState, mapActions } from "vuex";
import { passwordRules } from "@/models/shared";
import { GameState } from "../store/vsFriend.store";
const vMask = require("v-mask");
const { VueMaskDirective } = vMask;

@Component({
  methods: {
    ...mapMutations("vsFriend", ["registerMyPwd"]),
    ...mapActions("vsFriend", ["sendReady"])
  },
  computed: {
    ...mapState("vsFriend", ["gameState"])
  },
  directives: {
    mask: VueMaskDirective
  }
})
export default class VsFriendRoom extends Vue {
  myDirtyPwd = "";
  registerMyPwd!: (myPwd: string) => void;
  passwordRules = passwordRules;
  pwdValidated = false;
  gameState!: GameState;
  shouldShowReady = true;
  sendReady!: () => void;

  get validPwd() {
    return this.passwordRules[0](this.myDirtyPwd);
  }

  get showAppendIcon() {
    if (this.pwdValidated) {
      return false;
    } else {
      return this.validPwd === true;
    }
  }

  get showReady() {
    return !this.showAppendIcon && this.shouldShowReady;
  }

  registerDirtyPwd() {
    this.pwdValidated = true;
    this.registerMyPwd(this.myDirtyPwd);
  }

  ready() {
    this.shouldShowReady = false;
    this.sendReady();
  }
}
</script>

<style scoped>
.center-text >>> input {
  text-align: center;
}
</style>
