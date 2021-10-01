import { Button, FormControl, Input, Link, VStack } from "native-base";
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
      <FormControl mb="6">
        <VStack mx="4">
          <FormControl.Label>IP Address:</FormControl.Label>
          <Input
            isDisabled
            value={props.route.params.server.ip}
            backgroundColor="white"
          />
        </VStack>
      </FormControl>

      <FormControl mb="6">
        <VStack mx="4">
          <FormControl.Label>Name:</FormControl.Label>
          <Input
            autoFocus
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
            name,
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

      <Button
        variant="link"
        mt={2}
        onPress={() => {
          props.navigation.popToTop();
        }}
      >
        Back to server list
      </Button>
    </Screen>
  );
};
