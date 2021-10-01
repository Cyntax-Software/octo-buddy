import React, { useContext, useEffect, useState } from "react";
import { Box, Button, CircleIcon, Divider, FlatList, HStack, Spacer, Text, VStack, Pressable, Container } from "native-base";
import { AuthenticatedServersContext, Server } from "../../context/AuthenticatedServers";
import api from "../../helpers/api";
import { Screen } from "../../components/Elements";
import MaterialIcons from "@expo/vector-icons/build/MaterialIcons";
import { SelectServerNavigationProp } from ".";
import { Platform } from "react-native";
import { getIpAddressAsync } from "expo-network";
import { useIsMounted } from "../../helpers/hooks";

export const SelectServerScreen = (props: SelectServerNavigationProp<"SelectServer">) => {
  const { authenticatedServers, setCurrentServer } = useContext(AuthenticatedServersContext);

  const isMounted = useIsMounted();

  const [status, setStatus] = useState<"searching" | "complete">(Platform.OS === "web" ? "complete" : "searching");
  const [otherServers, setOtherServers] = useState<Array<Server>>([]);
  const [searchNum, setSearchNum] = useState(1);

  const checkForServer = async () => {
    if (status !== "searching") return;
    if (Platform.OS === "web") return;

    const ipAddress =  await getIpAddressAsync();
    const ipBase = ipAddress.split(".").splice(0, 3).join(".");
    const ip = `${ipBase}.${searchNum}`;

    if (!authenticatedServers.find(s => s.ip === ip)) {
      const resp = await api.get("currentuser", { ip }).catch(() => {});

      if (resp) {
        if (!isMounted.current) return;
        setOtherServers([...otherServers, { ip }]);
      }
    }

    if (!isMounted.current) return;

    if (searchNum < 30) {
      setSearchNum(searchNum + 1);
    } else {
      setStatus("complete");
    }
  }

  useEffect(() => {
    checkForServer();
  }, [searchNum]);

  const attemptConnection = async (server: Server) => {
    return api.get("version", server)
      .then(() => {
        setCurrentServer(server);
        return true;
      })
      .catch(() => {
        return false;
      });
  }

  const authServerIps = authenticatedServers.map(s => s.ip);

  return (
    <Screen>
      <FlatList
        data={[
          ...authenticatedServers.map(s => ({ ...s, status: "authenticated" })),
          ...otherServers.filter(s => !authServerIps.includes(s.ip)).map(s => ({ ...s, status: "unauthenticated" })),
        ]}
        keyExtractor={(server) => server.ip}
        ListEmptyComponent={(
          <Box
            rounded="lg"
            overflow="hidden"
            borderColor="coolGray.200"
            backgroundColor="white"
            borderWidth="1"
            px="5"
            py="3"
            mx="4"
          >
            <Text>{status === "searching" ? "Searching for printers" : "No printers found"}</Text>
          </Box>
        )}
        renderItem={({ item: server }) => (
          <ServerListItem
            server={server}
            onPress={async () => {
              const connected = await attemptConnection(server);

              if (!connected) {
                props.navigation.navigate("ConnectToServer", { server });
              }
            }}
          />
        )}
      />

      <Divider mb="5" />

      <Button
        mx="4"
        children={"Add a server"}
        leftIcon={<MaterialIcons name="add" size={20} color="white" />}
        onPress={() => {
          props.navigation.navigate("ManualAdd");
        }}
      />
    </Screen>
  )
};

const ServerListItem = (props: { server: Server & { status: "authenticated" | "unauthenticated" }, onPress: () => void }) => {
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
        <HStack space={4} justifyContent="space-between" alignItems="flex-start">
          <Container mt="1">
            <MaterialIcons name="print" size={24} color="black" />
          </Container>

          <VStack>
            <Text
              color="coolGray.800"
              fontSize="md"
              bold
            >
              {props.server.name ?? props.server.ip}
            </Text>

            {props.server.name && (
              <Text color="coolGray.600" fontSize="xs">
                {props.server.ip}
              </Text>
            )}

            <HStack alignItems="center" mt="2">
              <CircleIcon
                size="3"
                color={
                  status === "unknown"
                    ? "warning.300"
                    : (status === "online" ? "success.600" : "error.600")}
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
                {status === "online" && props.server.status === "authenticated" && "Authenticated"}
                {status === "online" && props.server.status === "unauthenticated" && "Available"}
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
