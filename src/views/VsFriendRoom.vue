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
        <v-flex md2 xs12>
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
      <v-layout v-if="showReady" row justify-center class="px-4 mb-md-2">
        <v-flex md2 xs12>
          <v-btn
            outlined
            height="48px"
            color="primary"
            width="100%"
            @click="ready"
          >
            <v-progress-circular
              v-if="waitingOtherPlayer"
              color="primary"
              indeterminate
            />
            <span v-else>Ready</span>
          </v-btn>
        </v-flex>
      </v-layout>
      <v-layout v-if="gameRunning && !isSm" justify-space-around row>
        <v-flex md5>
          <v-layout column>
            <v-layout row>
              <v-flex xs12>
                <v-text-field
                  class="text-center"
                  readonly
                  :value="mainPlayer"
                  outlined
                  color="primary"
                />
              </v-flex>
            </v-layout>
            <v-layout
              v-for="(attempt, index) in myAttempts"
              :key="index"
              justify-center
              wrap
              shrink
              row
            >
              <v-flex xs10 sm6>
                <v-text-field outlined :value="attempt.guess" readonly>
                  <template v-slot:append>
                    {{ attempt.result.up }} /
                    {{ attempt.result.down }}
                  </template>
                </v-text-field>
              </v-flex>
            </v-layout>
          </v-layout>
        </v-flex>
        <v-flex md5>
          <v-layout column>
            <v-layout row>
              <v-flex xs12>
                <v-text-field
                  class="text-center"
                  readonly
                  :value="secondaryPlayer"
                  outlined
                  color="primary"
                />
              </v-flex>
            </v-layout>
            <v-layout
              v-for="(attempt, index) in otherAttempts"
              :key="index"
              justify-center
              wrap
              shrink
              row
            >
              <v-flex xs10 sm6>
                <v-text-field outlined :value="attempt.guess" readonly>
                  <template v-slot:append>
                    {{ attempt.result.up }} /
                    {{ attempt.result.down }}
                  </template>
                </v-text-field>
              </v-flex>
            </v-layout>
          </v-layout>
        </v-flex>
      </v-layout>
      <v-layout v-if="gameRunning && isSm" justify-space-around row>
        <v-flex xs12>
          <v-carousel>
            <v-carousel-item>{{ mainPlayer }}</v-carousel-item>
            <v-carousel-item>{{ secondaryPlayer }}</v-carousel-item>
          </v-carousel>
        </v-flex>
      </v-layout>
      <v-layout v-if="gameRunning" column>
        <v-layout row justify-space-around>
          <v-flex xs12 md5>
            <v-layout row>
              <v-flex xs12>
                <v-text-field
                  v-if="!over"
                  style="width: 100%"
                  class="text-center"
                  prepend-inner-icon="mdi-numeric"
                  placeholder="Your guess here ..."
                  :append-icon="validNextGuess ? 'mdi-check-outline' : null"
                  ref="nextGuessInputElement"
                  outlined
                  v-model="nextGuess"
                  v-mask="'#####'"
                  :rules="passwordRules"
                  @click:append="sendGuess(nextGuess)"
                />
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex xs12 md5>
            <v-layout row>
              <v-flex xs12 />
            </v-layout>
          </v-flex>
        </v-layout>
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
    ...mapActions("vsFriend", ["sendReady", "sendGuess"])
  },
  computed: {
    ...mapState("vsFriend", ["gameState"]),
    ...mapState(["mainPlayer", "secondaryPlayer"])
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
  sendReady!: () => void;
  waitingOtherPlayer = false;
  mainPlayer!: string;
  secondaryPlayer!: string;
  nextGuess = "";

  get over() {
    return this.gameState.type === "RUNNING" && this.gameState.over;
  }

  get validNextGuess() {
    return this.nextGuess.length === 5;
  }

  get myAttempts() {
    return this.gameState.type === "RUNNING" && this.gameState.myAttempts;
  }

  get otherAttempts() {
    return this.gameState.type === "RUNNING" && this.gameState.otherAttempts;
  }

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
    return (
      this.pwdValidated &&
      this.gameState.type === "LOADING" &&
      (!this.gameState.otherAcknowledgeMeReady || !this.gameState.otherReady)
    );
  }

  get gameRunning() {
    return this.gameState.type === "RUNNING";
  }

  get isSm() {
    return this.$vuetify.breakpoint.smAndDown;
  }

  registerDirtyPwd() {
    this.pwdValidated = true;
    this.registerMyPwd(this.myDirtyPwd);
  }

  ready() {
    this.waitingOtherPlayer = true;
    this.sendReady();
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
