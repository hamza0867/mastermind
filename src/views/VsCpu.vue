<template>
  <v-container fluid fill-height>
    <v-layout justify-center wrap mt-4 column>
      <v-layout row justify-center shrink sm6 xs10>
        <v-flex sm6 xs10>
          <v-text-field label="Player" outlined :value="mainPlayer" readonly />
        </v-flex>
        <v-fab-transition>
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                v-show="over"
                fixed
                bottom
                right
                fab
                v-on="on"
                color="error"
                @click="startGame"
              >
                <v-icon dark>mdi-reload</v-icon>
              </v-btn>
            </template>
          </v-tooltip>
        </v-fab-transition>
        <v-fab-transition>
          <v-tooltip top>
            <span>Reset Attempts</span>
            <template v-slot:activator="{ on }">
              <v-btn
                v-show="!over"
                fixed
                bottom
                right
                fab
                color="primary"
                v-on="on"
                @click="resetGame"
              >
                <v-icon dark>mdi-cancel</v-icon>
              </v-btn>
            </template>
          </v-tooltip>
        </v-fab-transition>
      </v-layout>
      <v-layout
        v-for="(attempt, index) in attempts"
        :key="index"
        justify-center
        wrap
        shrink
        row
      >
        <v-flex xs10 sm6>
          <v-text-field outlined :value="attempt.guess" readonly>
            <template v-slot:append
              >{{ attempt.result.up }} / {{ attempt.result.down }}</template
            >
          </v-text-field>
        </v-flex>
      </v-layout>
      <v-layout row justify-center>
        <v-flex sm6 xs10>
          <v-text-field
            v-if="!over"
            ref="nextGuessInputElement"
            style="width: 100%"
            prepend-inner-icon="mdi-numeric"
            placeholder="Your guess here ..."
            :append-icon="validNextGuess ? 'mdi-check-outline' : null"
            outlined="outlined"
            v-model="nextGuess"
            v-mask="'#####'"
            :rules="nextGuessRules"
            autofocus
            validate-on-blur
            @click:append="checkGuess"
          />
        </v-flex>
      </v-layout>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { mapState, mapGetters, mapActions } from "vuex";
import { Attempt, passwordRules } from "../models/shared";
import { Actions } from "@/store/vsCpu.store";
const vMask = require("v-mask");
const { VueMaskDirective } = vMask;

@Component({
  computed: {
    ...mapState(["mainPlayer"]),
    ...mapState("vsCpu", ["attempts", "over"])
  },
  methods: {
    ...mapActions("vsCpu", [
      Actions.startGame,
      Actions.resetGame,
      Actions.nextAttempt
    ])
  },
  directives: {
    mask: VueMaskDirective
  }
})
export default class VsCpu extends Vue {
  mainPlayer!: string;
  attempts!: Attempt[];
  over!: boolean;
  startGame!: Function;
  nextAttempt!: Function;
  resetGame!: Function;

  nextGuess = "";
  nextGuessRules = passwordRules;

  get validNextGuess() {
    return this.nextGuess.length === 5;
  }

  checkGuess() {
    this.nextAttempt(this.nextGuess);
    this.nextGuess = "";
  }

  mounted() {
    this.startGame();
  }
}
</script>
