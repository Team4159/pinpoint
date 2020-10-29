import { useContext, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Heading,
  Select,
  Text,
  useTheme,
} from '@chakra-ui/core';
import { motion } from 'framer-motion';
import Stack from '@/components/motion-stack';
import Container from '@/components/container';
import Header from '@/components/header';

import { computed, observable } from 'mobx';
import { useObserver } from 'mobx-react';
import { EventContext } from '@/stores/EventStore'

import _ from 'lodash';

import * as styles from '@/styles';

import { FRCRobotEntry } from '@/types';

enum ViewType {
  Match = 'match',
  Team = 'team',
};

const FIELD_DIMS = { w: 648, h: 360 };

const transformCoordinates = ([y, x]: [number, number]): [number, number] =>
  [y * 360 / 300, x + FIELD_DIMS.w / 2];

const pathToD = (coords: [number, number][]) => 
  `M${coords[0][1]},${coords[0][0]}` +
  coords.slice(1).map(coord => `L${coord[1]},${coord[0]}`).join('');

const RobotPath: React.FC<{
  robotEntry: FRCRobotEntry;
  allianceColor: 'red' | 'blue';
}> = ({ robotEntry, allianceColor }) => {
  if (robotEntry.autonomousPath.length == 0) {
    return null;
  }

  const theme = useTheme();

  const path: [number, number][] = allianceColor == 'blue' ?
    robotEntry.autonomousPath
      .map(transformCoordinates).map(([y, x]) => [y, FIELD_DIMS.w - x]) :
    robotEntry.autonomousPath.map(transformCoordinates)
      .map(([y, x]) => [FIELD_DIMS.h - y, x]);

  return (
    <g>
      <text
        fill={theme.colors[allianceColor][600]}
        x={Math.min(Math.max(path[0][1], 0), FIELD_DIMS.w - 40)}
        y={path[0][0] - 5}
      >
        {robotEntry.teamNumber}
      </text>
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1, transition: { duration: 1 } }}
        stroke={theme.colors[allianceColor][600]}
        strokeDasharray={null}
        fill='none'
        d={pathToD(path)}
      />
    </g>
  )
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
  const selectedEvent = computed(() =>
    eventStore.events[selectedEventSlug.get()]
  );

  const matchNumbers = computed(() =>
    _.uniq(
      selectedEvent.get() ? selectedEvent.get().robotEntries.map(robotEntry => robotEntry.matchNumber) : []
    ).sort((a, b) => a - b)
  );
  const teamNumbers = computed(() =>
    _.uniq(
      selectedEvent.get() ? selectedEvent.get().robotEntries.map(robotEntry => robotEntry.teamNumber) : []
    ).sort((a, b) => a - b)
  );

  const [viewType] = useState(observable.box(ViewType.Match));
  const selectedViewIds = computed(() =>
    viewType.get() == ViewType.Match ? matchNumbers.get() : teamNumbers.get()
  );

  const [selectedView] = useState(observable.box(1));
  const selectedEntries = computed(() => 
    selectedEvent.get() ? selectedEvent.get().robotEntries.filter(robotEntry => robotEntry[viewType.get() + 'Number'] == selectedView) : []
  );

  const getTBAMatch = (matchNumber: number) => selectedEvent.get().tba[`${selectedEventSlug.get()}_qm${matchNumber}`];
  const getPlatformColor = (matchNumber: number, platformIndex: number, left: boolean) => 
    theme.colors[getTBAMatch(matchNumber).score_breakdown.blue.tba_gameData[platformIndex] === (left ? 'L' : 'R') ? 'blue' : 'red'][600];
  const getAllianceColor = (matchNumber: number, teamNumber: number) =>
    getTBAMatch(matchNumber).alliances.red.team_keys.includes(`frc${teamNumber}`) ? 'red' : 'blue';

  return useObserver(() => (
    <Container>
      <Header />
      <Stack isInline spacing={16} paddingY={6}>
        <Stack>
          <Box>
            <Text fontWeight='bold' paddingBottom={1}>
              event
            </Text>
            <Select
              {...styles.select}
              value={selectedEventSlug.get()}
              onChange={e => selectedEventSlug.set(e.target.value)}
            >
              {Object.keys(eventStore.events).length == 0 && (
                <option value=''>No Events Found</option>
              )}
              {Object.keys(eventStore.events).map(eventSlug => (
                <option key={eventSlug} value={eventSlug}>
                  {eventSlug}
                </option>
              ))}
            </Select>
          </Box>
          <Box>
            <Text fontWeight='bold' paddingBottom={1}>
              view type
            </Text>
            <Select
              {...styles.select}
              value={viewType.get()}
              onChange={e => {
                viewType.set(e.target.value as ViewType);
                selectedView.set(Math.min(...(viewType.get() == ViewType.Match ? matchNumbers.get() : teamNumbers.get())));
              }}
            >
              <option value={ViewType.Match}>match</option>
              <option value={ViewType.Team}>team</option>
            </Select>
          </Box>
          <Box>
            <Text fontWeight='bold' paddingBottom={1}>
              selected {viewType.get()}
            </Text>
            <Select
              {...styles.select}
              value={selectedView.get()}
              onChange={e => selectedView.set(parseInt(e.target.value))}
            >
              {selectedViewIds.get().map(viewId => (
                <option key={viewId} value={viewId}>
                  {viewId}
                </option>
              ))}
            </Select>
          </Box>
        </Stack>
        {selectedEvent.get() && (
          <Stack alignItems='start' flexGrow={1} spacing={6}>
            <Stack
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Heading>
                {viewType.get()} {selectedView.get()}
              </Heading>
              <Text fontWeight='bold' color='gray.400'>
                {viewType.get() == ViewType.Match ? 'teams' : 'matches'}:{' '}
                {
                  selectedEntries.get().map((robotEntry, idx) => (
                    <Text
                      as='span'
                      key={idx}
                      color={
                        getAllianceColor(robotEntry.matchNumber, robotEntry.teamNumber) == 'red' ?
                        'red.600' :
                        'blue.600'
                      }
                    >
                      {robotEntry[(viewType.get() == ViewType.Match ? 'team' : 'match') + 'Number']}
                    </Text>
                  // @ts-ignore
                  )).reduce((acc, cur) => [acc, ', ', cur])
                }
              </Text>
            </Stack>
            <svg
              width='648'
              height='360'
              xmlns='http://www.w3.org/2000/svg'
            >
              { /* Field Outline */ }
              <rect stroke='white' strokeWidth='1.5' x='0' y='0' width='648' height='360'/>
              { /* Auto Lines */ }
              <line fill='none' stroke={theme.colors.blue[600]} strokeWidth='1.5' x1='120' y1='0' x2='120' y2='360'/>
              <line fill='none' stroke={theme.colors.red[600]} strokeWidth='1.5' x1='528' y1='0' x2='528' y2='360'/>
              { /* Switch Boxes */ }
              <rect stroke={viewType.get() == ViewType.Match ? getPlatformColor(selectedView.get(), 0, true) : theme.colors.blue[600]} strokeWidth='1.5' x='144' y='108' width='48' height='36'/>
              <rect stroke={viewType.get() == ViewType.Match ? getPlatformColor(selectedView.get(), 0, false) : theme.colors.red[600]} strokeWidth='1.5' x='144' y='216' width='48' height='36'/>
              <rect stroke={viewType.get() == ViewType.Match ? getPlatformColor(selectedView.get(), 2, true) : theme.colors.blue[600]} strokeWidth='1.5' x='456' y='108' width='48' height='36'/>
              <rect stroke={viewType.get() == ViewType.Match ? getPlatformColor(selectedView.get(), 2, false) : theme.colors.red[600]} strokeWidth='1.5' x='456' y='216' width='48' height='36'/>
              { /* Scale Boxes */ }
              <rect stroke={viewType.get() == ViewType.Match ? getPlatformColor(selectedView.get(), 1, true) : theme.colors.blue[600]} strokeWidth='1.5' x='300' y='72' width='48' height='36'/>
              <rect stroke={viewType.get() == ViewType.Match ? getPlatformColor(selectedView.get(), 1, false) : theme.colors.red[600]} strokeWidth='1.5' x='300' y='252' width='48' height='36'/>
              { /* Horizontal Platform Sides */ }
              <rect stroke='gray' strokeWidth='1.5' x='259' y='115.25' width='130' height='12.75'/>
              <rect stroke='gray' strokeWidth='1.5' x='259' y='232' width='130' height='12.75'/>
              { /* Vertical Platform Sides */ }
              <rect stroke='gray' strokeWidth='1.5' x='259' y='128' width='12.75' height='104'/>
              <rect stroke='gray' strokeWidth='1.5' x='376.25' y='128' width='12.75' height='104'/>
              { /* Switch Beams */ }
              <rect stroke='gray' strokeWidth='1.5' x='474' y='144' width='12' height='72'/>
              <rect stroke='gray' strokeWidth='1.5' x='162' y='144' width='12' height='72'/>
              { /* Scale Beam */ }
              <rect stroke='gray' strokeWidth='1.5' x='318' y='108.3125' width='12' height='143.5'/>
              { /* Switch Bounds */ }
              <line stroke='gray' strokeWidth='1.5' x1='456' y1='144' x2='456' y2='216'/>
              <line stroke='gray' strokeWidth='1.5' x1='504' y1='144' x2='504' y2='216'/>
              <line stroke='gray' strokeWidth='1.5' x1='144' y1='144' x2='144' y2='216'/>
              <line stroke='gray' strokeWidth='1.5' x1='192' y1='144' x2='192' y2='216'/>
              { /* Exchange Zones */ }
              <rect stroke={theme.colors.blue[600]} strokeWidth='1.5' x='0' y='120' width='36' height='48'/>
              <rect stroke={theme.colors.red[600]} strokeWidth='1.5' x='612' y='192' width='36' height='48'/>
              {
                selectedEntries.get().map(robotEntry => (
                  <RobotPath
                    key={`${robotEntry.matchNumber}${robotEntry.teamNumber}`}
                    robotEntry={robotEntry}
                    allianceColor={getAllianceColor(robotEntry.matchNumber, robotEntry.teamNumber)}
                  />
                ))
              }
            </svg>
          </Stack>
        )}
      </Stack>
    </Container>
  ));
}

export default HomePage;
