import Vuetify, { VTextField } from "vuetify/lib";
import Vue from "vue";
import vuetify from "@/plugins/vuetify";
import { shallowMount, mount } from "@vue/test-utils";
import Vuex, { Store } from "vuex";
import Home from "@/views/Home.vue";
import { Actions } from "@/store";

Vue.use(Vuetify);

describe("Home.vue", () => {
  let actions;
  let state: { mainPlayer: string };
  let store: Store<{ mainPlayer: string }>;

  beforeEach(() => {
    state = {
      mainPlayer: "Hamza"
    };
    actions = {
      [Actions.updateMainPlayer]: jest.fn()
    };
    store = new Vuex.Store({
      state,
      actions
    });
  });

  it("should show the mainPlayer in inupt field", () => {
    const HomeComp = shallowMount(Home, { store });
    const textField = HomeComp.find("v-text-field");
    expect(textField.is(VTextField)).toBe(true);
  });
});
