import { FRCRobotEntry } from '@/types';

type BehaviorClass = {
  test: (robotEntry: FRCRobotEntry) => boolean;
  name: string | ((robotEntry: FRCRobotEntry) => string);
};

const numsToWords = {
  1: 'Single',
  2: 'Double',
  3: 'Triple',
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
  }
];

const classifyBehaviors = (robotEntries: FRCRobotEntry[]) => {
  const autoBehaviors: { [key: string]: FRCRobotEntry[] } = {};
  const teleopBehaviors = {};

  for (let robotEntry of robotEntries) {
    let found = false;
    for (let autoClass of autoClasses) {
      if (autoClass.test(robotEntry)) {
        const autoBehavior =
          typeof autoClass.name == 'function'
            ? autoClass.name(robotEntry)
            : autoClass.name;
        if (!Object.keys(autoBehaviors).includes(autoBehavior)) {
          autoBehaviors[autoBehavior] = [];
        }
        autoBehaviors[autoBehavior].push(robotEntry);
        found = true;
        break;
      }
    }
    if (!found) {
      if (!Object.keys(autoBehaviors).includes('Unknown')) {
        autoBehaviors['Unknown'] = [];
      }
      autoBehaviors['Unknown'].push(robotEntry);
    }
  }

  return {
    autoBehaviors,
    teleopBehaviors,
  };
};

export default classifyBehaviors;
