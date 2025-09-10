import { Field, ScoringAverage } from "../../shared/types";
import { getAims, addAims } from "./db";

export type DartShot = {
  aim: FieldWithout0;
  hit: Field;
};

export function processShotList(shots: DartShot[]) {
  const newScoringAverages: ScoringAverage[] = [];
  shots.forEach((shot) => {
    let scoringAverage = getScoringAverage(shot.aim);
    // Update the values of the scoring average
    const newScoringAverage = calculateScoringAverage(scoringAverage.new, shot);
    newScoringAverages.push(newScoringAverage);
    addAims({ ...scoringAverage.all, ...newScoringAverage });
  });

  return newScoringAverages;
}

type FieldWithout0 = Exclude<Field, "0">;

function getScoringAverage(shot: FieldWithout0) {
  const latestScoringAverage = getAims();
  // Get the key
  return { all: getAims(), new: { [shot]: { ...latestScoringAverage[shot] } } };
}

function calculateScoringAverage(
  scoringAverage: ScoringAverage,
  shot: DartShot
): ScoringAverage {
  const aim = String(shot.aim) as FieldWithout0;
  const hit = String(shot.hit) as FieldWithout0;
  return {
    ...scoringAverage,
    [aim]: {
      ...scoringAverage?.[aim],
      shots: (scoringAverage?.[aim]?.shots ?? 0) + 1,
      [hit]: (scoringAverage?.[aim]?.[hit] ?? 0) + 1,
    },
  };
}
