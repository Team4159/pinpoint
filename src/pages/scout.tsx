import { useState, useRef } from 'react';
import Container from '@/components/container';
import { Flex } from '@chakra-ui/core';
import Header from '@/components/header';
import PlayingField from '@/components/playing-field';

import { pathToD } from '@/utils';

const ScoutingPage: React.FC = () => {
  const fieldRef = useRef();

  const [drawing, setDrawing] = useState(false);
  const [robotPath, setRobotPath] = useState([]);

  return (
    <Container>
      <Header />
      <Flex paddingY={6}>
        <PlayingField
          ref={fieldRef}
          colorScheme="LLL"
          onMouseDown={() => setDrawing(true)}
          onMouseMove={e => {
            if (drawing) {
              // @ts-ignore
              const boundingRect = fieldRef.current?.getBoundingClientRect();
              setRobotPath(current => current.concat([[e.clientY - boundingRect.y, e.clientX - boundingRect.x]]));
            }
          }}
          onMouseUp={() => setDrawing(false)}
        >
          {robotPath.length > 0 && (
            <path
              d={pathToD(robotPath)}
              fill="none"
              stroke="yellow"
              strokeWidth="1.5"
            />
          )}
        </PlayingField>
      </Flex>
    </Container>
  );
};

export default ScoutingPage;
