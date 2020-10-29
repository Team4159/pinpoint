import { useContext, useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Select,
  Stack,
  Text,
} from '@chakra-ui/core';
import { motion } from 'framer-motion';
import Container from '@/components/container';
import Header from '@/components/header';

import { computed, observable } from 'mobx';
import { useObserver } from 'mobx-react';
import { EventContext } from '@/stores/EventStore'

import _ from 'lodash';

import * as styles from '@/styles';

enum ViewType {
  Match = 'match',
  Team = 'team',
};

const HomePage: React.FC = () => {
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

  useEffect(() => {
    eventStore.loadEvent('2018cc').then(() => {
      selectedEventSlug.set('2018cc');
    });
    eventStore.loadEvent('2018roe');
  }, []);

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
        <Stack flexGrow={1} spacing={6}>
          <Heading>
            {viewType.get()} {selectedView.get()}
          </Heading>
          <motion.svg
            width='648'
            height='360'
            xmlns='http://www.w3.org/2000/svg'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            { /* Field Outline */ }
            <rect stroke='white' stroke-width='1.5' x='0' y='0' width='648' height='360'/>
            { /* Auto Lines */ }
            <line fill='none' stroke='red' stroke-width='1.5' x1='120' y1='0' x2='120' y2='360'/>
            <line fill='none' stroke='blue' stroke-width='1.5' x1='528' y1='0' x2='528' y2='360'/>
            { /* Switch Boxes */ }
            <rect stroke='red' stroke-width='1.5' x='144' y='108' width='48' height='36'/>
            <rect stroke='blue' stroke-width='1.5' x='144' y='216' width='48' height='36'/>
            <rect stroke='red' stroke-width='1.5' x='456' y='108' width='48' height='36'/>
            <rect stroke='blue' stroke-width='1.5' x='456' y='216' width='48' height='36'/>
            { /* Scale Boxes */ }
            <rect stroke='red' stroke-width='1.5' x='300' y='72' width='48' height='36'/>
            <rect stroke='blue' stroke-width='1.5' x='300' y='252' width='48' height='36'/>
            { /* Horizontal Platform Sides */ }
            <rect stroke='gray' stroke-width='1.5' x='259' y='115.25' width='130' height='12.75'/>
            <rect stroke='gray' stroke-width='1.5' x='259' y='232' width='130' height='12.75'/>
            { /* Vertical Platform Sides */ }
            <rect stroke='gray' stroke-width='1.5' x='259' y='128' width='12.75' height='104'/>
            <rect stroke='gray' stroke-width='1.5' x='376.25' y='128' width='12.75' height='104'/>
            { /* Switch Beams */ }
            <rect stroke='gray' stroke-width='1.5' x='474' y='144' width='12' height='72'/>
            <rect stroke='gray' stroke-width='1.5' x='162' y='144' width='12' height='72'/>
            { /* Scale Beam */ }
            <rect stroke='gray' stroke-width='1.5' x='318' y='108.3125' width='12' height='143.5'/>
            { /* Switch Bounds */ }
            <line fill='none' stroke='gray' stroke-width='1.5' x1='456' y1='144' x2='456' y2='216'/>
            <line fill='none' stroke='gray' stroke-width='1.5' x1='504' y1='144' x2='504' y2='216'/>
            <line fill='none' stroke='gray' stroke-width='1.5' x1='144' y1='144' x2='144' y2='216'/>
            <line fill='none' stroke='gray' stroke-width='1.5' x1='192' y1='144' x2='192' y2='216'/>
            { /* Exchange Zones */ }
            <rect stroke='red' stroke-width='1.5' x='0' y='120' width='36' height='48'/>
            <rect stroke='blue' stroke-width='1.5' x='612' y='192' width='36' height='48'/>
          </motion.svg>
        </Stack>
      </Stack>
    </Container>
  ));
}

export default HomePage;
