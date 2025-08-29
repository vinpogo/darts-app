import { Field, ScoringAverage } from "../../shared/types";
import { getAims, addAims } from "./db";

export type DartShot = {
  aim: Exclude<Field, "0">;
  hit: Field;
};

export function processShotList(shots: DartShot[]) {
  shots.forEach((shot) => {
    let scoringAverage = getScoringAverage(shot.aim);
    // Update the values of the scoring average
    const newScoringAverage = calculateScoringAverage(scoringAverage, shot);
    addAims(newScoringAverage);
  });
}

function getScoringAverage(shot: Exclude<Field, "0">): any {
  const latestScoringAverage = getAims();
  // Get the key
  return latestScoringAverage[shot];
}

function calculateScoringAverage(
  scoringAverage: ScoringAverage,
  shot: DartShot
): ScoringAverage {
  return {
    ...scoringAverage,
    [shot.aim]: {
      ...scoringAverage?.[shot.aim],
      shots: scoringAverage?.[shot.aim]?.shots ?? 0 + 1,
      [shot.hit]: scoringAverage?.[shot.aim]?.[shot.hit] ?? 0 + 1,
    },
  };
}
