import App from "@/App.vue";
import Vue from "vue";
import Vuex, { Store } from "vuex";
import Vuetify from "vuetify";
import { createLocalVue, shallowMount, Wrapper } from "@vue/test-utils";
import VueRouter from "vue-router";
import router from "@/router";
import store from "@/store";

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(VueRouter);
Vue.use(Vuetify);

describe("App.vue", () => {
  it("Has a light bulb icon", () => {
    const wrapper = shallowMount(App, {
      localVue,
      store,
      vuetify: new Vuetify()
    });
    const methods = {
      toggleLight: jest.fn()
    };

    wrapper.setMethods(methods);
    const toggleLighButton = wrapper.find("[data-test='toggleLighButton']");
    expect(toggleLighButton.exists()).toBeTruthy();
    toggleLighButton.vm.$emit("click");
    expect(methods.toggleLight).toHaveBeenCalled();
  });

  it("should show lightbulb-on when the theme is dark", () => {
    type State = {};
    const store: Store<State> = new Vuex.Store({
      state: {},
      modules: {
        ui: {
          namespaced: true,
          state: {
            dark: true
          }
        }
      }
    });
    const wrapper = shallowMount(App, {
      localVue,
      store,
      vuetify: new Vuetify()
    });
    const toggleLighButton = wrapper.find("[data-test='toggleLighButton']");
    expect(toggleLighButton.exists()).toBeTruthy();
    expect(toggleLighButton.find("v-icon-stub").text()).toBe(
      "mdi-lightbulb-on"
    );
  });
});
