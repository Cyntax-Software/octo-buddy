import React, { useContext, useEffect, useState } from "react";
import { AuthenticatedServersContext } from "../context/AuthenticatedServers";
import api from "../helpers/api";
import {
  Box,
  Heading,
  HStack,
  IBoxProps,
  Progress,
  Text,
  VStack,
} from "native-base";
import { useIsMounted } from "../helpers/hooks";
import moment from "moment";

export type OctoJob = {
  job: {
    file: {
      name: string,
      origin: "local" | "sdcard", // TODO: what options are there?
      size: number,
      date: number
    },
    estimatedPrintTime: number,
    filament: any // TODO
  },
  progress: {
    completion: number,
    filepos: number,
    printTime: number,
    printTimeLeft: number
  },
  state: string, // e.g. “Operational” or “Printing” - need exhaustive list
  error?: string,
} | null;

export const CurrentJob = (props: IBoxProps) => {
  const { currentServer } = useContext(AuthenticatedServersContext);
  const isMounted = useIsMounted();

  if (!currentServer) {
    throw new Error("No server found");
  }

  const [currentJob, setCurrentJob] = useState<OctoJob>();

  useEffect(() => {
    const fetchAndSetCurrentJob = async () => {
      const job: OctoJob = await api.get("job", currentServer);
      if (!isMounted.current) return;
      setCurrentJob(!job || job.error ? undefined : job);
    }

    fetchAndSetCurrentJob();

    const interval = setInterval(fetchAndSetCurrentJob, 1000);

    return () => {
      clearInterval(interval);
    }
  }, []);

  const timePrinting = currentJob ? moment().subtract(currentJob.progress.printTime, "seconds") : null;
  const timeRemaining = currentJob ? moment().add(currentJob.progress.printTimeLeft, "seconds") : null;

  return (
    <Box
      rounded="lg"
      overflow="hidden"
      borderColor="coolGray.200"
      backgroundColor="white"
      borderWidth="1"
      p="5"
      mx="4"
      {...props}
    >
      {!currentJob && (
        <Text>No active job</Text>
      )}

      {currentJob && (
        <>
          <HStack justifyContent="space-between" mb="1">
            <VStack>
              <Heading size="sm">{currentJob.state}</Heading>
            <Text fontSize="xs">{currentJob.job.file.name}</Text>
            </VStack>
            <Box
              bg="primary.500"
              borderRadius="100"
              maxW="10"
              maxH="10"
              minW="10"
              minH="10"
              ml="2"
              alignItems="center"
              justifyContent="center"
            >
              <Text bold color="white">{currentJob.progress.completion.toFixed(0)}%</Text>
            </Box>
          </HStack>

          <Progress value={currentJob.progress.completion} size="lg" mt="4" />

          {[{
            label: "Time printing",
            value: timePrinting?.fromNow(true)
          }, {
            label: "Time remaining",
            value: timeRemaining ? `about ${timeRemaining.fromNow(true)}` : `Calculating...`
          }].map((data, i) => (
            <HStack
              key={data.label}
              justifyContent="space-between"
              mt="3"
              pt="3"
              borderTopWidth={i === 0 ? "0" : "1"}
              borderTopColor="gray.200"
            >
              <Text bold>{data.label}:</Text>
              <Text>{data.value}</Text>
            </HStack>
          ))}
        </>
      )}
    </Box>
  )
};
