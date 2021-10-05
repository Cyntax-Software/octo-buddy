import React, { useContext, useEffect, useState } from "react";
import { AuthenticatedServersContext } from "../context/AuthenticatedServers";
import { Box, HStack, Text, useTheme, VStack } from "native-base";
import api from "../helpers/api";
import { useIsMounted } from "../helpers/hooks";
import { AnimatedCircularProgress } from "react-native-circular-progress";

type Temperature = {
  actual: number;
  target: number;
}

type TemperatureWithOffset = Temperature & {
  offset: number;
}

type OctoPrinter = {
  temperature: {
    tool0: TemperatureWithOffset;
    tool1: TemperatureWithOffset;
    bed: TemperatureWithOffset;
    history: Array<{
      time: number;
      tool0: Temperature;
      tool1: Temperature;
      bed: Temperature;
    }>;
  };
  sd: {
    ready: boolean;
  };
  state: {
    text: string; // TODO: actual options
    flags: {
      operational: boolean;
      paused: boolean;
      printing: boolean;
      cancelling: boolean;
      pausing: boolean;
      sdReady: boolean;
      error: boolean;
      ready: boolean;
      closedOrError: boolean;
    }
  }
}

export const Temperatures = () => {
  const { currentServer } = useContext(AuthenticatedServersContext);
  const isMounted = useIsMounted();
  const theme = useTheme();

  if (!currentServer) {
    throw new Error("No server found");
  }

  const [printerData, setPrinterData] = useState<OctoPrinter>();

  useEffect(() => {
    const fetchAndSetPrinterData = async () => {
      const printer: OctoPrinter = await api.get("printer", currentServer);
      if (!isMounted.current) return;
      setPrinterData(printer ?? undefined);
    }

    fetchAndSetPrinterData();

    const interval = setInterval(fetchAndSetPrinterData, 1000);

    return () => {
      clearInterval(interval);
    }
  }, []);

  return (
    <Box
      overflow="hidden"
      mx="4"
    >
      {!printerData ? (
        // TODO: empty state
        <Text textAlign="center">
          No printer data
        </Text>
      ) : (
        <HStack justifyContent="space-around" mx="4">
          <VStack alignItems="center">
            <Text bold mb="4">Printing Temp</Text>
            <AnimatedCircularProgress
              size={120}
              width={12}
              prefill={(100 / printerData.temperature.tool0.target) * printerData.temperature.tool0.actual}
              fill={(100 / printerData.temperature.tool0.target) * printerData.temperature.tool0.actual}
              tintColor={theme.colors.red["600"]}
              backgroundColor={theme.colors.red["300"]}
              children={() => (
                <Box justifyContent="center" alignItems="center">
                  <Text bold fontSize="lg">{printerData.temperature.tool0.actual.toFixed(0)}°c</Text>
                  <Text>{printerData.temperature.tool0.target}°c</Text>
                </Box>
              )}
            />
          </VStack>

          <VStack alignItems="center">
            <Text bold mb="4">Bed Temp</Text>
            <AnimatedCircularProgress
              size={120}
              width={12}
              prefill={(100 / printerData.temperature.bed.target) * printerData.temperature.bed.actual}
              fill={(100 / printerData.temperature.bed.target) * printerData.temperature.bed.actual}
              tintColor={theme.colors.info["600"]}
              backgroundColor={theme.colors.info["300"]}
              children={() => (
                <Box justifyContent="center" alignItems="center">
                  <Text bold fontSize="lg">{printerData.temperature.bed.actual.toFixed(0)}°c</Text>
                  <Text>{printerData.temperature.bed.target}°c</Text>
                </Box>
              )}
            />
          </VStack>
        </HStack>
      )}
    </Box>
  )
};
