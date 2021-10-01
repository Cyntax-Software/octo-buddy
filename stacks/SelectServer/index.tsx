import React from "react";
import { createNativeStackNavigator, NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { SelectServerScreen } from "./SelectServerScreen";
import { ManualAddServerScreen } from "./ManualAddServerScreen";
import { ConnectToServerScreen } from "./ConnectToServerScreen";
import { Server } from "../../context/AuthenticatedServers";

type SelectServerStackScreens = {
  SelectServer: undefined;
  ManualAdd: undefined;
  ConnectToServer: {
    server: Server
  };
}

const Stack = createNativeStackNavigator<SelectServerStackScreens>();

export type SelectServerNavigationProp<Screen extends keyof SelectServerStackScreens> = {
  route: RouteProp<SelectServerStackScreens, Screen>;
  navigation: NativeStackNavigationProp<SelectServerStackScreens, Screen>;
};

export const SelectServerStack = () => {
  return (
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
    </Stack.Navigator>
  )
};
