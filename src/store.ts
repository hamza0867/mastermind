import Vue from "vue";
import Vuex, { Store, StoreOptions, MutationTree, ActionTree } from "vuex";
import uiModule from "./store/ui.store";
import vsCpuModule from "./store/vsCpu.store";
import vsFriendModule from "./store/vsFriend.store";

Vue.use(Vuex);

export type RootState = {
  mainPlayer: string;
  secondaryPlayer: string;
};

export const mutations: MutationTree<RootState> = {
  updateMainPlayer(state, name) {
    state.mainPlayer = name;
  },
  updateSecondaryPlayer(state, name) {
    state.secondaryPlayer = name;
  }
};

export const actions: ActionTree<RootState, RootState> = {
  updateMainPlayer(context, name) {
    context.commit("updateMainPlayer", name);
  },
  updateSecondaryPlayer(context, name) {
    context.commit("updateSecondaryPlayer", name);
  }
};

export enum Actions {
  updateMainPlayer = "updateMainPlayer",
  updateSecondaryPlayer = "updateSecondaryPlayer"
}

const stopreOptions: StoreOptions<RootState> = {
  modules: {
    ui: uiModule,
    vsCpu: vsCpuModule,
    vsFriend: vsFriendModule
  },
  state: {
    mainPlayer: "",
    secondaryPlayer: ""
  },
  mutations,
  actions
};

export default new Store(stopreOptions);
