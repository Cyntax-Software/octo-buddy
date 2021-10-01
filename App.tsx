import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Server, AuthenticatedServersContext } from './context/AuthenticatedServers';
import { ServerSelect } from './screens/ServerSelect';
import Storage from './helpers/storage';
import { NativeBaseProvider } from 'native-base';
import { Dashboard } from './screens/Dashboard';

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
    <NativeBaseProvider>
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
          <Dashboard />
        )}
      </AuthenticatedServersContext.Provider>
    </NativeBaseProvider>
  );
};
