import { Attempt, randomPassword, computeResult } from "@/models/shared";
import { MutationTree, ActionTree, Module } from "vuex";
import { RootState } from "@/store";

export type State = {
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
  resetGame(state) {
    state.attempts = [];
  },
  nextAttempt(state, payload: Attempt) {
    state.attempts.push(payload);
    if (payload.result.down === 5) {
      state.over = true;
    }
  }
};

const actions: ActionTree<State, RootState> = {
  startGame(context) {
    context.commit("startGame");
  },
  resetGame(context) {
    context.commit("resetGame");
  },
  nextAttempt(context, guess: string) {
    const attemp: Attempt = {
      target: context.state.target,
      guess: guess,
      result: computeResult(context.state.target, guess)
    };
    context.commit("nextAttempt", attemp);
  }
};

const vsCpuModule: Module<State, RootState> = {
  namespaced: true,
  mutations,
  actions,
  state
};

export enum Actions {
  startGame = "startGame",
  resetGame = "resetGame",
  nextAttempt = "nextAttempt"
}

export default vsCpuModule;
