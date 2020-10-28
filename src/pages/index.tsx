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

const HomePage = () => {
  return (
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
        <option>Match 1</option>
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
  );
}

export default HomePage;
