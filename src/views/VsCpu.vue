<template>
  <v-container fluid fill-height>
    <v-layout justify-center wrap mt-4 column>
      <v-layout row justify-center shrink>
        <v-flex sm6 xs10>
          <v-text-field
            label="Player"
            :filled="filled"
            :outlined="outlined"
            :value="mainPlayer"
            readonly
          />
        </v-flex>
        <v-btn
          v-if="over"
          fixed
          bottom
          right
          fab
          color="error"
          @click="startGame"
        >
          <v-icon dark> mdi-reload </v-icon>
        </v-btn>
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
          <v-text-field
            :filled="filled"
            :outlined="outlined"
            :value="attempt.guess"
            readonly
          >
            <template v-slot:append>
              {{ attempt.result.up }} / {{ attempt.result.down }}
            </template>
          </v-text-field>
        </v-flex>
      </v-layout>
      <v-layout row justify-center>
        <v-flex sm6 xs10>
          <v-text-field
            v-if="!over"
            ref="nextGuessInputElement"
            style="width: 100%"
            :append-icon="validNextGuess ? 'mdi-check-outline' : null"
            :filled="filled"
            :outlined="outlined"
            v-model="nextGuess"
            v-mask="'#####'"
            :rules="nextGuessRules"
            autofocus
            @click:append="onClickAppend"
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
// import { mask } from "vue-the-mask";
const vueTheMask = require("vue-the-mask");
const { mask } = vueTheMask;

@Component({
  computed: {
    ...mapState(["mainPlayer", "secondaryPlayer"]),
    ...mapGetters("ui", ["outlined", "filled"]),
    ...mapState("vsCpu", ["attempts", "over"])
  },
  methods: {
    ...mapActions("vsCpu", ["startGame", "nextAttempt"])
  },
  directives: {
    mask
  }
})
export default class VsCpu extends Vue {
  mainPlayer!: string;
  outlined!: boolean;
  filled!: boolean;
  attempts!: Attempt[];
  over!: boolean;
  startGame!: Function;
  nextAttempt!: Function;

  nextGuess = "";
  nextGuessRules = passwordRules;

  get validNextGuess() {
    return this.nextGuess.length === 5;
  }

  onClickAppend() {
    this.nextAttempt(this.nextGuess);
    this.nextGuess = "";
  }

  mounted() {
    this.startGame();
  }

  updated() {}
}
</script>
