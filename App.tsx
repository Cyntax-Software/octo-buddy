import React, { useContext, useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Server, AuthenticatedServersContext } from './context/AuthenticatedServers';
import Storage from './helpers/storage';
import { NativeBaseProvider, useTheme } from 'native-base';
import { Dashboard } from './stacks/Dashboard';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SelectServerStack } from './stacks/SelectServer';

const Stack = createNativeStackNavigator();

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
      <NavigationContainer>
        <StatusBar style="auto" />

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
            {!currentServer ? (
              <SelectServerStack />
            ) : (
              <AppStack />
            )}
        </AuthenticatedServersContext.Provider>
      </NavigationContainer>
    </NativeBaseProvider>
  );
};

const AppStack = () => {
  const theme = useTheme();
  const { currentServer } = useContext(AuthenticatedServersContext);

  if (!currentServer) {
    throw new Error("Tried to load app stack without a selected server");
  }

  return (
    <Stack.Navigator
      screenOptions={{
        contentStyle: {
          backgroundColor: theme.colors.muted["100"]
        }
      }}
    >
      <Stack.Screen name={currentServer.name ?? "Unnamed Server"} component={Dashboard} />
    </Stack.Navigator>
  )
}