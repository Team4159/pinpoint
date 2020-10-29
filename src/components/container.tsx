import { Flex, FlexProps } from '@chakra-ui/core';

const Container: React.FC<FlexProps> = (props) => {
  return (
    <Flex
      direction="column"
      minHeight="100vh"
      backgroundColor="almostBlack"
      color="white"
      padding={6}
      {...props}
    />
  );
};

export default Container;
