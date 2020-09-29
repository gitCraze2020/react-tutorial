import React from 'react';
import { Box } from '@chakra-ui/core';

interface WrapperProps {
    sizeProfile?: "regular" | "small"
}

const Wrapper: React.FC<WrapperProps> = ({
         children,
         sizeProfile = "regular",
     }) => {
    return <Box mt={8} mx="auto" maxW={ sizeProfile === "regular" ? "800px" : "400px"} w="100%">{ children }</Box>
}

export default Wrapper;
