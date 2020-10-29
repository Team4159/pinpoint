import { BoxProps, ButtonProps, SelectProps } from '@chakra-ui/core';

export const select: SelectProps = {
  width: '16rem',
  borderColor: 'whiteAlpha.600',
};

export const button: ButtonProps = {
  colorScheme: 'whiteAlpha',
  variant: 'outline',
};

export const cell: BoxProps = {
  paddingX: 2,
  paddingY: 2,
  border: '1px solid',
  borderColor: 'white',
};
