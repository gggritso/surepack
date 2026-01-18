import { execSync } from "child_process";
import { join } from "path";

const CLI_PATH = join(__dirname, "../dist/cli.js");

const testAnswers = {
  destination: "Test Trip",
  departureDate: "2025-01-15",
  returnDate: "2025-01-20",
  leavingCanada: false,
  accessToBodyOfWater: false,
  willNeedASuit: false,
  willBeWorking: false,
  willHaveLaundry: false,
  workouts: 0,
  lowTemperature: 10,
  highTemperature: 15,
  rainDays: 0,
  areThereBugs: false,
  extras: [],
};

function runCli(format: string, answers: object, cwd?: string): string {
  return execSync(`echo '${JSON.stringify(answers)}' | node ${CLI_PATH} --format=${format}`, {
    encoding: "utf-8",
    cwd,
    shell: "/bin/bash",
  });
}

describe("CLI", () => {
  beforeAll(() => {
    execSync("pnpm build", { cwd: join(__dirname, "..") });
  });

  it("should output things format without error", () => {
    const result = runCli("things", testAnswers);
    expect(result).toContain("things:///json?data=");
  });

  it("should output markdown format without error", () => {
    const result = runCli("markdown", testAnswers);

    expect(result).toContain("# Test Trip");
    expect(result).toContain("## Dopp");
    expect(result).toContain("## Backpack");
    expect(result).toContain("## Duffel");
  });

  it("should handle single-night trips (no main container)", () => {
    const singleNightAnswers = {
      ...testAnswers,
      returnDate: "2025-01-16",
    };

    const result = runCli("markdown", singleNightAnswers);

    expect(result).toContain("## Dopp");
    expect(result).toContain("## Backpack");
    expect(result).not.toContain("## Duffel");
    expect(result).not.toContain("## Suitcase");
  });

  it("should use suitcase for long trips", () => {
    const longTripAnswers = {
      ...testAnswers,
      returnDate: "2025-01-25",
    };

    const result = runCli("markdown", longTripAnswers);

    expect(result).toContain("## Suitcase");
    expect(result).not.toContain("## Duffel");
  });

  it("should exit with error for unknown format", () => {
    expect(() => runCli("invalid", testAnswers)).toThrow();
  });

  it("should work when run from a different directory", () => {
    // Run CLI from /tmp to ensure embedded affinity data works
    // regardless of working directory
    const result = runCli("markdown", testAnswers, "/tmp");

    expect(result).toContain("# Test Trip");
    expect(result).toContain("## Dopp");
    expect(result).toContain("toothbrush");
  });
});
