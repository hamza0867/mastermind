import { State, mutations, actions, Actions } from "@/store/ui.store";

describe("mutations", () => {
  let state: State;
  beforeEach(() => {
    state = {
      dark: false
    };
  });

  describe("toggleLight", () => {
    it("should turn lights off when dark is false", () => {
      mutations.toggleLight(state);
      expect(state.dark).toBe(true);
    });

    it("should turn lights on when dark is true", () => {
      state.dark = true;
      mutations.toggleLight(state);
      expect(state.dark).toBe(false);
    });
  });
});

describe("actions", () => {
  let context: { commit: Function };

  beforeEach(() => {
    context = {
      commit: jest.fn()
    };
  });

  describe("toggleLight", () => {
    it("should commit toggleLight", () => {
      (actions.toggleLight as Function)(context);
      expect(context.commit).toHaveBeenCalledWith(Actions.toggleLight);
    });
  });
});
