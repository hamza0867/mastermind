import Vue from "vue";
import Vuex, { Store } from "vuex";
import Vuetify from "vuetify";
import Home from "@/views/Home.vue";
import { createLocalVue, mount } from "@vue/test-utils";
import { Actions } from "@/store";

const localVue = createLocalVue();

localVue.use(Vuex);
Vue.use(Vuetify);

let state: { mainPlayer: string };
let actions;
let store: Store<{ mainPlayer: string }>;
describe("Home", () => {
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
  it("should render properly", () => {
    const wrapper = mount(Home, {
      localVue,
      store,
      vuetify: new Vuetify()
    });
    Vue.nextTick().then(() => {
      const inputField = wrapper.find("input").element as HTMLInputElement;
      expect(inputField.value).toBe("Hamza");
    });
  });
});
