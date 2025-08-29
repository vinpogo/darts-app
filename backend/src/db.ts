import { Database } from "bun:sqlite";

export const db = new Database("averages.sqlite", { create: true });