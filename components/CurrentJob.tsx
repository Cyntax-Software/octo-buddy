import filesize from "filesize";
import React, { useContext, useEffect, useState } from "react";
import { View } from "react-native";
import { AuthenticatedServersContext } from "../context/AuthenticatedServers";
import api from "../helpers/api";
import { time } from "../helpers/utils";
import {
  Box,
  Heading,
  AspectRatio,
  Image,
  Text,
  Center,
  HStack,
  Stack,
  NativeBaseProvider,
} from "native-base";

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

export const CurrentJob = () => {
  const { currentServer } = useContext(AuthenticatedServersContext);

  if (!currentServer) {
    throw new Error("No server found");
  }

  const [currentJob, setCurrentJob] = useState<OctoJob>();

  useEffect(() => {
    const fetchAndSetCurrentJob = async () => {
      const job: OctoJob = await api.get("job", currentServer);
      setCurrentJob(!job || job.error ? undefined : job);
    }

    fetchAndSetCurrentJob();

    const interval = setInterval(fetchAndSetCurrentJob, 1000);

    return () => {
      clearInterval(interval);
    }
  }, [])

  return currentJob ? (
    <View>
      <Text>State: {currentJob.state}</Text>
      <Text>File: {currentJob.job.file.name}</Text>
      <Text>Size: {filesize(currentJob.job.file.size)}</Text>
      <Text>Filepos: {filesize(currentJob.progress.filepos)}</Text>
      <Text>Print Time: {time(currentJob.progress.printTime)}</Text>
      <Text>Print Time Left: {time(currentJob.progress.printTimeLeft)}</Text>
      <Text>Completion: {currentJob.progress.completion.toFixed(1)}%</Text>
    </View>
  ) : (
    <View>
      <Text>No active job</Text>
    </View>
  )
};
