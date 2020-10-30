import { TBAMatch } from '@/types';

export const getPlatformColor = (
  match: TBAMatch,
  platformIndex: number,
  left: boolean
) =>
  match.score_breakdown.blue.tba_gameData[
      platformIndex
  ]
     === (left ? 'L' : 'R')
      ? 'blue'
      : 'red';
  
export const getAllianceColor = (match: TBAMatch, teamNumber: number) =>
  match.alliances.red.team_keys.includes(
    `frc${teamNumber}`
  )
    ? 'red'
    : 'blue';

export const FIELD_DIMS = { w: 648, h: 360 };

export const transformCoordinates = ([y, x]: [number, number]): [number, number] => [
  (y * 360) / 300,
  x + FIELD_DIMS.w / 2,
];

export const pathToD = (coords: [number, number][]) =>
  `M${coords[0][1]},${coords[0][0]}` +
  coords
    .slice(1)
    .map((coord) => `L${coord[1]},${coord[0]}`)
    .join('');
