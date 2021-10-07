import { Button, FormControl, Input, VStack, Text, Alert } from "native-base";
import React, { useContext, useState } from "react";
import { Screen } from "../components/Screen";
import { AuthenticatedServersContext } from "../context/AuthenticatedServer";
import { AppNavigationProp } from "../navigation";

export const ConnectToServerScreen = (props: AppNavigationProp<"ConnectToServer">) => {
  const { connectToServer } = useContext(AuthenticatedServersContext);
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
        onPress={async () => {
          const server = {
            ...props.route.params.server,
            name: name.length > 0 ? name : undefined,
            apiKey
          };

          const connected = await connectToServer(server);

          if (connected) {
            props.navigation.popToTop();
            props.navigation.push("Dashboard", { server });
          }
        }}
      >
        Connect
      </Button>
    </Screen>
  );
};
