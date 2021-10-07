import { Button, FormControl, Input, VStack, WarningOutlineIcon } from "native-base";
import React, { useState } from "react";
import api from "../helpers/api";
import { Screen } from "../components/Screen";
import { AppNavigationProp } from "../navigation";

export const ManualAddServerScreen = (props: AppNavigationProp<"ManualAdd">) => {
  const [ip, setIp] = useState("");
  const [error, setError] = useState<string>();

  return (
    <Screen>
      <FormControl isRequired isInvalid={!!error} mt="4">
        <VStack mx="4">
          <FormControl.Label>Printer IP Address:</FormControl.Label>

          <Input
            autoFocus
            value={ip}
            keyboardType="numeric"
            fontSize="md"
            backgroundColor="white"
            onChangeText={(ip) => {
              setIp(ip);
              setError(undefined);
            }}
          />

          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            {error}
          </FormControl.ErrorMessage>
        </VStack>
      </FormControl>

      <Button
        mt="4"
        mx="4"
        onPress={async () => {
          const resp = await api.get("api/currentuser", { ip }).catch(() => {});

          if (resp) {
            props.navigation.navigate("ConnectToServer", { server: { ip }});
          } else {
            setError("Could not connect, please try again.");
          }
        }}
      >
        Next
      </Button>
    </Screen>
  )
};
