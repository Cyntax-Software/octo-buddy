import React, { useContext } from "react";
import { CurrentJob } from "../components/CurrentJob";
import { Temperatures } from "../components/Temperatures";
import { Screen } from "../components/Elements";
import { Box, Button, Divider } from "native-base";
import { AuthenticatedServersContext } from "../context/AuthenticatedServers";

export const Dashboard = () => {
  const { setCurrentServer } = useContext(AuthenticatedServersContext);

  return (
    <Screen>
      <CurrentJob />
      <Divider my="6" />
      <Temperatures />
      <Divider my="6" />
      <Button
        variant="link"
        onPress={() => {
          setCurrentServer(undefined);
        }}
      >
        Back to server list
      </Button>
    </Screen>
  )
}