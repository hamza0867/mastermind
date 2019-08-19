import { mutations, RootState, actions } from "@/store";
import { Actions } from "@/store";

describe("store mutations", () => {
  let state: RootState;

  beforeEach(() => {
    state = {
      mainPlayer: "Player 1",
      secondaryPlayer: "Player 2"
    };
  });

  it("should update mainPlayer", () => {
    mutations.updateMainPlayer(state, "Hamza");
    expect(state.mainPlayer).toBe("Hamza");
  });

  it("should update secondaryPlayer", () => {
    mutations.updateSecondaryPlayer(state, "Khadija");
    expect(state.secondaryPlayer).toBe("Khadija");
  });
});

describe("store actions", () => {
  let context: { commit: Function };

  beforeEach(() => {
    context = {
      commit: jest.fn()
    };
  });

  describe("updateMainPlayer", () => {
    it("should send commit to mutation with given params", () => {
      (actions.updateMainPlayer as Function)(context, "Hamza");
      expect(context.commit).toHaveBeenCalledWith(
        Actions.updateMainPlayer,
        "Hamza"
      );
    });
  });

  describe("updateSecondaryPlayer", () => {
    it("should send commit to mutation with given params", () => {
      (actions.updateSecondaryPlayer as Function)(context, "Hamza");
      expect(context.commit).toHaveBeenCalledWith(
        Actions.updateSecondaryPlayer,
        "Hamza"
      );
    });
  });
});
