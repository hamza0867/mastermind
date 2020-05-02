import { Attempt, computeResult } from "@/models/shared";
import { MutationTree, ActionTree, Module } from "vuex";
import { RootState } from "@/store";
import io from "socket.io-client";

type NOT_STARTED = "NOT_STARTED";
const NOT_STARTED = "NOT_STARTED";

type RESTARTING = "RESTARTING";
const RESTARTING = "RESTARTING";

export type GameState =
  | {
      type: "RUNNING";
      over: boolean;
      myPwd: string;
      myAttempts: Attempt[];
      otherAttempts: Attempt[];
      roomSocket: SocketIOClient.Socket;
    }
  | { type: NOT_STARTED }
  | {
      type: RESTARTING;
      roomSocket: SocketIOClient.Socket;
    }
  | {
      type: "LOADING";
      myPwd: string;
      meReady: boolean;
      otherReady: boolean;
      otherAcknowledgeMeReady: boolean;
      roomSocket: SocketIOClient.Socket;
    };

export type State = {
  gameState: GameState;
};

function newGameState(roomSocket: SocketIOClient.Socket): GameState {
  return {
    type: "LOADING",
    roomSocket,
    myPwd: "",
    otherReady: false,
    otherAcknowledgeMeReady: false,
    meReady: false
  };
}

const state: State = { gameState: { type: "NOT_STARTED" } };

export const mutations: MutationTree<State> = {
  restartingGame(state) {
    if (state.gameState.type === "RUNNING" && state.gameState.over) {
      state.gameState = {
        type: "RESTARTING",
        roomSocket: state.gameState.roomSocket
      };
    }
  },
  restartGame(state) {
    if (state.gameState.type === "RESTARTING") {
      state.gameState = newGameState(state.gameState.roomSocket);
    }
  },
  loadGame(state, roomSocket: SocketIOClient.Socket) {
    state.gameState = newGameState(roomSocket);
  },
  registerMyPwd(state, myPwd) {
    if (state.gameState.type === "LOADING") {
      state.gameState.myPwd = myPwd;
    }
  },
  setMeReady(state) {
    if (state.gameState.type === "LOADING") {
      state.gameState.meReady = true;
    }
  },
  setOtherReady(state) {
    if (state.gameState.type === "LOADING") {
      state.gameState.otherReady = true;
    }
  },
  setOtherAcknowledgedMeReady(state) {
    if (state.gameState.type === "LOADING") {
      state.gameState.otherAcknowledgeMeReady = true;
    }
  },
  startGame(state) {
    if (state.gameState.type === "LOADING") {
      state.gameState = {
        type: "RUNNING",
        over: false,
        myPwd: state.gameState.myPwd,
        myAttempts: [],
        otherAttempts: [],
        roomSocket: state.gameState.roomSocket
      };
    }
  },
  myNextAttempt(state, payload: Attempt) {
    if (state.gameState.type === "RUNNING") {
      state.gameState.myAttempts.push(payload);
      if (payload.result.down === 5) {
        state.gameState.over = true;
      }
    }
  },
  otherNextAttempt(state, payload: Attempt) {
    if (state.gameState.type === "RUNNING") {
      state.gameState.otherAttempts.push(payload);
      if (payload.result.down === 5) {
        state.gameState.over = true;
      }
    }
  }
};

export const actions: ActionTree<State, RootState> = {
  restartGame(ctx) {
    // eslint-disable-next-line
    console.log("restart");
    if (ctx.state.gameState.type === "RUNNING" && ctx.state.gameState.over) {
      ctx.state.gameState.roomSocket.emit("restartGame", {
        sender: ctx.rootState.mainPlayer
      });
      ctx.commit("restartingGame");
      setTimeout(() => {
        ctx.commit("restartGame");
      }, 1);
    }
  },
  loadGame(ctx, roomSocket: SocketIOClient.Socket) {
    roomSocket.on("restartGame", (_data: any) => {
      if (ctx.state.gameState.type === "RUNNING" && ctx.state.gameState.over) {
        ctx.dispatch("restartGame");
      }
    });

    roomSocket.on("ready", (data: any) => {
      ctx.commit("setOtherReady");
      ctx.commit("updateSecondaryPlayer", data.sender, { root: true });
      roomSocket.emit("readyAcknowledged", {
        sender: ctx.rootState.mainPlayer
      });
      if (
        ctx.state.gameState.type === "LOADING" &&
        !ctx.state.gameState.otherAcknowledgeMeReady &&
        ctx.state.gameState.meReady
      ) {
        ctx.dispatch("sendReady");
      }
      if (
        ctx.state.gameState.type === "LOADING" &&
        ctx.state.gameState.otherAcknowledgeMeReady &&
        ctx.state.gameState.meReady
      ) {
        ctx.commit("startGame");
      }
    });
    roomSocket.on("readyAcknowledged", (data: any) => {
      // eslint-disable-next-line
      ctx.commit("setOtherAcknowledgedMeReady");
      if (
        ctx.state.gameState.type === "LOADING" &&
        ctx.state.gameState.otherAcknowledgeMeReady &&
        ctx.state.gameState.otherReady
      ) {
        ctx.commit("startGame");
      }
    });
    roomSocket.on("guess", (data: any) => {
      if (ctx.state.gameState.type === "RUNNING") {
        const guess = data.guess;
        const result = computeResult(ctx.state.gameState.myPwd, data.guess);
        const attempt: Attempt = {
          guess,
          result
        };
        ctx.commit("otherNextAttempt", attempt);
        roomSocket.emit("attemptResult", {
          sender: ctx.rootState.mainPlayer,
          attempt
        });
      }
    });
    roomSocket.on("attemptResult", (data: any) => {
      if (ctx.state.gameState.type === "RUNNING") {
        ctx.commit("myNextAttempt", data.attempt);
      }
    });
    ctx.commit("loadGame", roomSocket);
  },
  sendReady(context) {
    if (context.state.gameState.type === "LOADING") {
      context.commit("setMeReady");
      context.state.gameState.roomSocket.emit("ready", {
        sender: context.rootState.mainPlayer
      });
    }
  },
  sendGuess(context, guess: string) {
    if (context.state.gameState.type === "RUNNING") {
      context.state.gameState.roomSocket.emit("guess", {
        sender: context.rootState.mainPlayer,
        guess
      });
    }
  }
};

const vsFriendModule: Module<State, RootState> = {
  namespaced: true,
  mutations,
  actions,
  state
};

export const Actions = Object.keys(actions).reduce(
  (acc, curr) => ({
    ...acc,
    curr
  }),
  {}
);

export default vsFriendModule;
