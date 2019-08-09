<template>
  <div class="main-content">
    <v-form style="width: 100%" v-model="valid">
      <v-container fluid>
        <v-layout justify-center align-center column>
          <v-layout row justify-center align-center style="width: 100%">
            <v-flex sm6>
              <v-text-field
                label="Player"
                outlined="outlined"
                :rules="nameRules"
                v-model="dirtyMainPlayer"
              />
            </v-flex>
          </v-layout>
          <v-btn
            outlined
            color="primary"
            :disabled="!valid"
            @click.prevent="playVsCPU"
          >
            Play vs CPU
          </v-btn>
        </v-layout>
      </v-container>
    </v-form>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { mapState, mapActions, mapGetters } from "vuex";
import { Actions } from "../store";

@Component({
  computed: {
    ...mapState("ui", ["dark"]),
    ...mapState(["mainPlayer"])
  },
  methods: {
    ...mapActions([Actions.updateMainPlayer])
  }
})
export default class Home extends Vue {
  mainPlayer!: string;
  dirtyMainPlayer = "";
  dark!: boolean;
  updateMainPlayer!: Function;
  nameRules = [
    (name: string) => !!name || "Player name is required",
    (name: string) =>
      (!!name && name.length >= 3) || "Player name must have at least 3 letters"
  ];

  valid = false;

  mounted() {
    if (this.mainPlayer) {
      this.dirtyMainPlayer = this.mainPlayer;
    }
  }

  playVsCPU() {
    this.updateMainPlayer(this.dirtyMainPlayer);
    this.$router.push({ name: "VsCpu" });
  }
}
</script>

<style scoped>
.main-content {
  display: flex;
  flex-direction: row;
  justify-items: center;
  align-items: flex-start;
  height: 100vh;
  margin-top: 1.25rem;
}
</style>
