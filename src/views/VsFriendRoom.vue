<template>
  <div class="d-flex flex-column pa-4">
    <v-layout column>
      <v-layout row justify-center class="px-4 mb-2">
        <v-flex md2 xs12>
          <v-text-field
            class="center-text"
            outlined
            readonly
            :value="$route.params.roomNumber"
          />
        </v-flex>
      </v-layout>
    </v-layout>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component
export default class VsFriendRoom extends Vue {}
</script>

<style scoped>
.center-text >>> input {
  text-align: center;
}
</style>
