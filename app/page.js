'use client'

import FileUpload from '@/components/upload/FileUpload'
import { Box, Text, VStack } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  const handleHistoryLoaded = (data) => {
    try {
      const dataString = JSON.stringify(data)
      localStorage.setItem('browserHistory', dataString)
      router.push('/viewer')
    } catch (error) {
      console.error('Error processing history:', error)
    }
  }

  return (
    <Box 
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="calc(100vh - 120px)"
      textAlign="center"
    >
      <VStack spacing={6} mb={12}>
        <Text 
          fontSize={["3xl", "4xl", "5xl"]}
          fontWeight="bold"
          letterSpacing="tight"
        >
          Browser History Viewer
        </Text>
        <Text 
          fontSize={["sm", "md", "lg"]}
        >
          Upload your browser history file for secure, local analysis.
        </Text>
      </VStack>
      <FileUpload onHistoryLoaded={handleHistoryLoaded} />
    </Box>
  )
}
