import { Box, CircleIcon, HStack, Pressable, Spacer, Text, VStack } from "native-base";
import React, { useEffect, useState } from "react";
import { Server } from "../context/AuthenticatedServers";
import api from "../helpers/api";
import { useIsMounted } from "../helpers/hooks";
import { MaterialIcons } from '@expo/vector-icons';

export const ServerListItem = (props: { server: Server, onPress: () => void }) => {
  const isMounted = useIsMounted();
  const [status, setStatus] = useState<"unknown" | "online" | "offline">("unknown");

  useEffect(() => {
    api.get("currentuser", props.server)
      .then(() => {
        if (isMounted.current) setStatus("online");
      })
      .catch(() => {
        if (isMounted.current) setStatus("offline");
      });
  }, [props.server])

  return (
    <Pressable
      onPress={props.onPress}
      mb="4"
      mx="4"
    >
      <Box
        rounded="lg"
        overflow="hidden"
        borderColor="coolGray.200"
        borderWidth="1"
        backgroundColor="white"
        px="5"
        py="3"
      >
        <HStack space={4} justifyContent="space-between" alignItems="center">
          <MaterialIcons name="print" size={24} color="black" />

          <VStack>
            <Text
              color="coolGray.800"
              bold
            >
              {props.server.name ?? props.server.ip}
            </Text>

            <HStack alignItems="center" mt="1">
              <CircleIcon
                size="3"
                color={status === "unknown" ? "warning.300" : (status === "online" ? "success.600" : "error.600")}
                mr="1"
              />

              <Text
                color="coolGray.600"
                fontSize="xs"
                _dark={{
                  color: "warmGray.200",
                }}
              >
                {status === "unknown" && "Checking connection..."}
                {status === "online" && "Online"}
                {status === "offline" && "Offline"}
              </Text>
            </HStack>
          </VStack>

          <Spacer />
        </HStack>
      </Box>
    </Pressable>
  )
};