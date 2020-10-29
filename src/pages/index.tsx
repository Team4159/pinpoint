import { useContext, useEffect, useState } from 'react';
import {
  Badge,
  Box,
  Flex,
  Heading,
  Image,
  Link,
  Select,
  Text,
  useTheme,
} from '@chakra-ui/core';
import { motion } from 'framer-motion';
import { CheckIcon, CloseIcon, UpDownIcon } from '@chakra-ui/icons';
import Stack from '@/components/motion-stack';
import Container from '@/components/container';
import Header from '@/components/header';

import { computed, observable, IObservableValue } from 'mobx';
import { useObserver } from 'mobx-react';
import { EventContext } from '@/stores/EventStore';

import _ from 'lodash';

import * as styles from '@/styles';

import { FRCRobotEntry, TBAMatch } from '@/types';

enum ViewType {
  Match = 'match',
  Team = 'team',
};

const getPlatformColor = (
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
  
const getAllianceColor = (match: TBAMatch, teamNumber: number) =>
  match.alliances.red.team_keys.includes(
    `frc${teamNumber}`
  )
    ? 'red'
    : 'blue';

const FIELD_DIMS = { w: 648, h: 360 };

const transformCoordinates = ([y, x]: [number, number]): [number, number] => [
  (y * 360) / 300,
  x + FIELD_DIMS.w / 2,
];

const pathToD = (coords: [number, number][]) =>
  `M${coords[0][1]},${coords[0][0]}` +
  coords
    .slice(1)
    .map((coord) => `L${coord[1]},${coord[0]}`)
    .join('');

const RobotPath: React.FC<{
  robotEntry: FRCRobotEntry;
  allianceColor: 'red' | 'blue';
  viewType: ViewType;
}> = ({ allianceColor, robotEntry, viewType }) => {
  if (robotEntry.autonomousPath.length == 0) {
    return null;
  }

  const theme = useTheme();

  const path: [number, number][] =
    allianceColor == 'blue'
      ? robotEntry.autonomousPath
          .map(transformCoordinates)
          .map(([y, x]) => [y, FIELD_DIMS.w - x])
      : robotEntry.autonomousPath
          .map(transformCoordinates)
          .map(([y, x]) => [FIELD_DIMS.h - y, x]);

  return (
    <g>
      <text
        fill={theme.colors[allianceColor][600]}
        x={Math.min(Math.max(path[0][1], 0), FIELD_DIMS.w - 40)}
        y={path[0][0] - 5}
      >
        {robotEntry[(viewType == ViewType.Match ? 'team' : 'match') + 'Number']}
      </text>
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1, transition: { duration: 1 } }}
        stroke={theme.colors[allianceColor][600]}
        strokeDasharray={null}
        strokeWidth="1.5"
        fill="none"
        d={pathToD(path)}
      />
    </g>
  );
};

const PowerCube: React.FC = () => (
  <Image src='/power-cube.svg' boxSize={5}/>
);

const CubeDisplay: React.FC<{ numCubes: number  }> = ({ numCubes }) => (
  <Stack isInline spacing={1} justifyContent='center'>
    {Array(numCubes).fill(null).map(() => <PowerCube/>)}
  </Stack>
);
const BoolDisplay: React.FC<{ b: boolean }> = ({ b }) => (
  <Flex justifyContent='center'>
    {b ? <CheckIcon color='green.600'/> : <CloseIcon color='red.600'/>}
  </Flex>
);

const MatchScoringBreakdown: React.FC<{
  robotEntries: FRCRobotEntry[];
  tbaMatch: TBAMatch;
  viewType: IObservableValue<ViewType>;
  selectedView: IObservableValue<number>;
}> = ({ robotEntries, tbaMatch, viewType, selectedView }) => {
  const theme = useTheme();

  return (
    <Stack
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      alignItems='center'
    >
      <Heading fontSize='3xl'>
        scoring breakdown
      </Heading>
      <Stack isInline alignItems='center'>
        <Heading color='red.600'>
          {tbaMatch.alliances.red.score}
        </Heading>
        {tbaMatch.winning_alliance == 'red' && <CheckIcon color='green.600'/>}
        <Heading>
          -
        </Heading>
        <Heading color='blue.600'>
          {tbaMatch.alliances.blue.score}
        </Heading>
        {tbaMatch.winning_alliance == 'blue' && <CheckIcon color='green.600'/>}
      </Stack>
      <table>
        <thead>
          <tr>
            <Box as='th'/>
            <Box as='th' {...styles.cell} colSpan={3}>
              Autonomous
            </Box>
            <Box as='th' {...styles.cell} colSpan={3}>
              Teleop
            </Box>
            <Box as='th' {...styles.cell} colSpan={1}>
              Endgame
            </Box>
            <Box as='th' {...styles.cell} colSpan={2}>
              Misc.
            </Box>
          </tr>
          <tr>
            <Box as='th'/>
            <Box as='th' {...styles.cell}>
              Scale
            </Box>
            <Box as='th' {...styles.cell}>
              Switch
            </Box>
            <Box as='th' {...styles.cell}>
              Line
            </Box>
            <Box as='th' {...styles.cell}>
              Scale
            </Box>
            <Box as='th' {...styles.cell}>
              Own Switch
            </Box>
            <Box as='th' {...styles.cell}>
              Opp. Switch
            </Box>
            <Box as='th' {...styles.cell}>
             Climb
            </Box>
            <Box as='th' {...styles.cell}>
              Exchange
            </Box>
            <Box as='th' {...styles.cell}>
              Defense
            </Box>
          </tr>
        </thead>
        <tbody>
          {robotEntries.map(robotEntry => (
            <Box
              as='tr'
              cursor='pointer'
              onClick={() => {
                viewType.set(ViewType.Team);
                selectedView.set(robotEntry.teamNumber);
              }}
            >
              <Box
                as='th'
                color={`${getAllianceColor(tbaMatch, robotEntry.teamNumber)}.600`}
                {...styles.cell}
              >
                {robotEntry.teamNumber}
              </Box>
              <Box as='td' {...styles.cell}><CubeDisplay numCubes={robotEntry.autoScaleCubes}/></Box>
              <Box as='td' {...styles.cell}><CubeDisplay numCubes={robotEntry.autoSwitchCubes}/></Box>
              <Box as='td' {...styles.cell}><BoolDisplay b={robotEntry.autoCrossLine}/></Box>
              <Box as='td' {...styles.cell}><CubeDisplay numCubes={robotEntry.scaleCubesTeleop}/></Box>
              <Box as='td' {...styles.cell}><CubeDisplay numCubes={robotEntry.ownSwitchCubesTeleop}/></Box>
              <Box as='td' {...styles.cell}><CubeDisplay numCubes={robotEntry.oppSwitchCubesTeleop}/></Box>
              <Box as='td' {...styles.cell}>
                <Stack isInline spacing={1} justifyContent='center'>
                  {Array(
                    robotEntry.singleClimb ? 1 :
                      (robotEntry.climbWithOneBuddy ? 2 :
                        robotEntry.climbWithTwoBuddies ? 3 : 0)
                  ).fill(null).map(() => (
                    <UpDownIcon color='white'/>
                  ))}
                </Stack>
              </Box>
              <Box as='td' {...styles.cell}><CubeDisplay numCubes={robotEntry.oppSwitchCubesTeleop}/></Box>
              <Box as='td' {...styles.cell}><BoolDisplay b={robotEntry.playedDefense}/></Box>
            </Box>
          ))}
        </tbody>
      </table>
    </Stack>
  );
};

const TeamAnalysis: React.FC = () => {
  return (
    null
  );
};

const HomePage: React.FC = () => {
  const theme = useTheme();

  useEffect(() => {
    eventStore.loadEvent('2018cc').then(() => {
      selectedEventSlug.set('2018cc');
    });
    eventStore.loadEvent('2018roe');
  }, []);

  const eventStore = useContext(EventContext);

  const [selectedEventSlug] = useState(observable.box(''));
  const selectedEvent = computed(
    () => eventStore.events[selectedEventSlug.get()]
  );

  const getTBAMatch = (matchNumber: number) =>
    selectedEvent.get().tba[`${selectedEventSlug.get()}_qm${matchNumber}`];

  const matchNumbers = computed(() =>
    _.uniq(
      selectedEvent.get()
        ? selectedEvent
            .get()
            .robotEntries.map((robotEntry) => robotEntry.matchNumber)
        : []
    ).sort((a, b) => a - b)
  );
  const teamNumbers = computed(() =>
    _.uniq(
      selectedEvent.get()
        ? selectedEvent
            .get()
            .robotEntries.map((robotEntry) => robotEntry.teamNumber)
        : []
    ).sort((a, b) => a - b)
  );

  const [viewType] = useState(observable.box(ViewType.Match));
  const selectedViewIds = computed(() =>
    viewType.get() == ViewType.Match ? matchNumbers.get() : teamNumbers.get()
  );

  const [selectedView] = useState(observable.box(1));
  const selectedEntries = computed(() =>
    selectedEvent.get()
      ? selectedEvent
          .get()
          .robotEntries.filter(
            (robotEntry) =>
              robotEntry[viewType.get() + 'Number'] == selectedView
          )
          .sort((a, b) => {
            if (viewType.get() == ViewType.Team) {
              return a.matchNumber - b.matchNumber;
            } else {
              const colors = {
                red: 0,
                blue: 1,
              }
              const aColor = getAllianceColor(getTBAMatch(a.matchNumber), a.teamNumber);
              const bColor = getAllianceColor(getTBAMatch(b.matchNumber), b.teamNumber);
              if (aColor == bColor) {
                return a.teamNumber - b.teamNumber;
              } else {
                return colors[aColor] - colors[bColor];
              }
            }
          })
      : []
  );

  return useObserver(() => (
    <Container>
      <Header />
      <Stack isInline spacing={16} paddingY={6}>
        <Stack>
          <Box>
            <Text fontWeight="bold" paddingBottom={1}>
              event
            </Text>
            <Select
              {...styles.select}
              value={selectedEventSlug.get()}
              onChange={(e) => {
                selectedEventSlug.set(e.target.value);
                selectedView.set(
                  Math.min(
                    ...(viewType.get() == ViewType.Match
                      ? matchNumbers.get()
                      : teamNumbers.get())
                  )
                );
              }}
            >
              {Object.keys(eventStore.events).length == 0 && (
                <Box as='option' backgroundColor={theme.colors.gray[600]} value="">
                  No Events Found
                </Box>
              )}
              {Object.keys(eventStore.events).map((eventSlug) => (
                <Box
                  key={eventSlug}
                  as='option'
                  backgroundColor='gray.600'
                  value={eventSlug}
                >
                  {eventSlug}
                </Box>
              ))}
            </Select>
          </Box>
          <Box>
            <Text fontWeight="bold" paddingBottom={1}>
              view type
            </Text>
            <Select
              {...styles.select}
              value={viewType.get()}
              onChange={(e) => {
                viewType.set(e.target.value as ViewType);
                selectedView.set(
                  Math.min(
                    ...(viewType.get() == ViewType.Match
                      ? matchNumbers.get()
                      : teamNumbers.get())
                  )
                );
              }}
            >
              <Box as='option' value={ViewType.Match}>match</Box>
              <Box as='option' value={ViewType.Team}>team</Box>
            </Select>
          </Box>
          <Box>
            <Text fontWeight="bold" paddingBottom={1}>
              selected {viewType.get()}
            </Text>
            <Select
              {...styles.select}
              value={selectedView.get()}
              onChange={(e) => selectedView.set(parseInt(e.target.value))}
            >
              {selectedViewIds.get().map((viewId) => (
                <Box key={viewId} as='option' value={viewId}>
                  {viewId}
                </Box>
              ))}
            </Select>
          </Box>
        </Stack>
        {selectedEvent.get() && (
          <Stack
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            alignItems='center'
            spacing={6}
          >
            <Stack alignItems='center'>
              <Stack isInline alignItems="center" spacing={4}>
                <Heading>
                  {viewType.get()} {selectedView.get()}
                </Heading>
                <Link
                  href={
                    'https://thebluealliance.com/' +
                    (viewType.get() == ViewType.Match
                      ? `match/${selectedEventSlug.get()}_qm${selectedView.get()}`
                      : `team/${selectedView.get()}/${selectedEventSlug
                          .get()
                          .slice(0, 4)}`)
                  }
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <Image src="/tba_lamp.svg" height="25px" />
                </Link>
              </Stack>
              <Stack
                isInline
                alignItems="center"
                fontWeight="bold"
                color="gray.400"
              >
                <Text>
                  {viewType.get() == ViewType.Match ? 'teams' : 'matches'}:{' '}
                </Text>
                {selectedEntries.get().map((robotEntry, idx) => (
                  <Badge
                    key={idx}
                    variant="solid"
                    colorScheme={getAllianceColor(
                      getTBAMatch(robotEntry.matchNumber),
                      robotEntry.teamNumber
                    )}
                  >
                    {
                      robotEntry[
                        (viewType.get() == ViewType.Match ? 'team' : 'match') +
                          'Number'
                      ]
                    }
                  </Badge>
                ))}
              </Stack>
            </Stack>
            <svg
              style={{ maxWidth: '648px' }}
              viewBox="0 0 648 360"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Field Outline */}
              <rect
                stroke="white"
                strokeWidth="1.5"
                x="0"
                y="0"
                width="648"
                height="360"
              />
              {/* Auto Lines */}
              <line
                fill="none"
                stroke={theme.colors.blue[600]}
                strokeWidth="1.5"
                x1="120"
                y1="0"
                x2="120"
                y2="360"
              />
              <line
                fill="none"
                stroke={theme.colors.red[600]}
                strokeWidth="1.5"
                x1="528"
                y1="0"
                x2="528"
                y2="360"
              />
              {/* Switch Boxes */}
              <rect
                stroke={
                  theme.colors[viewType.get() == ViewType.Match ? getPlatformColor(getTBAMatch(selectedView.get()), 0, true) : 'blue'][600]
                }
                strokeWidth="1.5"
                x="144"
                y="108"
                width="48"
                height="36"
              />
              <rect
                stroke={
                  theme.colors[viewType.get() == ViewType.Match ? getPlatformColor(getTBAMatch(selectedView.get()), 0, false) : 'blue'][600]
                }
                strokeWidth="1.5"
                x="144"
                y="216"
                width="48"
                height="36"
              />
              <rect
                stroke={
                  theme.colors[viewType.get() == ViewType.Match ? getPlatformColor(getTBAMatch(selectedView.get()), 2, true) : 'red'][600]
                }
                strokeWidth="1.5"
                x="456"
                y="108"
                width="48"
                height="36"
              />
              <rect
                stroke={
                  theme.colors[viewType.get() == ViewType.Match ? getPlatformColor(getTBAMatch(selectedView.get()), 2, false) : 'red'][600]
                }
                strokeWidth="1.5"
                x="456"
                y="216"
                width="48"
                height="36"
              />
              {/* Scale Boxes */}
              <rect
                stroke={
                  theme.colors[viewType.get() == ViewType.Match ? getPlatformColor(getTBAMatch(selectedView.get()), 1, true) : 'blue'][600]
                }
                strokeWidth="1.5"
                x="300"
                y="72"
                width="48"
                height="36"
              />
              <rect
                stroke={
                  theme.colors[viewType.get() == ViewType.Match ? getPlatformColor(getTBAMatch(selectedView.get()), 1, false) : 'blue'][600]
                }
                strokeWidth="1.5"
                x="300"
                y="252"
                width="48"
                height="36"
              />
              {viewType.get() == ViewType.Team && (
                <g>
                  <rect
                    stroke={theme.colors.red[600]}
                    strokeWidth="1.5"
                    strokeDasharray="0 24 60"
                    x="300"
                    y="72"
                    width="48"
                    height="36"
                  />
                  <rect
                    stroke={theme.colors.red[600]}
                    strokeWidth="1.5"
                    strokeDasharray="0 24 60"
                    x="300"
                    y="252"
                    width="48"
                    height="36"
                  />
                </g>
              )}
              {/* Horizontal Platform Sides */}
              <rect
                stroke="gray"
                strokeWidth="1.5"
                x="259"
                y="115.25"
                width="130"
                height="12.75"
              />
              <rect
                stroke="gray"
                strokeWidth="1.5"
                x="259"
                y="232"
                width="130"
                height="12.75"
              />
              {/* Vertical Platform Sides */}
              <rect
                stroke="gray"
                strokeWidth="1.5"
                x="259"
                y="128"
                width="12.75"
                height="104"
              />
              <rect
                stroke="gray"
                strokeWidth="1.5"
                x="376.25"
                y="128"
                width="12.75"
                height="104"
              />
              {/* Switch Beams */}
              <rect
                stroke="gray"
                strokeWidth="1.5"
                x="474"
                y="144"
                width="12"
                height="72"
              />
              <rect
                stroke="gray"
                strokeWidth="1.5"
                x="162"
                y="144"
                width="12"
                height="72"
              />
              {/* Scale Beam */}
              <rect
                stroke="gray"
                strokeWidth="1.5"
                x="318"
                y="108.3125"
                width="12"
                height="143.5"
              />
              {/* Switch Bounds */}
              <line
                stroke="gray"
                strokeWidth="1.5"
                x1="456"
                y1="144"
                x2="456"
                y2="216"
              />
              <line
                stroke="gray"
                strokeWidth="1.5"
                x1="504"
                y1="144"
                x2="504"
                y2="216"
              />
              <line
                stroke="gray"
                strokeWidth="1.5"
                x1="144"
                y1="144"
                x2="144"
                y2="216"
              />
              <line
                stroke="gray"
                strokeWidth="1.5"
                x1="192"
                y1="144"
                x2="192"
                y2="216"
              />
              {/* Exchange Zones */}
              <rect
                stroke={theme.colors.blue[600]}
                strokeWidth="1.5"
                x="0"
                y="120"
                width="36"
                height="48"
              />
              <rect
                stroke={theme.colors.red[600]}
                strokeWidth="1.5"
                x="612"
                y="192"
                width="36"
                height="48"
              />
              {selectedEntries.get().map((robotEntry) => (
                <RobotPath
                  key={`${selectedEventSlug.get()}${robotEntry.matchNumber}${
                    robotEntry.teamNumber
                  }`}
                  robotEntry={robotEntry}
                  allianceColor={getAllianceColor(
                    getTBAMatch(robotEntry.matchNumber),
                    robotEntry.teamNumber
                  )}
                  viewType={viewType.get()}
                />
              ))}
            </svg>
            {viewType.get() == ViewType.Match ? (
              <MatchScoringBreakdown
                robotEntries={selectedEntries.get()}
                tbaMatch={getTBAMatch(selectedView.get())}
                viewType={viewType}
                selectedView={selectedView}
              />
            ) : (
              null
            )}
          </Stack>
        )}
      </Stack>
    </Container>
  ));
};

export default HomePage;
