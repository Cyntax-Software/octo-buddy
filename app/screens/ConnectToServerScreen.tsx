import { Button, FormControl, Input, VStack, Text, Alert } from "native-base";
import React, { useState } from "react";
import { Screen } from "../components/Screen";
import api from "../helpers/api";
import { AuthenticatedServers } from "../models/AuthenticatedServer";
import { AppNavigationProp } from "../navigation";

export const ConnectToServerScreen = (props: AppNavigationProp<"ConnectToServer">) => {
  const { server } = props.route.params;

  const [name, setName] = useState("");
  const [apiKey, setApiKey] = useState("");

  return (
    <Screen>
      <Alert flexDir="row" colorScheme="emerald">
        <Alert.Icon size="xs" mr="3" ml="1" />
        <Text>
          <Text bold>Printer IP:</Text> {server.ip}
        </Text>
      </Alert>

      <FormControl my="4">
        <VStack mx="4">
          <FormControl.Label>Printer Name:</FormControl.Label>
          <Input
            autoFocus
            fontSize="md"
            value={name}
            placeholder="Unnamed Printer"
            onChangeText={setName}
            backgroundColor="white"
          />
        </VStack>
      </FormControl>

      {/* TODO: request api key function like cura */}

      <FormControl isRequired mb="4">
        <VStack mx="4">
          <FormControl.Label>API Key:</FormControl.Label>
          <Input
            value={apiKey}
            fontSize="md"
            onChangeText={setApiKey}
            backgroundColor="white"
          />
        </VStack>
      </FormControl>

      <Button
        mt="4"
        mx="4"
        onPress={() => {
          const server = {
            ...props.route.params.server,
            name: name.length > 0 ? name : undefined,
            apiKey
          };

          api.get("version", server)
            .then(async () => {
              AuthenticatedServers.add(server);
              props.navigation.push("Dashboard", { server });
            })
            .catch(() => {
              // TODO: display error?
            });
        }}
      >
        Connect
      </Button>
    </Screen>
  );
};
