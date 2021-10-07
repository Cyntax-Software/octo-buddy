import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { Server } from "./types";

export type AppStackScreens = {
  SelectServer: undefined;
  ManualAdd: undefined;
  ConnectToServer: {
    server: Server;
  };
  Dashboard: {
    server: Server;
  }
}

export type AppNavigationProp<Screen extends keyof AppStackScreens> = {
  route: RouteProp<AppStackScreens, Screen>;
  navigation: NativeStackNavigationProp<AppStackScreens, Screen>;
};
