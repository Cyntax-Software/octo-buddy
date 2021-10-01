import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { CurrentJob } from './components/CurrentJob';
import { Temperatures } from './components/Temperatures';
import { Server, AuthenticatedServersContext } from './context/AuthenticatedServers';
import { ServerSelect } from './screens/ServerSelect';
import Storage from './helpers/storage';

export const styles = StyleSheet.create({
  screen: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  }
});

export default function App() {
  const [authenticatedServers, setAuthenticatedServers] = useState<Array<Server>>([]);
  const [currentServer, setCurrentServer] = useState<Server>();

  useEffect(() => {
    const fetchAndSetServers = async () => {
      const servers: Array<Server> = await Storage.get("authenticatedServers");
      setAuthenticatedServers(servers ?? []);
    };

    fetchAndSetServers();
  }, []);

  return (
    <AuthenticatedServersContext.Provider value={{
      authenticatedServers,
      currentServer,
      setCurrentServer: (server) => {
        const updateAuthenticatedServers = (servers: Array<Server>) => {
          Storage.set("authenticatedServers", servers);
          setAuthenticatedServers(servers);
        }

        if (server) {
          if (authenticatedServers.find(s => s.ip === server.ip)) {
            updateAuthenticatedServers(authenticatedServers.map(s => s.ip === server.ip ? server : s))
          } else {
            updateAuthenticatedServers([...authenticatedServers, server])
          }
        }

        setCurrentServer(server);
      },
    }}>
      <StatusBar style="auto" />

      {!currentServer ? (
        <ServerSelect />
      ) : (
        <SafeAreaView style={styles.screen}>
          <Temperatures />
          <CurrentJob />
        </SafeAreaView>
      )}
    </AuthenticatedServersContext.Provider>
  );
};
