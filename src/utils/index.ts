import { TBAMatch } from '@/types';

export const getPlatformColor = (
  gameData: 'LLL' | 'RRR' | 'RRL' | 'RLL' | 'LLL' | 'LRR' | 'LLR',
  platformIndex: number,
  left: boolean
) => (gameData[platformIndex] === (left ? 'L' : 'R') ? 'blue' : 'red');

export const getAllianceColor = (match: TBAMatch, teamNumber: number) =>
  match.alliances.red.team_keys.includes(`frc${teamNumber}`) ? 'red' : 'blue';

export const FIELD_DIMS = { w: 648, h: 360 };

export const transformCoordinates = ([y, x]: [number, number]): [
  number,
  number
] => [(y * 360) / 300, x + FIELD_DIMS.w / 2];

export const pathToD = (coords: [number, number][]) =>
  `M${coords[0][1]},${coords[0][0]}` +
  coords
    .slice(1)
    .map((coord) => `L${coord[1]},${coord[0]}`)
    .join('');

export const median = (array: number[]) => {
  array = array.sort();
  if (array.length % 2 === 0) {
    return (array[array.length / 2] + array[array.length / 2 - 1]) / 2;
  } else {
    return array[(array.length - 1) / 2];
  }
};
