import { Database, SQLQueryBindings } from "bun:sqlite";
import { ScoringAverage, Field } from "../../shared/types";

export const db = new Database("averages.sqlite", { create: true });

export function addAims(scoringAverage: ScoringAverage) {
  const stmt = db.prepare("INSERT INTO aims (json) VALUES (?)");
  stmt.run(JSON.stringify(scoringAverage));
}

export function getAims(): ScoringAverage {
  const query = db.query<ScoringAverage[], SQLQueryBindings>(
    "SELECT json FROM aims order by id DESC LIMIT 1;"
  );
  // @ts-expect-error sqlite
  const firstResult = query.all()?.[0]?.json;
  if (firstResult == undefined) {
    return {};
  }
  return JSON.parse(String(firstResult));
}
