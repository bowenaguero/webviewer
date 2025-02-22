'use client'

import { Box, Center, Spinner } from '@chakra-ui/react'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import HistoryTable from '@/components/table/HistoryTable'
import ToolBar from '@/components/toolbar/ToolBar'

export default function ViewerPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ViewerContent />
    </Suspense>
  )
}

function ViewerContent() {
  const [data, setData] = useState(null)
  const searchParams = useSearchParams()

  useEffect(() => {
    const storedData = localStorage.getItem('browserHistory')
    if (storedData) {
      try {
        setData(JSON.parse(storedData))
      } catch (error) {
        console.error('Error parsing history data:', error)
      }
    }
  }, [searchParams])

  if (!data) {
    return (
      <Box p={8} textAlign="center">
        No history data available. Please upload a history file from the home page.
      </Box>
    )
  }

  return (
    <Center>
      <Box w={'90%'} mt={10}>
        <ToolBar />
        <HistoryTable history={data.history}/>
      </Box>
    </Center>
  )
}

function LoadingSpinner() {
  return (
    <Center h="100vh">
      <Spinner size="xl" />
    </Center>
  )
}

