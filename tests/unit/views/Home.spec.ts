import Vue from "vue";
import Vuex, { Store } from "vuex";
import Vuetify from "vuetify";
import Home from "@/views/Home.vue";
import { createLocalVue, shallowMount, Wrapper } from "@vue/test-utils";
import VueRouter from "vue-router";
import router from "@/router";

const localVue = createLocalVue();

localVue.use(Vuex);
localVue.use(VueRouter);
Vue.use(Vuetify);

let state: { mainPlayer: string };
let store: Store<{ mainPlayer: string }>;
let HomeComp: Wrapper<Vue>;

describe("Home", () => {
  beforeEach(() => {
    state = {
      mainPlayer: "Hamza"
    };
    store = new Vuex.Store({
      state
    });
  });

  it("should render with mainPlayer from store", () => {
    HomeComp = shallowMount(Home, {
      localVue,
      store,
      vuetify: new Vuetify()
    });
    Vue.nextTick().then(() => {
      const textFieldValue = HomeComp.find("[label='Player']").props().value;
      expect(textFieldValue).toBe(state.mainPlayer);
    });
  });

  it("should render correctly when store is empty", () => {
    const emptyStore = new Vuex.Store({
      state: {
        mainPlayer: null
      }
    });
    HomeComp = shallowMount(Home, {
      localVue,
      store: emptyStore,
      vuetify: new Vuetify()
    });
    Vue.nextTick().then(() => {
      const textFieldValue = HomeComp.find("[label='Player']").props().value;
      expect(textFieldValue).toBe("");
    });
  });

  it("should send action updateMainPlayer to store with correct value", () => {
    HomeComp = shallowMount(Home, {
      localVue,
      store,
      vuetify: new Vuetify(),
      router: router
    });

    const methods = {
      updateMainPlayer: jest.fn()
    };
    HomeComp.setData({ dirtyMainPlayer: "Khadija", valid: true });
    HomeComp.setMethods(methods);
    const vsCpuButton = HomeComp.find("[data-test='playButton']");
    expect(vsCpuButton.exists()).toBeTruthy();
    vsCpuButton.vm.$emit("click", { preventDefault: jest.fn() });
    expect(methods.updateMainPlayer).toHaveBeenCalledWith("Khadija");
  });
});
