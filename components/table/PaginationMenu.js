import {
    PaginationItems,
    PaginationNextTrigger,
    PaginationPrevTrigger,
    PaginationRoot
} from "@/components/ui/pagination"
import { HStack } from "@chakra-ui/react"

export default function PaginationMenu2({page, setPage, itemsPerPage, count}) {
    return (
        <PaginationRoot
            count={count}
            page={page}
            pageSize={itemsPerPage}
            onPageChange={(e) => setPage(e.page)}
            type="button"
        >
            <HStack>
                <PaginationPrevTrigger />
                <PaginationItems />
                <PaginationNextTrigger />
            </HStack>
        </PaginationRoot>
    )
}

