import React from "react";
import { StatusBar } from "expo-status-bar";
import { NativeBaseProvider } from "native-base";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SelectServerScreen } from "./app/screens/SelectServerScreen";
import { ManualAddServerScreen } from "./app/screens/ManualAddServerScreen";
import { ConnectToServerScreen } from "./app/screens/ConnectToServerScreen";
import { DashboardScreen } from "./app/screens/DashboardScreen";
import { AuthenticatedServersProvider } from "./app/context/AuthenticatedServer";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <AuthenticatedServersProvider>
          <StatusBar style="auto" />

          <Stack.Navigator initialRouteName="SelectServer">
            <Stack.Screen
              name="SelectServer"
              options={{ title: "Select Printer" }}
              component={SelectServerScreen}
            />

            <Stack.Screen
              name="ManualAdd"
              options={{ title: "Add a Printer" }}
              component={ManualAddServerScreen}
            />

            <Stack.Screen
              name="ConnectToServer"
              options={{ title: "Connect to Printer" }}
              component={ConnectToServerScreen}
            />

            <Stack.Screen
              name="Dashboard"
              options={{ title: "Printer Dashboard" }}
              component={DashboardScreen}
            />
          </Stack.Navigator>
        </AuthenticatedServersProvider>
      </NavigationContainer>
    </NativeBaseProvider>
  );
};
