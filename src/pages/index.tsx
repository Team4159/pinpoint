import { useContext, useEffect, useState } from 'react';
import {
  Box,
  Select,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
} from '@chakra-ui/core';
import Container from '@/components/container';
import Header from '@/components/header';

import { computed } from 'mobx';
import { useObserver } from 'mobx-react';

import { EventContext } from '@/stores/EventStore'

const HomePage: React.FC = () => {
  const eventStore = useContext(EventContext);
  const [selectedEventSlug, setSelectedEventSlug] = useState('');
  const selectedEvent = computed(() =>
    eventStore.events[selectedEventSlug]
  );

  useEffect(() => {
    eventStore.loadEvent('2018cc').then(() => {
      setSelectedEventSlug('2018cc');
    });
    eventStore.loadEvent('2018roe');
  }, []);

  return useObserver(() => (
    <Container>
      <Header />
      <Select
        width='16rem'
        borderColor='whiteAlpha.600'
        value={selectedEventSlug}
        onChange={e => setSelectedEventSlug(e.target.value)}
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
      <Box
        borderWidth='1px'
        borderRadius='md'
        borderColor='whiteAlpha.600'
        paddingY={2}
        paddingX={4}
      >
        <Stat>
          <StatLabel>Match Number</StatLabel>
          <StatNumber>Q1</StatNumber>
        <StatHelpText>of {
          selectedEvent.get() ? (
            Math.max(...selectedEvent.get().robotEntries.map(robotEntry => robotEntry.matchNumber))
          ) : 'Loading...'
        }</StatHelpText>
        </Stat>
      </Box>
    </Container>
  ));
}

export default HomePage;
