import EventIcon from '../event/EventIcon';
import ToolBar from '../toolbar/ToolBar';
import { Tooltip } from '../ui/tooltip';
import { capitalizeFirstLetter } from '../utils/helpers';
import ActionsMenu from './ActionsMenu';
import PaginationMenu from './PaginationMenu';
import { HistoryProvider, useHistory } from '../context/HistoryContext';
import { HStack, Box, Table, Text, Spinner } from '@chakra-ui/react';

const CELL_STYLE = { color: 'gray.500', p: 5 };
const TEXT_OVERFLOW_STYLE = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};
const HEADER_STYLE = {
  ...TEXT_OVERFLOW_STYLE,
  color: 'gray.500',
  px: 5,
};

export default function HistoryTable({ history }) {
  return (
    <HistoryProvider history={history}>
      <HistoryTableContent />
    </HistoryProvider>
  );
}

function HistoryTableContent() {
  const { currentItems, totalCount, searching, page, setPage, itemsPerPage } =
    useHistory();

  return (
    <>
      <Box w="100%" h="100%" mb={5}>
        <ToolBar />
      </Box>
      <Box
        bg="gray.950"
        border="2px solid"
        borderColor="gray.800"
        borderRadius="md"
      >
        <Table.Root tableLayout="fixed">
          <Table.Header>
            <TableHeaderRow />
          </Table.Header>
          <Table.Body>
            {searching ? (
              <SearchingRow />
            ) : (
              currentItems.map((item, index) => (
                <HistoryRow
                  key={`${item.url}-${item.visitTime}-${index}`}
                  item={item}
                />
              ))
            )}
          </Table.Body>
        </Table.Root>
      </Box>
      <HStack justifyContent="space-between" mt={5} mb={5}>
        <Box />
        <PaginationMenu
          page={page}
          setPage={setPage}
          itemsPerPage={itemsPerPage}
          count={totalCount}
        />
        <Box />
      </HStack>
    </>
  );
}

function TableHeaderRow() {
  return (
    <Table.Row bg="transparent">
      <Table.ColumnHeader w="3%" />
      <Table.ColumnHeader {...HEADER_STYLE} w="12%">
        Time
      </Table.ColumnHeader>
      <Table.ColumnHeader {...HEADER_STYLE} w="8%">
        Type
      </Table.ColumnHeader>
      <Table.ColumnHeader {...HEADER_STYLE} w="30%">
        URL
      </Table.ColumnHeader>
      <Table.ColumnHeader {...HEADER_STYLE} w="30%">
        Title
      </Table.ColumnHeader>
      <Table.ColumnHeader {...HEADER_STYLE} w="20%">
        Details
      </Table.ColumnHeader>
    </Table.Row>
  );
}

function SearchingRow() {
  return (
    <Table.Row>
      <Table.Cell p={5} colSpan={7} bg="gray.950">
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          h="100%"
        >
          <Spinner size="lg" color="gray.500" />
        </Box>
      </Table.Cell>
    </Table.Row>
  );
}

function HistoryRow({ item }) {
  return (
    <Table.Row bg="transparent" _hover={{ bg: 'gray.800' }}>
      <Table.Cell {...CELL_STYLE}>
        <ActionsMenu event={item} />
      </Table.Cell>
      <Table.Cell {...CELL_STYLE}>
        <Box fontSize="sm">{item.visitTimeFormatted}</Box>
      </Table.Cell>
      <Table.Cell {...CELL_STYLE}>
        <Box display="flex" alignItems="center" gap={2}>
          <EventIcon size="sm" eventType={item.eventType} />
          <Text {...TEXT_OVERFLOW_STYLE}>
            {capitalizeFirstLetter(item.eventType)}
          </Text>
        </Box>
      </Table.Cell>
      <Table.Cell p={5}>
        <Tooltip content={item.url}>
          <Text fontSize="sm" fontWeight="medium" {...TEXT_OVERFLOW_STYLE}>
            {item.url}
          </Text>
        </Tooltip>
      </Table.Cell>
      <Table.Cell {...CELL_STYLE}>
        <Tooltip content={item.title || 'Untitled'}>
          <Text fontSize="sm" fontWeight="medium" {...TEXT_OVERFLOW_STYLE}>
            {item.title || 'Untitled'}
          </Text>
        </Tooltip>
      </Table.Cell>
      <Table.Cell {...CELL_STYLE}>
        <DetailsCell item={item} />
      </Table.Cell>
    </Table.Row>
  );
}

function DetailsCell({ item }) {
  const hasEventDetails = item.eventType !== 'Visit';
  const hasAdditionalFields = Object.keys(item.additionalFields).length > 0;

  return (
    <Box>
      {hasEventDetails && (
        <>
          <Text color="gray.500">{item.eventEntityType}:</Text>
          <Text color="gray.300">{item.eventEntity}</Text>
        </>
      )}
      {hasAdditionalFields && (
        <Text {...TEXT_OVERFLOW_STYLE} fontSize="sm">
          {Object.entries(item.additionalFields).map(([key, value]) => (
            <Box key={key}>
              <Text color="gray.500">{key}:</Text>
              <Text color="gray.300">{value}</Text>
            </Box>
          ))}
        </Text>
      )}
    </Box>
  );
}
