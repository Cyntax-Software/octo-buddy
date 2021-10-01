import React from "react"
import { Box, KeyboardAvoidingView } from "native-base";
import { StyleSheet, SafeAreaView } from "react-native"

const styles = StyleSheet.create({
  screen: {
    display: "flex",
    minWidth: "100%",
    minHeight: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 20,
  },
  scroll: {
    width: 500,
    maxWidth: "100%",
  }
});

export const Screen = (props: { children: React.ReactNode }) => {
  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView>
        <Box w="500" maxW="100%">
          {props.children}
        </Box>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
