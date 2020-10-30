import { useContext, useEffect, useMemo, useState } from 'react';
import {
  Badge,
  Box,
  Flex,
  Heading,
  Image,
  ImageProps,
  Link,
  Select,
  Text,
  useTheme,
} from '@chakra-ui/core';
import { motion } from 'framer-motion';
import { CheckIcon, CloseIcon, UpDownIcon } from '@chakra-ui/icons';
import Stack from '@/components/motion-stack';
import PlayingField from '@/components/playing-field';
import Container from '@/components/container';
import Header from '@/components/header';

import { computed, observable, IObservableValue } from 'mobx';
import { useObserver } from 'mobx-react';
import { EventContext } from '@/stores/EventStore';

import _ from 'lodash';
import {
  getAllianceColor,
  FIELD_DIMS,
  transformCoordinates,
  pathToD,
} from '@/utils';
import classifyBehaviors from '@/modules/classify-behaviors';

import * as styles from '@/styles';

import { FRCRobotEntry, TBAMatch } from '@/types';

enum ViewType {
  Match = 'match',
  Team = 'team',
}

const RobotPath: React.FC<{
  label: string;
  color: string;
  isFlipped?: boolean;
  path: [number, number][];
}> = ({ label, color, isFlipped = false, path }) => {
  if (path.length == 0) {
    return null;
  }

  const transformedPath: [number, number][] = !isFlipped
    ? path
        .map(transformCoordinates)
        .map(([y, x]) => [y, FIELD_DIMS.w - x])
    : path
        .map(transformCoordinates)
        .map(([y, x]) => [FIELD_DIMS.h - y, x]);

  return (
    <g>
      <text
        fill={color}
        x={Math.min(Math.max(transformedPath[0][1], 0), FIELD_DIMS.w - 40)}
        y={transformedPath[0][0] - 5}
      >
        {label}
      </text>
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1, transition: { duration: 1 } }}
        stroke={color}
        strokeDasharray={null}
        strokeWidth="1.5"
        fill="none"
        d={pathToD(transformedPath)}
      />
    </g>
  );
};

const PowerCube: React.FC<ImageProps> = (props) => (
  <Image
    src={process.env.PREFIX_PATH + '/power-cube.svg'}
    boxSize={5}
    {...props}
  />
);

const CubeDisplay: React.FC<{ numCubes: number }> = ({ numCubes }) => {
  const cubeIcons = Array(Math.floor(numCubes))
    .fill(null)
    .map((_, idx) => <PowerCube key={idx} />);
  if (numCubes % 1 != 0) {
    cubeIcons.push(
      <PowerCube
        key={numCubes}
        css={{
          clipPath: `inset(0px ${(1 - (numCubes % 1)) * 100}% 0px 0px)`,
        }}
      />
    );
  }

  return (
    <Stack isInline spacing={1} justifyContent="center">
      {cubeIcons}
    </Stack>
  );
};
const BoolDisplay: React.FC<{ b: boolean }> = ({ b }) => (
  <Flex justifyContent="center">
    {b ? <CheckIcon color="green.600" /> : <CloseIcon color="red.600" />}
  </Flex>
);

const MatchScoringBreakdown: React.FC<{
  robotEntries: FRCRobotEntry[];
  tbaMatch: TBAMatch;
  viewType: IObservableValue<ViewType>;
  selectedView: IObservableValue<number>;
}> = ({ robotEntries, tbaMatch, viewType, selectedView }) => {
  return (
    <Stack
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      alignItems="center"
    >
      <Heading fontSize="3xl">scoring breakdown</Heading>
      <Stack isInline alignItems="center">
        <Heading color="red.600">{tbaMatch.alliances.red.score}</Heading>
        {tbaMatch.winning_alliance == 'red' && <CheckIcon color="green.600" />}
        <Heading>-</Heading>
        <Heading color="blue.600">{tbaMatch.alliances.blue.score}</Heading>
        {tbaMatch.winning_alliance == 'blue' && <CheckIcon color="green.600" />}
      </Stack>
      <table>
        <thead>
          <tr>
            <Box as="th" />
            <Box as="th" {...styles.cell} colSpan={3}>
              Autonomous
            </Box>
            <Box as="th" {...styles.cell} colSpan={3}>
              Teleop
            </Box>
            <Box as="th" {...styles.cell} colSpan={1}>
              Endgame
            </Box>
            <Box as="th" {...styles.cell} colSpan={2}>
              Misc.
            </Box>
          </tr>
          <tr>
            <Box as="th" />
            <Box as="th" {...styles.cell}>
              Scale
            </Box>
            <Box as="th" {...styles.cell}>
              Switch
            </Box>
            <Box as="th" {...styles.cell}>
              Line
            </Box>
            <Box as="th" {...styles.cell}>
              Scale
            </Box>
            <Box as="th" {...styles.cell}>
              Own Switch
            </Box>
            <Box as="th" {...styles.cell}>
              Opp. Switch
            </Box>
            <Box as="th" {...styles.cell}>
              Climb
            </Box>
            <Box as="th" {...styles.cell}>
              Exchange
            </Box>
            <Box as="th" {...styles.cell}>
              Defense
            </Box>
          </tr>
        </thead>
        <tbody>
          {robotEntries.map((robotEntry, idx) => (
            <Box
              key={idx}
              as="tr"
              cursor="pointer"
              onClick={() => {
                viewType.set(ViewType.Team);
                selectedView.set(robotEntry.teamNumber);
              }}
            >
              <Box
                as="th"
                color={`${getAllianceColor(
                  tbaMatch,
                  robotEntry.teamNumber
                )}.600`}
                {...styles.cell}
              >
                {robotEntry.teamNumber}
              </Box>
              <Box as="td" {...styles.cell}>
                <CubeDisplay numCubes={robotEntry.autoScaleCubes} />
              </Box>
              <Box as="td" {...styles.cell}>
                <CubeDisplay numCubes={robotEntry.autoSwitchCubes} />
              </Box>
              <Box as="td" {...styles.cell}>
                <BoolDisplay b={robotEntry.autoCrossLine} />
              </Box>
              <Box as="td" {...styles.cell}>
                <CubeDisplay numCubes={robotEntry.scaleCubesTeleop} />
              </Box>
              <Box as="td" {...styles.cell}>
                <CubeDisplay numCubes={robotEntry.ownSwitchCubesTeleop} />
              </Box>
              <Box as="td" {...styles.cell}>
                <CubeDisplay numCubes={robotEntry.oppSwitchCubesTeleop} />
              </Box>
              <Box as="td" {...styles.cell}>
                <Stack isInline spacing={1} justifyContent="center">
                  {Array(
                    robotEntry.singleClimb
                      ? 1
                      : robotEntry.climbWithOneBuddy
                      ? 2
                      : robotEntry.climbWithTwoBuddies
                      ? 3
                      : 0
                  )
                    .fill(null)
                    .map((_, idx) => (
                      <UpDownIcon key={idx} color="white" />
                    ))}
                </Stack>
              </Box>
              <Box as="td" {...styles.cell}>
                <CubeDisplay numCubes={robotEntry.oppSwitchCubesTeleop} />
              </Box>
              <Box as="td" {...styles.cell}>
                <BoolDisplay b={robotEntry.playedDefense} />
              </Box>
            </Box>
          ))}
        </tbody>
      </table>
    </Stack>
  );
};

const TeamAnalysis: React.FC<{
  robotEntries: FRCRobotEntry[];
  viewType: IObservableValue<ViewType>;
  selectedView: IObservableValue<number>;
}> = ({ robotEntries, viewType, selectedView }) => {
  const behaviors = useMemo(() => classifyBehaviors(robotEntries), [
    robotEntries,
  ]);

  return (
    <Stack
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      alignItems="center"
      spacing={6}
    >
      <Heading fontSize="3xl">auto behaviors</Heading>
      <Stack isInline spacing={12}>
        {Object.keys(behaviors.autoBehaviors)
          .sort((a, b) => behaviors.autoBehaviors[b].length - behaviors.autoBehaviors[a].length)
          .map((autoBehavior, idx) => (
            <Stack key={idx} alignItems="center" fontWeight="bold">
              <PlayingField
                height="150"
                width="135"
                colorScheme="split"
                viewBox="0 0 324 360"
              >
                {behaviors.autoBehaviors[autoBehavior].map((robotEntry) => {
                  if (robotEntry.autonomousPath.length == 0) {
                    return null;
                  }

                  return (
                    <RobotPath
                      key={`${robotEntry.matchNumber}${robotEntry.teamNumber}`}
                      label={robotEntry.matchNumber.toString()}
                      color='yellow'
                      path={robotEntry.autonomousPath}
                    />
                  );
                })}
                <line
                  x1="323.5"
                  x2="323.5"
                  y1="0"
                  y2="360"
                  stroke="gray"
                  strokeWidth="1.5"
                />
              </PlayingField>
              <Text>{autoBehavior}</Text>
              <Text>
                {behaviors.autoBehaviors[autoBehavior].length} /{' '}
                {robotEntries.length}
              </Text>
            </Stack>
          ))
        }
      </Stack>
    </Stack>
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
              };
              const aColor = getAllianceColor(
                getTBAMatch(a.matchNumber),
                a.teamNumber
              );
              const bColor = getAllianceColor(
                getTBAMatch(b.matchNumber),
                b.teamNumber
              );
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
                <Box
                  as="option"
                  value=""
                >
                  No Events Found
                </Box>
              )}
              {Object.keys(eventStore.events).map((eventSlug) => (
                <Box
                  key={eventSlug}
                  as="option"
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
                selectedView.set(
                  Math.min(
                    ...(viewType.get() == ViewType.Match
                      ? teamNumbers.get()
                      : matchNumbers.get())
                  )
                );
                viewType.set(e.target.value as ViewType);
              }}
            >
              <Box as="option" value={ViewType.Match}>
                match
              </Box>
              <Box as="option" value={ViewType.Team}>
                team
              </Box>
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
                <Box key={viewId} as="option" value={viewId}>
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
            alignItems="center"
            spacing={6}
          >
            <Stack alignItems="center">
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
                  <Image
                    src={process.env.PREFIX_PATH + '/tba_lamp.svg'}
                    height="25px"
                  />
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
                    cursor="pointer"
                    onClick={() => {
                      selectedView.set(
                        robotEntry[
                          (viewType.get() == ViewType.Match
                            ? 'team'
                            : 'match') + 'Number'
                        ]
                      );
                      viewType.set(
                        viewType.get() == ViewType.Match
                          ? ViewType.Team
                          : ViewType.Match
                      );
                    }}
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
            <PlayingField
              colorScheme={
                viewType.get() === ViewType.Team
                  ? 'split'
                  : getTBAMatch(selectedView.get()).score_breakdown.blue
                      .tba_gameData
              }
            >
              {selectedEntries.get().map((robotEntry) => (
                <RobotPath
                  key={`${selectedEventSlug.get()}${robotEntry.matchNumber}${
                    robotEntry.teamNumber
                  }`}
                  isFlipped={
                    getAllianceColor(
                      getTBAMatch(robotEntry.matchNumber),
                      robotEntry.teamNumber
                    ) == 'red'
                  }
                  color={
                    theme.colors[
                      getAllianceColor(
                        getTBAMatch(robotEntry.matchNumber),
                        robotEntry.teamNumber
                      )
                    ][600]
                  }
                  label={robotEntry[
                    (viewType.get() == ViewType.Match ? 'team' : 'match') +
                      'Number'
                  ].toString()}
                  path={robotEntry.autonomousPath}
                />
              ))}
            </PlayingField>
            {viewType.get() == ViewType.Match ? (
              <MatchScoringBreakdown
                key={selectedView.get()}
                robotEntries={selectedEntries.get()}
                tbaMatch={getTBAMatch(selectedView.get())}
                viewType={viewType}
                selectedView={selectedView}
              />
            ) : (
              <TeamAnalysis
                key={selectedView.get()}
                robotEntries={selectedEntries.get()}
                viewType={viewType}
                selectedView={selectedView}
              />
            )}
          </Stack>
        )}
      </Stack>
    </Container>
  ));
};

export default HomePage;
