export type FRCEvent = {
  slug: string;
  robotEntries: Array<FRCRobotEntry>;
};

export type FRCRobotEntry = {
  matchNumber: number;
  teamNumber: number;
  autonomousPath: Array<[number, number]>
  autoCrossLine: boolean;
  autoSwitchCubes: number;
  autoScaleCubes: number;
  ownSwitchCubesTeleop: number;
  scaleCubesTeleop: number;
  oppSwitchCubesTeleop: number;
  exchangeCubes: number;
  singleClimb: boolean;
  climbWithOneBuddy: boolean;
  climbWithTwoBuddies: boolean;
  playedDefense: boolean;
};
