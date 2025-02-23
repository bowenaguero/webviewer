"use client";

import { Box, Center, Spinner } from "@chakra-ui/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import HistoryTable from "@/components/table/HistoryTable";
import ToolBar from "@/components/toolbar/ToolBar";
import _Alert from "@/components/general/Alert";

export default function ViewerPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ViewerContent />
    </Suspense>
  );
}

function ViewerContent() {
  const [data, setData] = useState(null);
  const searchParams = useSearchParams();
  const [showAlert, setShowAlert] = useState(false);
  const [alertItem, setAlertItem] = useState(null);

  const handleAlert = (alertType, item) => {
    if (alertType === "url") {
      setAlertItem(item);
    }
  };

  useEffect(() => {
    if (alertItem) {
      setShowAlert(true);
    }
  }, [alertItem]);

  useEffect(() => {
    const storedData = localStorage.getItem("browserHistory");
    if (storedData) {
      try {
        setData(JSON.parse(storedData));
      } catch (error) {
        console.error("Error parsing history data:", error);
      }
    }
  }, [searchParams]);

  if (!data) {
    return (
      <Box p={8} textAlign="center">
        No history data available. Please upload a history file from the home
        page.
      </Box>
    );
  }

  return (
    <Center>
      {showAlert && (
        <Box maxW={"20%"} 
          position="fixed"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
        >
          <_Alert alertItem={alertItem} setShowAlert={setShowAlert} />
        </Box>
      )}
      <Box w={"90%"} mt={10}>
        <ToolBar />
        <HistoryTable
          history={data.history}
          handleAlert={handleAlert}
          setShowAlert={setShowAlert}
        />
      </Box>
    </Center>
  );
}

function LoadingSpinner() {
  return (
    <Center h="100vh">
      <Spinner size="xl" />
    </Center>
  );
}
