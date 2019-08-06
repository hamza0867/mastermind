<template>
  <v-container fluid fill-height>
    <v-layout justify-center wrap mt-4 column>
      <v-layout row justify-center shrink>
        <v-flex sm6>
          <v-text-field
            label="Player"
            :filled="filled"
            :outlined="outlined"
            :value="mainPlayer"
            readonly
          />
        </v-flex>
      </v-layout>
      <v-layout row justify-center>
        <v-flex sm6>
          <v-layout column align-center>
            <v-text-field
              style="width: 100%"
              append-icon="mdi-check-outline"
              :filled="filled"
              :outlined="outlined"
            />
          </v-layout>
        </v-flex>
      </v-layout>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { mapState, mapGetters } from "vuex";

@Component({
  computed: {
    ...mapState(["mainPlayer", "secondaryPlayer"]),
    ...mapGetters("ui", ["outlined", "filled"])
  }
})
export default class VsCpu extends Vue {
  mainPlayer!: string;
  outlined!: boolean;
  filled!: boolean;
}
</script>
