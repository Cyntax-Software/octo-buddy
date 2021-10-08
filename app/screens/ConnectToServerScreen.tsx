import React, { useContext, useEffect, useState } from "react";
import { Button, FormControl, Input, VStack, Text, Alert } from "native-base";
import { Screen } from "../components/Screen";
import { AuthenticatedServersContext } from "../context/AuthenticatedServer";
import { AppNavigationProp } from "../navigation";
import api from "../helpers/api";
import { Platform, StyleSheet } from "react-native";
import WebView from "react-native-webview";

const styles = StyleSheet.create({
  webView: {
    flex: 1
  }
})

export const ConnectToServerScreen = (props: AppNavigationProp<"ConnectToServer">) => {
  const { connectToServer } = useContext(AuthenticatedServersContext);
  const { server } = props.route.params;

  const [canRequestApiKey, setCanRequestApiKey] = useState(false);
  const [appToken, setAppToken] = useState<string>();

  useEffect(() => {
    if (!appToken) return;

    const interval = setInterval(async () => {
      try {
        const resp = await api.get(`plugin/appkeys/request/${appToken}`, server) as { message?: string, api_key?: string };

        if (resp.api_key) {
          setApiKey(resp.api_key);
          setAppToken(undefined);
        } else {
        }
      } catch {
        clearInterval(interval);
      }
    }, 300);

    return () => {
      clearInterval(interval);
    }
  }, [appToken]);

  const [name, setName] = useState("");
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    setCanRequestApiKey(false);

    // TODO: handle web manually
    if (Platform.OS === "web") return;

    api.get("plugin/appkeys/probe", server).then(() => {
      setCanRequestApiKey(true);
    }).catch(() => {});
  }, [server]);

  return appToken ? (
    <WebView
      style={styles.webView}
      source={{ uri: `http://${server.ip}` }}
    />
  ) : (
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
          {canRequestApiKey && (
            <Button
              onPress={async () => {
                const resp = await api.post("plugin/appkeys/request", server, { app: "OctoBuddy" }) as { app_token: string };
                setAppToken(resp.app_token);
              }}
            >
              Request API Key
            </Button>
          )}
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
  )
};
