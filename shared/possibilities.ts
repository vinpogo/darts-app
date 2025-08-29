import { Field } from "./types";

const scoringTable: Record<Exclude<Field, "0">, number> = {
  1: 1,
  D1: 2,
  T1: 3,
  2: 2,
  D2: 4,
  T2: 6,
  3: 3,
  D3: 6,
  T3: 9,
  4: 4,
  D4: 8,
  T4: 12,
  5: 5,
  D5: 10,
  T5: 15,
  6: 6,
  D6: 12,
  T6: 18,
  7: 7,
  D7: 14,
  T7: 21,
  8: 8,
  D8: 16,
  T8: 24,
  9: 9,
  D9: 18,
  T9: 27,
  10: 10,
  D10: 20,
  T10: 30,
  11: 11,
  D11: 22,
  T11: 33,
  12: 12,
  D12: 24,
  T12: 36,
  13: 13,
  D13: 26,
  T13: 39,
  14: 14,
  D14: 28,
  T14: 42,
  15: 15,
  D15: 30,
  T15: 45,
  16: 16,
  D16: 32,
  T16: 48,
  17: 17,
  D17: 34,
  T17: 51,
  18: 18,
  D18: 36,
  T18: 54,
  19: 19,
  D19: 38,
  T19: 57,
  20: 20,
  D20: 40,
  T20: 60,
  Bull: 25,
  DBull: 50,
};

const fields = Object.keys(scoringTable) as Field[];

const checkoutScores = Array.from({ length: 170 }).map((_, i) => i + 1);

function initialPossiblities(score: number): Field[][] {
  return fields
    .filter((field) => {
      const r = rest(score, [field]);
      if (r < 0) return false;
      if (r === 0 && !field.startsWith("D")) return false;
      return true;
    })
    .map((field) => [field]);
}

function rest(score: number, darts: Field[]): number {
  return darts.reduce((res, dart) => res - scoringTable[dart], score);
}

function possibilities(score: number): Field[][] {
  const afterFirstDart = initialPossiblities(score);
  const afterSecondDart = afterFirstDart
    .flatMap((path) => fields.map((field) => [...path, field]))
    .filter((path) => {
      const r = rest(score, path);
      if (r < 0) return false;
      if (r === 0 && path.at(-1) === "0") return true;
      if (r === 0 && !path.at(-1)?.startsWith("D")) return false;
      return true;
    });
  const afterThirdDart = afterSecondDart
    .flatMap((path) => fields.map((field) => [...path, field]))
    .filter((path) => {
      const r = rest(score, path);
      if (r !== 0) return false;
      if (r === 0 && path.at(-1) === "0") return true;
      if (r === 0 && !path.at(-1)?.startsWith("D")) return false;
      return true;
    });
  // .map((path) =>
  //   path.reduceRight<Field[]>((res, field) => {
  //     if (field === "0" && res.length !== 0) res.unshift(field);
  //     if (field !== "0") res.unshift(field);
  //     return res;
  //   }, [])
  // );
  return afterThirdDart;
}

function getAllPossibilities() {
  return checkoutScores.reduce((res, score) => {
    res[score] = possibilities(score);
    return res;
  }, {});
}

console.log(JSON.stringify(getAllPossibilities()));
