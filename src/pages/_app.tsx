import { ChakraProvider } from '@chakra-ui/core';

import EventStore, { EventContext } from '@/stores/EventStore';

import theme from '@/theme';

import '../styles/base.css';

const eventStore = new EventStore();

function CustomApp({ Component, pageProps }) {
  return (
    <EventContext.Provider value={eventStore}>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </EventContext.Provider>
  );
}

export default CustomApp;
