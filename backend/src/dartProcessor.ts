import { Field, ScoringAverage } from "../../shared/types";

export type DartShot = {
  aim: Exclude<Field, "0">;
  hit: Field;
};

export function processShotList(shots: DartShot[]) {
  shots.forEach((shot) => {
    let scoringAverage = getScoringAverage(shot.aim);
    // Update the values of the scoring average
    const newScoringAverage = calculateScoringAverage(scoringAverage, shot);
  });
}

function getScoringAverage(shot: Field): any {
  return {};
}

function calculateScoringAverage(
  scoringAverage: ScoringAverage,
  shot: DartShot
): ScoringAverage {
  return {
    ...scoringAverage,
    [shot.aim]: {
      ...scoringAverage[shot.aim],
      shots: scoringAverage[shot.aim].shots + 1,
      [shot.hit]: scoringAverage?.[shot.aim]?.[shot.hit] ?? 0 + 1,
    },
  };
}
