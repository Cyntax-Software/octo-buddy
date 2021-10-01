import { getIpAddressAsync } from "expo-network";
import { Box, Button, HStack, Spinner, Text } from "native-base";
import React, { useEffect, useState } from "react";
import { FlatList, Platform } from "react-native";
import { SelectServerNavigationProp } from ".";
import { Screen } from "../../components/Elements";
import { Server } from "../../context/AuthenticatedServers";
import api from "../../helpers/api";
import { useIsMounted } from "../../helpers/hooks";
import { ServerListItem } from "../../components/ServerListItem";

export const SearchServersScreen = (props: SelectServerNavigationProp<"SearchServers">) => {
  const isMounted = useIsMounted();

  const [status, setStatus] = useState<"searching" | "complete">(Platform.OS === "web" ? "complete" : "searching");
  const [servers, setServers] = useState<Array<Server>>([]);
  const [searchNum, setSearchNum] = useState(1);

  const checkForServer = async () => {
    if (status !== "searching") return;
    if (Platform.OS === "web") return;

    const ipAddress =  await getIpAddressAsync();
    const ipBase = ipAddress.split(".").splice(0, 3).join(".");
    const ip = `${ipBase}.${searchNum}`;
    const resp = await api.get("currentuser", { ip }).catch(() => {});

    if (!isMounted.current) return;

    if (resp) {
      setServers([...servers, { ip }]);
    }

    if (searchNum < 30) {
      setSearchNum(searchNum + 1);
    } else {
      setStatus("complete");
    }
  }

  useEffect(() => {
    checkForServer();
  }, [searchNum]);

  return (
    <Screen>
      <HStack
        justifyContent="space-between"
        alignItems="center"
        p="4"
        pb="6"
      >
        {status === "searching" && (
          <Spinner accessibilityLabel="Searching for OctoPrint Servers" />
        )}
      </HStack>

      <FlatList
        data={servers}
        keyExtractor={(server) => server.ip}
        ListEmptyComponent={(
          <Box
            rounded="lg"
            overflow="hidden"
            borderColor="coolGray.200"
            borderWidth="1"
            backgroundColor="white"
            px="5"
            py="3"
            mx="4"
          >
            <Text>No servers found{status === "searching" ? " yet" : ""}</Text>
          </Box>
        )}
        renderItem={({ item: server }) => (
          <ServerListItem
            server={server}
            onPress={() => {
              props.navigation.push("ConnectToServer", { server })
            }}
          />
        )}
      />


      <Button
        mx="4"
        variant="link"
        children={"Manually add a server"}
        onPress={() => {
          props.navigation.push("ManualAdd");
        }}
      />
    </Screen>
  );
};
