import {
    PaginationItems,
    PaginationNextTrigger,
    PaginationPrevTrigger,
    PaginationRoot
} from "@/components/ui/pagination"
import { HStack } from "@chakra-ui/react"

export default function PaginationMenu({page, setPage, itemsPerPage, count, style}) {
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
                {style === "compact" ? null : <PaginationItems />}
                <PaginationNextTrigger />
            </HStack>
        </PaginationRoot>
    )
}

