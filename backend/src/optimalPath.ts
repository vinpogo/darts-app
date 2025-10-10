import type { Field, PlayerProfile } from "../../shared/types.ts";
import { getAllPossibilities } from "../../shared/possibilities.ts";
import allPossibilities from "../../shared/possibilities.json" with {
  type: "json",
};
import { randomProfile, type Stats } from "../../shared/playerProfile.ts";

//
// one path needs to create other paths
// - check first dart and see if any of the other target with hit probability can finish
// -- if yes, grab all those paths
// --- for each of those do the same
//
// by the end of this we have all possible paths
// - calculate the probability of every single one of them
// -- sum up the probabilities
//
// e.g.: score 4, analyzing [D2]
// outcome [D2], [2, D1], [D1, D1], [1, 1, D1]
//

const chanceToFinishScore = (
  score: number,
  profile: PlayerProfile,
  dartsLeft = 3,
) =>
  allPossibilities[String(score) as keyof typeof allPossibilities]
    .filter((path) => path.length <= dartsLeft)
    .reduce(
      (chance, path) => chance + chanceToFinishPath(path as Field[], profile),
      0,
    );

const chanceToFinishPath = (path: Field[], profile: PlayerProfile) =>
  path.reduce((chance, field) => chance * profile[field].stats[field], 1);

const replaceFirstFieldWithChance = (
  path: (number | Field)[],
  chance: number,
) => {
  let replaced = false;
  const result: typeof path = [];
  for (const value of path) {
    if (!replaced && typeof value === "string") {
      result.push(chance);
      replaced = true;
      continue;
    }
    result.push(value);
  }
  return result;
};
const resolvePath = (
  path: (number | Field)[],
  profile: PlayerProfile,
): number => {
  const target = path.find((field) => typeof field === "string");
  if (!target) {
    // we can actually resolve this path to a chance as no targets are left
    return (path as number[]).reduce((total, chance) => total + chance);
  }

  // we need to explode the one path to all possible paths according to all the miss rates
  const { stats } = profile[target as Field];
  const exploded = Object.entries(stats)
    .reduce(
      (res, [_, chance]) => {
        res.push(replaceFirstFieldWithChance(path, chance));
        return res;
      },
      [] as typeof path[],
    );
  return exploded.flatMap((innerPath) => resolvePath(innerPath, profile))
    .reduce((total, chance) => total + chance);
};

const profile = randomProfile();
console.log(resolvePath(["D16"], profile), profile["D16"]);
