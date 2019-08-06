import uiModule from "@/store/ui.store";

const uiStore = uiModule;

const state = uiModule.state;

describe("ui store", () => {
  it("should start with dark being false", () => {
    expect(state).toEqual({ dark: false });
  });
});
