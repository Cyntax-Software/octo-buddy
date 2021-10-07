import React, { useEffect, useState } from "react";
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
import { Job, Server } from "../types";

export const CurrentJob = (props: IBoxProps & {
  server: Server;
}) => {
  const isMounted = useIsMounted();
  const [currentJob, setCurrentJob] = useState<Job>();

  useEffect(() => {
    const fetchAndSetCurrentJob = async () => {
      const job: Job = await api.get("job", props.server);
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
  const timeRemaining = currentJob?.progress.printTimeLeft ? moment().add(currentJob.progress.printTimeLeft, "seconds") : null;

  console.log({ currentJob })

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
              <Text fontSize="xs" numberOfLines={1} ellipsizeMode="tail">{currentJob.job.file.name}</Text>
            </VStack>
          </HStack>

          <Progress value={currentJob.progress.completion} size="sm" mt="4" borderRadius="5" colorScheme="emerald" />

          {[{
            label: "Time printing",
            value: timePrinting?.fromNow(true)
          }, {
            label: "Time remaining",
            value: timeRemaining ? `about ${timeRemaining.fromNow(true)}` : `~`
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
