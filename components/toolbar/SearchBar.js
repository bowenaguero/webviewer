import { Input } from "@chakra-ui/react";

export default function SearchBar() {
    return (
        <Input variant="subtle" h="100%" placeholder="Search" border={"2px solid"} borderColor={{ base: "gray.200", _dark: "gray.700" }} borderRadius={"md"} />
    )
}
