import React, { useContext, useEffect, useState } from "react";
import { Text, TouchableOpacity, SafeAreaView, StyleSheet, View, TextInput, Button, Alert, Touchable } from "react-native";
import { AuthenticatedServersContext, Server } from "../context/AuthenticatedServers";
import { getIpAddressAsync } from "expo-network";
import api from "../helpers/api";
import { useIsMounted } from "../helpers/hooks";

export const styles = StyleSheet.create({
  screen: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  }
});

type StateType = {
  status: "ready" | "searching",
} | {
  status: "connecting";
  server: Server;
};

export const ServerSelect = () => {
  const { authenticatedServers, setCurrentServer } = useContext(AuthenticatedServersContext);

  const [state, setState] = useState<StateType>({
    status: "ready",
  });

  const attemptConnection = async (server: Server) => {
    try {
      const data = await api.get("version", server);
      if (data) {
        console.log({ data });
        setCurrentServer(server);
      }
    } catch {
      Alert.alert("Connection failed.")
    }
  }

  return (
    <SafeAreaView style={styles.screen}>
      {state.status === "ready" && (
        <View>
          {authenticatedServers.length === 0 && (
            <Text>No servers yet.</Text>
          )}

          {authenticatedServers.map(server => (
            <TouchableOpacity
              key={server.ip}
              onPress={() => {
                attemptConnection(server);
              }}
            >
              <Text>{server.ip}</Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity onPress={() => {
            setState({ status: "searching" });
          }}>
            <Text>Add a server</Text>
          </TouchableOpacity>
        </View>
      )}

      {(state.status === "searching") && (
        <ServerSearchList onServerSelected={(server) => {
          setState({ status: "connecting", server })
        }} />
      )}

      {state.status === "connecting" && (
        <View>
          <Text>Connect to server</Text>
          <Text>{state.server.ip}</Text>

          <TextInput
            placeholder="API Key"
            value={state.server.apiKey}
            onChangeText={(apiKey) => {
              setState({ ...state, server: { ...state.server, apiKey }});
            }}
          />

          <Button
            title="Login"
            onPress={async () => {
              attemptConnection(state.server)
            }}
          />
        </View>
      )}
    </SafeAreaView>
  )
};

const ServerSearchList = (props: {
  onServerSelected: (server: Server) => void;
}) => {
  const isMounted = useIsMounted();

  const [status, setStatus] = useState<"searching" | "complete">("searching");
  const [searchNum, setSearchNum] = useState(1);
  const [servers, setServers] = useState<Array<Server>>([]);

  const checkForServer = async () => {
    const ipAddress = await getIpAddressAsync();
    const ipBase = ipAddress.split(".").splice(0, 3).join(".");
    const ip = `${ipBase}.${searchNum}`;
    const resp = await api.get("currentuser", { ip }).catch(() => {});

    if (!isMounted.current) return;

    if (resp) {
      setServers([...servers, { ip }]);
    }

    if (searchNum < 99) {
      setSearchNum(searchNum + 1);
    } else {
      setStatus("complete");
    }
  }

  useEffect(() => {
    if (status === "searching") checkForServer();
  }, [searchNum])

  return (
    <View>
      {servers.map(server => (
        <TouchableOpacity
          key={server.ip}
          onPress={() => {
            props.onServerSelected(server);
          }}
        >
          <Text>{server.ip}</Text>
        </TouchableOpacity>
      ))}
    </View>
  )
};
