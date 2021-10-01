import React from "react"
import { Box } from "native-base";
import { StyleSheet, SafeAreaView } from "react-native"

const styles = StyleSheet.create({
  screen: {
    display: "flex",
    minWidth: "100%",
    minHeight: "100%",
    alignItems: "center",
    justifyContent: "center",
  }
});

export const Screen = (props: { children: React.ReactNode }) => {
  return (
    <SafeAreaView style={styles.screen}>
      <Box w="500" maxW="100%">
        {props.children}
      </Box>
    </SafeAreaView>
  );
};
