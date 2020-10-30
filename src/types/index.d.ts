export type FRCEvent = {
  slug: string;
  robotEntries: Array<FRCRobotEntry>;
  tba: TBAData;
};

export type FRCRobotEntry = {
  matchNumber: number;
  teamNumber: number;
  autonomousPath: Array<[number, number]>;
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

type TBAAlliance = {
  score: number;
  team_keys: string[];
  surrogate_team_keys: string[];
  dq_team_keys: string[];
};

type TBAScoreBreakdown = {
  tba_gameData: 'LLL' | 'RRR' | 'RRL' | 'RLL' | 'LLL' | 'LRR' | 'LLR';
};

export type TBAMatch = {
  key: string;
  comp_level: 'qm' | 'f';
  set_number: number;
  match_number: number;
  alliances: {
    red: TBAAlliance;
    blue: TBAAlliance;
  };
  score_breakdown: {
    red: TBAScoreBreakdown;
    blue: TBAScoreBreakdown;
  };
  winning_alliance: 'blue' | 'red';
  event_key: string;
  time: number;
  predicted_time: number;
  actual_time: number;
};

export type TBAData = { [key: string]: TBAMatch };
