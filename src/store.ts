import Vue from "vue";
import Vuex, {
  Store,
  StoreOptions,
  MutationTree,
  ActionTree,
  GetterTree
} from "vuex";
import uiModule from "./store/ui.store";

Vue.use(Vuex);

export type RootState = {
  mainPlayer: string;
  secondaryPlayer: string;
};

const mutations: MutationTree<RootState> = {
  updateMainPlayer(state, name) {
    state.mainPlayer = name;
  },
  updateSecondaryPlayer(state, name) {
    state.secondaryPlayer = name;
  }
};

const actions: ActionTree<RootState, RootState> = {
  updateMainPlayer(context, name) {
    context.commit("updateMainPlayer", name);
  },
  updateSecondaryPlayer(context, name) {
    context.commit("updateMainPlayer", name);
  }
};

export enum Actions {
  updateMainPlayer = "updateMainPlayer",
  updateSecondaryPlayer = "updateSecondaryPlayer"
}

const stopreOptions: StoreOptions<RootState> = {
  modules: {
    ui: uiModule
  },
  state: {
    mainPlayer: "",
    secondaryPlayer: ""
  },
  mutations,
  actions
};

export default new Store(stopreOptions);
