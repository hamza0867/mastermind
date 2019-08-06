import { Module, MutationTree, ActionTree, GetterTree } from "vuex";
import { RootState } from "@/store";
import vuetify from "@/plugins/vuetify";

type State = {
  dark: boolean;
};

const state: State = {
  dark: false
};

const mutations: MutationTree<State> = {
  toggleLight(state) {
    state.dark = !state.dark;
    vuetify.framework.theme.dark = state.dark;
  }
};

const actions: ActionTree<State, RootState> = {
  toggleLight(context) {
    context.commit("toggleLight");
  }
};

const getters: GetterTree<State, RootState> = {
  filled: state => !state.dark,
  outlined: state => state.dark
};

const uiModule: Module<State, RootState> = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};

export enum Mutations {
  toggleLight = "toggleLight"
}

export default uiModule;
