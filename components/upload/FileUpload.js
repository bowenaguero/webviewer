'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Box, Text, VStack } from '@chakra-ui/react'
import { FaUpload } from 'react-icons/fa'
import initSqlJs from 'sql.js'
import { queryBrowserHistory } from '@/components/utils/browserHistoryQueries'
import { processHistoryResults } from '@/components/utils/statisticsProcessing'

export default function FileUpload({ onHistoryLoaded }) {
  const [isProcessing, setIsProcessing] = useState(false)
  
  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return

    setIsProcessing(true)
    try {
      const file = acceptedFiles[0]
      const arrayBuffer = await file.arrayBuffer()
      
      const SQL = await initSqlJs({
        locateFile: file => `/${file}`
      })
      
      const db = new SQL.Database(new Uint8Array(arrayBuffer))
      const results = await queryBrowserHistory(db)
      const { history, statistics } = processHistoryResults(results)
      
      onHistoryLoaded({ history, statistics })
    } catch (error) {
      console.error('Error processing file:', error)
    } finally {
      setIsProcessing(false)
    }
  }, [onHistoryLoaded])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/x-sqlite3': ['.db', '.sqlite']
    },
    multiple: false
  })

  return (
    <Box 
      {...getRootProps()} 
      width={["300px", "400px", "500px"]}
      height="300px"
      borderWidth={2}
      borderRadius="lg"
      borderStyle="dashed"
      cursor="pointer"
      _hover={{
        borderColor: "blue.500",
        backgroundColor: {base: "gray.100", _dark: "gray.900"},
      }}
      transition="all 0.2s"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <input {...getInputProps()} />
      <VStack spacing={16}>
        <FaUpload size={40} />
        <VStack 
          spacing={3}
          align="center" 
        >
          <Text fontSize={["xs", "sm", "md"]}>
            {isProcessing 
              ? "Processing..." 
              : isDragActive 
                ? "Drop to analyze" 
                : "PRIVATE + SECURE"}
          </Text>
          <Text fontSize={["2xs", "xs", "sm"]}>
            {isProcessing 
              ? "Analyzing your history" 
              : isDragActive 
                ? "" 
                : "DATA NEVER LEAVES YOUR BROWSER"}
          </Text>
        </VStack>
      </VStack>
    </Box>
  )
} 