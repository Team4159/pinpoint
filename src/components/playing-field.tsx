import { SVGProps } from 'react';
import { useTheme } from '@chakra-ui/core';

import { getPlatformColor } from '@/utils';
 
const PlayingField: React.FC<SVGProps<SVGSVGElement> & { colorScheme: 'LLL'|'RRR'|'RRL'|'RLL'|'LLL'|'LRR'|'LLR'|'split' }> = ({ colorScheme, children, ...props }) => {
  const theme = useTheme();

  return (
    <svg
      style={{ maxWidth: '648px' }}
      viewBox="0 0 648 360"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Field Outline */}
      <rect
        stroke="white"
        strokeWidth="1.5"
        x="0"
        y="0"
        width="648"
        height="360"
      />
      {/* Auto Lines */}
      <line
        fill="none"
        stroke={theme.colors.blue[600]}
        strokeWidth="1.5"
        x1="120"
        y1="0"
        x2="120"
        y2="360"
      />
      <line
        fill="none"
        stroke={theme.colors.red[600]}
        strokeWidth="1.5"
        x1="528"
        y1="0"
        x2="528"
        y2="360"
      />
      {/* Switch Boxes */}
      <rect
        stroke={
          theme.colors[colorScheme == 'split' ? 'blue' : getPlatformColor(colorScheme, 0, true)][600]
        }
        strokeWidth="1.5"
        x="144"
        y="108"
        width="48"
        height="36"
      />
      <rect
        stroke={
          theme.colors[colorScheme == 'split' ? 'blue' : getPlatformColor(colorScheme, 0, false)][600]
        }
        strokeWidth="1.5"
        x="144"
        y="216"
        width="48"
        height="36"
      />
      <rect
        stroke={
          theme.colors[colorScheme == 'split' ? 'red' : getPlatformColor(colorScheme, 2, true)][600]
        }
        strokeWidth="1.5"
        x="456"
        y="108"
        width="48"
        height="36"
      />
      <rect
        stroke={
          theme.colors[colorScheme == 'split' ? 'red' : getPlatformColor(colorScheme, 2, false)][600]
        }
        strokeWidth="1.5"
        x="456"
        y="216"
        width="48"
        height="36"
      />
      {/* Scale Boxes */}
      <rect
        stroke={
          theme.colors[colorScheme == 'split' ? 'blue' : getPlatformColor(colorScheme, 1, true)][600]
        }
        strokeWidth="1.5"
        x="300"
        y="72"
        width="48"
        height="36"
      />
      <rect
        stroke={
          theme.colors[colorScheme == 'split' ? 'blue' : getPlatformColor(colorScheme, 1, true)][600]
        }
        strokeWidth="1.5"
        x="300"
        y="252"
        width="48"
        height="36"
      />
      {colorScheme == 'split' && (
        <g>
          <rect
            stroke={theme.colors.red[600]}
            strokeWidth="1.5"
            strokeDasharray="0 24 60"
            x="300"
            y="72"
            width="48"
            height="36"
          />
          <rect
            stroke={theme.colors.red[600]}
            strokeWidth="1.5"
            strokeDasharray="0 24 60"
            x="300"
            y="252"
            width="48"
            height="36"
          />
        </g>
      )}
      {/* Horizontal Platform Sides */}
      <rect
        stroke="gray"
        strokeWidth="1.5"
        x="259"
        y="115.25"
        width="130"
        height="12.75"
      />
      <rect
        stroke="gray"
        strokeWidth="1.5"
        x="259"
        y="232"
        width="130"
        height="12.75"
      />
      {/* Vertical Platform Sides */}
      <rect
        stroke="gray"
        strokeWidth="1.5"
        x="259"
        y="128"
        width="12.75"
        height="104"
      />
      <rect
        stroke="gray"
        strokeWidth="1.5"
        x="376.25"
        y="128"
        width="12.75"
        height="104"
      />
      {/* Switch Beams */}
      <rect
        stroke="gray"
        strokeWidth="1.5"
        x="474"
        y="144"
        width="12"
        height="72"
      />
      <rect
        stroke="gray"
        strokeWidth="1.5"
        x="162"
        y="144"
        width="12"
        height="72"
      />
      {/* Scale Beam */}
      <rect
        stroke="gray"
        strokeWidth="1.5"
        x="318"
        y="108.3125"
        width="12"
        height="143.5"
      />
      {/* Switch Bounds */}
      <line
        stroke="gray"
        strokeWidth="1.5"
        x1="456"
        y1="144"
        x2="456"
        y2="216"
      />
      <line
        stroke="gray"
        strokeWidth="1.5"
        x1="504"
        y1="144"
        x2="504"
        y2="216"
      />
      <line
        stroke="gray"
        strokeWidth="1.5"
        x1="144"
        y1="144"
        x2="144"
        y2="216"
      />
      <line
        stroke="gray"
        strokeWidth="1.5"
        x1="192"
        y1="144"
        x2="192"
        y2="216"
      />
      {/* Exchange Zones */}
      <rect
        stroke={theme.colors.blue[600]}
        strokeWidth="1.5"
        x="0"
        y="120"
        width="36"
        height="48"
      />
      <rect
        stroke={theme.colors.red[600]}
        strokeWidth="1.5"
        x="612"
        y="192"
        width="36"
        height="48"
      />
      {children}
    </svg>
  );
};

export default PlayingField;
