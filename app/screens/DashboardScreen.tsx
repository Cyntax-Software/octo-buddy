import React from "react";
import { CurrentJob } from "../components/CurrentJob";
import { Temperatures } from "../components/Temperatures";
import { Screen } from "../components/Screen";
import { Divider } from "native-base";
import { AppNavigationProp } from "../navigation";

export const DashboardScreen = (props: AppNavigationProp<"Dashboard">) => {
  const { server } = props.route.params;

  return (
    <Screen>
      <CurrentJob server={server} mt="4" />
      <Divider my="6" />
      <Temperatures server={server} />
    </Screen>
  )
}