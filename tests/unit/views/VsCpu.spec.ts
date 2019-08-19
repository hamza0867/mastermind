import Vue from "vue";
import Vuex, { Store, ModuleTree } from "vuex";
import Vuetify from "vuetify";
import VsCpu from "@/views/VsCpu.vue";
import { createLocalVue, shallowMount, mount } from "@vue/test-utils";
import VueRouter from "vue-router";
import router from "@/router";
import store from "@/store";

const localVue = createLocalVue();

localVue.use(Vuex);
localVue.use(VueRouter);
Vue.use(Vuetify);

describe("VsCpu", () => {
  beforeEach(() => {});

  it("should start the Game on mount", () => {
    const VsCpuComp = mount(VsCpu, {
      localVue,
      store: store,
      vuetify: new Vuetify(),
      router
    });

    const methods = {
      nextAttempt: jest.fn()
    };

    VsCpuComp.setMethods(methods);

    Vue.nextTick().then(() => {
      const guessInputField = VsCpuComp.find(
        "input[placeholder='Your guess here ...']"
      );

      const wrongInput = "123";
      guessInputField.setValue(wrongInput);
      expect((guessInputField.element as HTMLInputElement).value).toBe(
        wrongInput
      );

      const checkButton = () => VsCpuComp.find("i.mdi-check-outline");
      expect(checkButton().exists()).toBeFalsy();

      const goodInput = "12345";
      guessInputField.setValue(goodInput);
      expect(checkButton().exists()).toBeTruthy();
      checkButton().trigger("click");
      expect(methods.nextAttempt).toHaveBeenCalledWith("12345");
    });
  });
});
