import { computeResult } from "@/models/shared";

describe("should compute result correctly", () => {
  it("should return 5/5 when guess matches target", () => {
    expect(computeResult("12345", "12345")).toEqual({ up: 5, down: 5 });
  });
  it("should return 5/3 when guess is 12354 and target is 12345 ", () => {
    expect(computeResult("12354", "12345")).toEqual({ up: 5, down: 3 });
  });
  it("should return 4/4 when guess is 12345 and target is 12344", () => {
    expect(computeResult("12345", "12344")).toEqual({ up: 4, down: 4 });
  });
  it("should return 0/0 when guess is 12345 and target is 00000", () => {
    expect(computeResult("12345", "00000")).toEqual({ up: 0, down: 0 });
  });
  it("should return 3/0 when guess is 12345 and target is 30102", () => {
    expect(computeResult("12345", "30102")).toEqual({ up: 3, down: 0 });
  });
});
