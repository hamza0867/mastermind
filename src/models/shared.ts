export type Result = {
  up: number;
  down: number;
};

export type Attempt = {
  guess: string;
  target: string;
  result: Result;
};

export function computeResult(target: string, guess: string): Result {
  const orig = target.split("");
  let attempt = guess.split("");
  let i: number;
  let resUp = 0;
  for (const oChar of orig) {
    i = attempt.findIndex(s => s === oChar);
    if (i !== -1) {
      attempt.splice(i, 1);
      resUp++;
    }
  }

  attempt = guess.split("");

  const resDown = orig.reduce((acc, char, idx) => {
    if (char === attempt[idx]) {
      return acc + 1;
    }
    return acc;
  }, 0);

  return { up: resUp, down: resDown };
}

export function randomPassword(): string {
  return "" + Math.floor(Math.random() * Math.pow(10, 5));
}
