<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app clipped width="13vw">
      <v-list dense>
        <v-list-item link :to="{ name: 'home' }">
          <v-list-item-action>
            <v-icon>mdi-home</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link>
          <v-list-item-action>
            <v-icon>mdi-account-group</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Friends</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app color="indigo" dark clipped-left>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Mastermind</v-toolbar-title>
      <v-spacer />
      <v-btn data-test="toggleLighButton" icon @click="toggleLight()">
        <v-icon>{{ lightIcon }}</v-icon>
      </v-btn>
    </v-app-bar>

    <v-content>
      <router-view />
    </v-content>
    <v-footer color="indigo" app>
      <span class="white--text"
        >By
        <a
          href="https://github.com/hamza0867"
          target="_blank"
          style="color: white"
          >@hamza0867</a
        >
        &copy; 2019</span
      >
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { mapState, mapMutations, mapActions } from "vuex";
import store from "./store";
import { Mutations } from "./store/ui.store";

@Component({
  computed: {
    ...mapState("ui", ["dark"])
  },
  methods: {
    ...mapActions({
      toggleLight: "ui/" + Mutations.toggleLight
    })
  }
})
export default class App extends Vue {
  constructor() {
    super();
  }

  drawer: boolean | null = null;
  dark!: boolean;
  toggleLight!: Function;

  get lightIcon() {
    return this.dark ? "mdi-lightbulb-on" : "mdi-lightbulb-off";
  }
}
</script>
