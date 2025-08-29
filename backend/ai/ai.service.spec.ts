import { describe, it, expect, mock, beforeEach } from "bun:test";
import type { Aims, PossibleCheckouts } from "../../shared/types";
import { getCheckoutTargets } from "./ai.service";

describe("getCheckoutTargets", () => {
  const aims: Aims = {
    5: {
      darts: 925,
      5: 0.9,
      D5: 0.02,
      T5: 0.001,
      0: 0.05,
    },
  };

  const possibilities: PossibleCheckouts = {
    40: [["D20"]],
    50: [["DBull"], ["10", "10", "D15"]],
    170: [["T20", "T20", "DBull"]],
  };

  it("returns parsed checkout when model responds correctly", async () => {
    const result = await getCheckoutTargets({
      aims,
      possibilities,
      score: 50, //170,
    });

    console.log({ result });
    expect(result).toBeArray();
    // expect(result).toBeArrayOfSize(3);
    // expect(result).toEqual(["T20", "T20", "DBull"]);
  });
});
