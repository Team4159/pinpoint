import { useContext, useEffect } from 'react';
import {
  Box,
  Button,
  Heading,
  Select,
  Stack,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Text
} from '@chakra-ui/core';

import { useObserver } from 'mobx-react';

import EventStore, { EventContext } from '@/stores/EventStore'

const HomePage: React.FC = () => {
  const eventStore = useContext(EventContext);

  useEffect(() => {
    eventStore.loadEvent('2018cc');
    eventStore.loadEvent('2018roe');
  }, []);

  return useObserver(() => (
    <Stack
      direction='column'
      alignItems='start'
      minHeight='100vh'
      backgroundColor='almostBlack'
      color='white'
      padding={6}
    >
      <Heading>
        Hello World
      </Heading>
      <Button variant='outline' colorScheme='whiteAlpha'>
        <Text fontWeight='bold' color='white'>
          Hello World
        </Text>
      </Button>
      <Select width='16rem' borderColor='whiteAlpha.600'>
        {eventStore.events.map(event => (
          <option key={event.slug}>
            {event.slug}
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
          <StatHelpText>of 67</StatHelpText>
        </Stat>
      </Box>
    </Stack>
  ));
}

const HomePageWithContext: React.FC = (props) => {
  return (
    <EventContext.Provider value={new EventStore()}>
      <HomePage {...props} />
    </EventContext.Provider>
  );
};

export default HomePageWithContext;
