import { describe, it, expect, mock, beforeEach } from "bun:test";
import { getCheckoutTargets } from "./ai.service";

describe("getCheckoutTargets", () => {

  it("setup shot 501", async () => {
    const result = await getCheckoutTargets({
      aims: {},
      possibilities: [],
      score: 501,
    });

    expect(result.checkout).toEqual(["T20", "T20", "T20"]);
  });

  it("finishing 164", async () => {
    const result = await getCheckoutTargets({
      aims: {},
      possibilities: [['T20', 'T18', 'DBull'],['T19', 'T19', 'DBull']],
      score: 164,
    });

    expect(result.checkout).toEqual(['T20', 'T18', 'DBull']);
  });

  it("finishing 164 with better T19 accuracy", async () => {
    const input = {
      aims: {
        "T19": {
          darts: 1000,
          "T19": 900,
          0: 100
        },
        "T20": {
          darts: 1000,
          "T20": 100,
          "20": 900,
        }
      },
      possibilities: [['T20', 'T18', 'DBull'],['T19', 'T19', 'DBull']],
      score: 164,
    }
    const result = await getCheckoutTargets(input);

    expect(result.checkout).toEqual(['T19', 'T19', 'DBull']);
  });

  it("finishing 61", async () => {
    const result = await getCheckoutTargets({
      aims: {},
      possibilities: [["T15", "D8"], ["T7", "D20"], ["T11", "D14"]],
      score: 61,
    });

    expect(result.checkout).toEqual(["T15", "D8"]);
  });

  it("finishing 81", async () => {
    const result = await getCheckoutTargets({
      aims: {
        "D18": {
          darts: 1000,
          "D18": 600,
          "D12": 400
        },
        "T15": {
          darts: 1000,
          "T15": 500,
          0: 500
        },
        "D12": {
          darts: 1000,
          "D12": 200,
          0: 800
        },
        "T19": {
          darts: 1000,
          "T19": 300,
          0: 700
        }
      },
      possibilities: [["T19", "D12"], ["T15", "D18"]],
      score: 81,
    });

    expect(result.checkout).toEqual(["T15", "D18"]);
  });
});
