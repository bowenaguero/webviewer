import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from '@/components/ui/pagination';
import { HStack } from '@chakra-ui/react';

export default function PaginationMenu({
  page,
  setPage,
  itemsPerPage,
  count,
  style,
}) {
  return (
    <PaginationRoot
      count={count}
      page={page}
      pageSize={itemsPerPage}
      onPageChange={(e) => setPage(e.page)}
      type="button"
    >
      <HStack>
        <PaginationPrevTrigger _hover={{ bg: 'gray.800' }} />
        {style === 'compact' ? null : (
          <PaginationItems _hover={{ bg: 'gray.800' }} />
        )}
        <PaginationNextTrigger _hover={{ bg: 'gray.800' }} />
      </HStack>
    </PaginationRoot>
  );
}
