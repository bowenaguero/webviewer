import { Tooltip } from '../ui/tooltip';
import { Text } from '@chakra-ui/react';

export default function EventTooltip({ event, key }) {
  return (
    <Tooltip content={event.url}>
      <Text>{event.url}</Text>
      <Text>{event.title}</Text>
      <Text>{event.eventEntity}</Text>
    </Tooltip>
  );
}
