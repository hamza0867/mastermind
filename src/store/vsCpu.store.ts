import { Attempt, randomPassword, computeResult } from "@/models/shared";
import { MutationTree, Action, ActionTree, Module } from "vuex";
import { RootState } from "@/store";

type State = {
  over: boolean;
  target: string;
  attempts: Attempt[];
};

function newGameState(): State {
  return {
    over: false,
    target: randomPassword(),
    attempts: []
  };
}

const state: State = newGameState();

const mutations: MutationTree<State> = {
  startGame(state) {
    const { attempts, target, over } = newGameState();
    state.attempts = attempts;
    state.target = target;
    state.over = over;
  },
  nextAttempt(state, payload: Attempt) {
    state.attempts.concat(payload);
  },
  finishGame(state) {
    state.over = true;
  }
};

const actions: ActionTree<State, RootState> = {
  startGame(context) {
    context.commit("startGame");
  },
  nextAttempt(context, guess: string) {
    const attemp: Attempt = {
      target: context.state.target,
      guess: guess,
      result: computeResult(context.state.target, guess)
    };
    context.commit("nextAttempt", attemp);
    if (attemp.result === { up: 5, down: 5 }) {
      context.commit("finishGame");
    }
  }
};

const vsCpuModule: Module<State, RootState> = {
  namespaced: true,
  mutations,
  actions,
  state
};

export default vsCpuModule;
