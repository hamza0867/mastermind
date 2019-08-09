<template>
  <div>Message: {{ msg }}</div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component
export default class HelloWorld extends Vue {
  constructor() {
    super();
  }
  private msg = "Hello World";
}
</script>

<style scoped></style>
