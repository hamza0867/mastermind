<template>
  <div class="d-flex flex-column pa-4 root-vs-friend-room">
    <v-fab-transition>
      <v-tooltip top>
        <span>Play a new game</span>
        <template v-slot:activator="{ on }">
          <v-btn
            v-show="over"
            fixed
            bottom
            right
            fab
            v-on="on"
            color="error"
            @click="restartGame"
          >
            <v-icon dark>mdi-reload</v-icon>
          </v-btn>
        </template>
      </v-tooltip>
    </v-fab-transition>
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
            type="number"
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
              <v-flex xs12>
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
              <v-flex xs12>
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
          <v-tabs class="px-4" grow>
            <v-tab>{{ mainPlayer }}</v-tab>
            <v-tab>{{ secondaryPlayer }}</v-tab>
            <v-tab-item class="attempts">
              <v-layout column>
                <v-layout
                  v-for="(attempt, index) in myAttempts"
                  :key="index"
                  justify-center
                  wrap
                  shrink
                  row
                  class="px-4 mt-4"
                >
                  <v-flex xs12>
                    <v-text-field outlined :value="attempt.guess" readonly>
                      <template v-slot:append>
                        {{ attempt.result.up }} /
                        {{ attempt.result.down }}
                      </template>
                    </v-text-field>
                  </v-flex>
                </v-layout>
              </v-layout>
            </v-tab-item>
            <v-tab-item class="attempts">
              <v-layout column>
                <v-layout
                  v-for="(attempt, index) in otherAttempts"
                  :key="index"
                  justify-center
                  wrap
                  shrink
                  row
                  class="px-4 mt-4"
                >
                  <v-flex xs12>
                    <v-text-field outlined :value="attempt.guess" readonly>
                      <template v-slot:append>
                        {{ attempt.result.up }} /
                        {{ attempt.result.down }}
                      </template>
                    </v-text-field>
                  </v-flex>
                </v-layout>
              </v-layout>
            </v-tab-item>
          </v-tabs>
        </v-flex>
      </v-layout>
      <v-layout v-if="gameRunning" column>
        <v-layout row justify-space-around class="px-4 px-md-0 mt-4 mt-md-0">
          <v-flex xs12 md5>
            <v-layout row class="mx-0 mx-md-n4">
              <v-flex xs12>
                <v-text-field
                  v-if="!over"
                  type="number"
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
                  @click:append="handleNextGuess"
                  id="nextGuessInputElement"
                />
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex xs0 md5>
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
    ...mapActions("vsFriend", ["restartGame", "sendReady", "sendGuess"])
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
  sendGuess!: (guess: string) => void;
  restartGame!: () => void;

  resetGame() {
    this.waitingOtherPlayer = false;
    this.pwdValidated = false;
    this.myDirtyPwd = "";
  }

  get over() {
    return this.gameState.type === "RUNNING" && this.gameState.over;
  }

  get validNextGuess() {
    return this.nextGuess.length === 5;
  }

  get myAttempts() {
    return this.gameState.type === "RUNNING" ? this.gameState.myAttempts : [];
  }

  get otherAttempts() {
    return this.gameState.type === "RUNNING"
      ? this.gameState.otherAttempts
      : [];
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

  handleNextGuess() {
    this.sendGuess(this.nextGuess);
    this.nextGuess = "";
  }

  updated() {
    const el = document.getElementById("nextGuessInputElement");
    if (el) {
      this.$nextTick(() => {
        el.scrollIntoView({
          behavior: "smooth"
        });
      });
    }
  }

  beforeUpdate() {
    if (this.gameState.type === "RESTARTING") {
      this.resetGame();
    }
  }

  beforeMount() {
    if (this.gameState.type === "NOT_STARTED") {
      this.$router.push("/vs-friend");
    }
  }
}
</script>

<style scoped>
.root-vs-friend-room {
  scroll-behavior: smooth;
}

.center-text >>> input {
  text-align: center;
}

.text-center >>> input {
  text-align: center;
}

.center-text >>> input::-webkit-outer-spin-button,
.center-text >>> input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.text-center >>> input::-webkit-outer-spin-button,
.text-center >>> input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.attempts {
  overflow-y: auto;
}

.center-text >>> [type="number"] {
  -moz-appearance: textfield; /* Firefox */
}

.text-center >>> [type="number"] {
  -moz-appearance: textfield; /* Firefox */
}
</style>
