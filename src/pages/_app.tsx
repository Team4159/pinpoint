import { ChakraProvider } from '@chakra-ui/core';

import theme from '@/theme';

import '../styles/base.css'

function CustomApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default CustomApp;
