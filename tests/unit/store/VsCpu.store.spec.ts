import { State, mutations, actions, Actions } from "@/store/vsCpu.store";
import { Attempt } from "@/models/shared";

describe("Mutations", () => {
  let state: State;

  beforeEach(() => {
    state = {
      over: false,
      attempts: [],
      target: ""
    };
  });

  describe("startGame", () => {
    it("should start a new game", () => {
      mutations.startGame(state);
      expect(state.attempts).toEqual([]);
      expect(state.target).toHaveLength(5);
      expect(state.over).toBe(false);
    });
  });

  describe("resetGame", () => {
    it("should clear the attempts", () => {
      mutations.resetGame(state);
      expect(state.attempts).toEqual([]);
    });
  });

  describe("nextAttempt", () => {
    it("should push the received attempt", () => {
      const attempt: Attempt = {
        guess: "12345",
        target: "72369",
        result: {
          up: 2,
          down: 2
        }
      };
      mutations.nextAttempt(state, attempt);
      expect(state.attempts[0]).toBe(attempt);
    });

    it("should end the game when the guess matches the target", () => {
      const attempt: Attempt = {
        guess: "12345",
        target: "12345",
        result: {
          up: 5,
          down: 5
        }
      };
      mutations.nextAttempt(state, attempt);
      expect(state.over).toBe(true);
    });

    it("should not end the game when the guess does not matches the target", () => {
      const attempt: Attempt = {
        guess: "12345",
        target: "12344",
        result: {
          up: 4,
          down: 4
        }
      };
      mutations.nextAttempt(state, attempt);
      expect(state.over).toBe(false);
    });
  });
});

describe("Actions", () => {
  let context: { commit: Function; state: State };

  beforeEach(() => {
    context = {
      commit: jest.fn(),
      state: {
        over: false,
        attempts: [],
        target: "12345"
      }
    };
  });

  describe("startGame", () => {
    it("should commit the mutation startGame", () => {
      (actions.startGame as Function)(context);
      expect(context.commit).toHaveBeenCalledWith(Actions.startGame);
    });
  });

  describe("resetGame", () => {
    it("should commit the mutation resetGame", () => {
      (actions.resetGame as Function)(context);
      expect(context.commit).toHaveBeenCalledWith(Actions.resetGame);
    });
  });

  describe("nextAttempt", () => {
    it("should compute attempt from guess then commit nextAttempt", () => {
      (actions.nextAttempt as Function)(context, "12345");
      expect(context.commit).toHaveBeenCalledWith(Actions.nextAttempt, {
        target: context.state.target,
        guess: "12345",
        result: {
          up: 5,
          down: 5
        }
      });
    });
  });
});
