import { Module, MutationTree, ActionTree, GetterTree } from "vuex";
import { RootState } from "@/store";
import vuetify from "@/plugins/vuetify";

export type State = {
  dark: boolean;
};

const state: State = {
  dark: false
};

export const mutations: MutationTree<State> = {
  toggleLight(state) {
    state.dark = !state.dark;
    vuetify.framework.theme.dark = state.dark;
  }
};

export const actions: ActionTree<State, RootState> = {
  toggleLight(context) {
    context.commit("toggleLight");
  }
};

const getters: GetterTree<State, RootState> = {};

const uiModule: Module<State, RootState> = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};

export enum Actions {
  toggleLight = "toggleLight"
}

export default uiModule;
