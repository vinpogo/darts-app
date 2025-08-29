import { describe, it, expect, mock, beforeEach } from "bun:test";
import type { Aims, PossibleCheckouts } from "../../shared/types";
import { getCheckoutTargets } from "./ai.service";

describe("getCheckoutTargets", () => {
  const possibilities: PossibleCheckouts = {
    40: [["D20"]],
    50: [["DBull"], ["10", "10", "D15"]],
    170: [["T20", "T20", "DBull"]],
  };

  it("returns parsed checkout when model responds correctly", async () => {
    const result = await getCheckoutTargets({
      aims: {
        5: {
          darts: 925,
          5: 0.9,
          D5: 0.02,
          T5: 0.001,
          0: 0.05,
        },
      },
      possibilities: {
        40: [["D20"]],
        50: [["DBull"], ["10", "10", "D15"]],
        170: [["T20", "T20", "DBull"]],
      },
      score: 50, //170,
    });

    console.log({ result });
    expect(result).toBeArray();
    // expect(result).toBeArrayOfSize(3);
    // expect(result).toEqual(["T20", "T20", "DBull"]);
  });


  it.only("test", async () => {
    const result = await getCheckoutTargets({
      aims: {
        15: {
          darts: 1000,
          15: 0,
          0: 1
        },
        5: {
          darts: 1000,
          5: 0.5,
          13: 0.5
        },
        13: {
          darts: 1000,
          13: 0.51,
        },
        "D20": {
          darts: 1000,
          "D20": 0.2,
          0: 0.8
        },
        "D16": {
          darts: 1000,
          "D16": 1,
        }
      },
      possibilities: {
        45: [["15", "D15"], ["5", "D20"], ["13", "D16"]],
      },
      score: 45,
    });

    console.log({ result });
    expect(result).toBeArray();
    // expect(result).toBeArrayOfSize(3);
    // expect(result).toEqual(["T20", "T20", "DBull"]);
  });
});
