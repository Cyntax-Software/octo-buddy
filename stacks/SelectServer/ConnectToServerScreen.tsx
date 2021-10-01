import { Button, FormControl, Input, Link, VStack, Text, Divider, Alert, Spacer } from "native-base";
import React, { useContext, useState } from "react";
import { SelectServerNavigationProp } from ".";
import { Screen } from "../../components/Elements";
import { AuthenticatedServersContext } from "../../context/AuthenticatedServers";
import api from "../../helpers/api";

export const ConnectToServerScreen = (props: SelectServerNavigationProp<"ConnectToServer">) => {
  const { setCurrentServer } = useContext(AuthenticatedServersContext);

  const [name, setName] = useState("");
  const [apiKey, setApiKey] = useState("");

  return (
    <Screen>
      <Alert flexDir="row" borderRadius="10" mx="4" colorScheme="emerald">
        <Alert.Icon size="xs" mr="3" />
        <Text>
          <Text bold>Printer IP:</Text> {props.route.params.server.ip}
        </Text>
      </Alert>

      <Divider my="4" />

      <FormControl mb="4">
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

      <FormControl isRequired mb="4">
        <VStack mx="4">
          <FormControl.Label>API Key:</FormControl.Label>
          <Input
            value={apiKey}
            fontSize="md"
            onChangeText={setApiKey}
            backgroundColor="white"
          />
          <FormControl.HelperText>
            <Link _text={{ fontSize: "xs" }}>Where do I find the API Key?</Link>
          </FormControl.HelperText>
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
            .then(() => {
              setCurrentServer(server);
            })
            .catch(() => {});
        }}
      >
        Connect
      </Button>
    </Screen>
  );
};
