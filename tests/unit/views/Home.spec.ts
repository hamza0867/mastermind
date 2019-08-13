import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex, { Store } from "vuex";
import Home from "@/views/Home.vue";
import { Actions } from "@/store";

const localVue = createLocalVue();
localVue.use(Vuex);

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
    const HomeComp = shallowMount(Home, { store, localVue });
    const inuptField = HomeComp.find("input");
    expect(inuptField.element.nodeValue).toEqual(state.mainPlayer);
  });
});
