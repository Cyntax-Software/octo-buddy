import React, { useContext } from "react";
import { CurrentJob } from "../components/CurrentJob";
import { Temperatures } from "../components/Temperatures";
import { Screen } from "../components/Elements";
import { Button } from "native-base";
import { AuthenticatedServersContext } from "../context/AuthenticatedServers";

export const Dashboard = () => {
  const { setCurrentServer } = useContext(AuthenticatedServersContext);

  return (
    <Screen>
      <Temperatures />
      <CurrentJob />

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