import { Database, SQLQueryBindings } from "bun:sqlite";
import { ScoringAverage, Field } from "../../shared/types";

export const db = new Database("averages.sqlite", { create: true });

export function addAims(scoringAverage: ScoringAverage) {
    const stmt = db.prepare(
  "INSERT INTO aims (json) VALUES (?)"
);
stmt.run(170, 1, JSON.stringify(scoringAverage));
}

export function getAims() {
  const query = db.query<ScoringAverage[], SQLQueryBindings>(
    "SELECT json FROM aims LIMIT 1;"
  );

  // @ts-expect-error sqlite
  console.log('query.all()', query.all());
  // @ts-expect-error sqlite
  const someString = query.all()[0].json;
  console.log(someString);
  return JSON.parse(String(someString));
}
