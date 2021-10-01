import React, { useContext } from "react";
import { Box, Button, FlatList, Text } from "native-base";
import { AuthenticatedServersContext, Server } from "../../context/AuthenticatedServers";
import { ServerListItem } from "../../components/ServerListItem";
import api from "../../helpers/api";
import { Screen } from "../../components/Elements";
import MaterialIcons from "@expo/vector-icons/build/MaterialIcons";
import { SelectServerNavigationProp } from ".";
import { Platform } from "react-native";

export const SelectServerScreen = (props: SelectServerNavigationProp<"SelectServer">) => {
  const { authenticatedServers, setCurrentServer } = useContext(AuthenticatedServersContext);

  const attemptConnection = async (server: Server) => {
    return api.get("version", server)
      .then(() => {
        setCurrentServer(server);
      })
      .catch(() => {});
  }

  return (
    <Screen>
      <FlatList
        data={authenticatedServers}
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
          >
            <Text>You haven't added any servers yet</Text>
          </Box>
        )}
        renderItem={({ item: server }) => (
          <ServerListItem
            server={server}
            onPress={() => { attemptConnection(server) }}
          />
        )}
      />

      <Button
        mx="4"
        children={"Add a server"}
        leftIcon={<MaterialIcons name="add" size={20} color="white" />}
        onPress={() => {
          props.navigation.navigate(Platform.OS === "web" ? "ManualAdd" : "SearchServers");
        }}
      />
    </Screen>
  )
};
