import { Heading, Stack, StackProps } from '@chakra-ui/core';
import Link from 'next/link';

const Header: React.FC<StackProps> = (props) => {
  return (
    <Stack isInline {...props}>
      <Link href={process.env.PREFIX_PATH + "/"}>
        <a>
          <Heading>view</Heading>
        </a>
      </Link>
      <Heading>|</Heading>
      <Link href={process.env.PREFIX_PATH + "/scout"}>
        <a>
          <Heading>scout</Heading>
        </a>
      </Link>
    </Stack>
  );
};

export default Header;
