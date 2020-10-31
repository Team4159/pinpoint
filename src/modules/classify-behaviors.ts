import { FRCRobotEntry } from '@/types';

type BehaviorClass = {
  test: (robotEntry: FRCRobotEntry) => boolean;
  name: string | ((robotEntry: FRCRobotEntry) => string);
};

const autoClasses: BehaviorClass[] = [
  {
    test: (robotEntry) =>
      robotEntry.autoScaleCubes > 0 && robotEntry.autoSwitchCubes > 0,
    name: (robotEntry) =>
      `${robotEntry.autoSwitchCubes} Cube Scale & ${robotEntry.autoSwitchCubes} Cube Switch Auto`,
  },
  {
    test: (robotEntry) =>
      robotEntry.autoScaleCubes > 0 && robotEntry.autoSwitchCubes == 0,
    name: (robotEntry) => `${robotEntry.autoScaleCubes} Cube Scale Auto`,
  },
  {
    test: (robotEntry) =>
      robotEntry.autoSwitchCubes > 0 && robotEntry.autoScaleCubes == 0,
    name: (robotEntry) => `${robotEntry.autoSwitchCubes} Cube Switch Auto`,
  },
  {
    test: (robotEntry) => robotEntry.autoCrossLine,
    name: 'Only Cross Auto Line',
  },
];

const teleopClasses: BehaviorClass[] = [
  {
    test: (robotEntry) =>
      robotEntry.scaleCubesTeleop >= robotEntry.ownSwitchCubesTeleop &&
      robotEntry.scaleCubesTeleop > 0,
    name: 'Scale',
  },
  {
    test: (robotEntry) => robotEntry.ownSwitchCubesTeleop > 0,
    name: (robotEntry) =>
      `Own Switch ${robotEntry.exchangeCubes > 0 ? '& Exchange' : ''}${robotEntry.playedDefense ? ' & Defense' : ''}`,
  },
  {
    test: (robotEntry) => robotEntry.oppSwitchCubesTeleop > 0,
    name: (robotEntry) =>
      `Opp. Switch${robotEntry.exchangeCubes > 0 ? ' & Exchange' : ''}${robotEntry.playedDefense ? ' & Defense' : ''}`,
  },
  {
    test: (robotEntry) => robotEntry.exchangeCubes > 0,
    name: 'Exchange',
  },
];

const identifyBehavior = (
  behaviorClasses: BehaviorClass[],
  robotEntry: FRCRobotEntry
) => {
  for (let behaviorClass of behaviorClasses) {
    if (behaviorClass.test(robotEntry)) {
      return typeof behaviorClass.name == 'function'
        ? behaviorClass.name(robotEntry)
        : behaviorClass.name;
    }
  }
  return 'Unknown';
};

const classifyBehaviors = (robotEntries: FRCRobotEntry[]) => {
  const autoBehaviors: { [key: string]: FRCRobotEntry[] } = {};
  const teleopBehaviors = {};

  for (let robotEntry of robotEntries) {
    const autoBehavior = identifyBehavior(autoClasses, robotEntry);
    if (!Object.keys(autoBehaviors).includes(autoBehavior)) {
      autoBehaviors[autoBehavior] = [];
    }
    autoBehaviors[autoBehavior].push(robotEntry);
    const teleopBehavior = identifyBehavior(teleopClasses, robotEntry);
    if (!Object.keys(teleopBehaviors).includes(teleopBehavior)) {
      teleopBehaviors[teleopBehavior] = [];
    }
    teleopBehaviors[teleopBehavior].push(robotEntry);
  }

  return {
    autoBehaviors,
    teleopBehaviors,
  };
};

export default classifyBehaviors;
