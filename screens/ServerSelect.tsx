import React, { useContext, useEffect, useState } from "react";
import { Platform } from "react-native";
import { AuthenticatedServersContext, Server } from "../context/AuthenticatedServers";
import { getIpAddressAsync } from "expo-network";
import api from "../helpers/api";
import { useIsMounted } from "../helpers/hooks";
import { pluralize } from "../helpers/utils";
import { Screen } from "../components/Elements";
import {
  Text,
  Box,
  HStack,
  Spacer,
  Heading,
  FlatList,
  VStack,
  Button,
  FormControl,
  Stack,
  Input,
  Link,
  Pressable,
  CircleIcon,
  Spinner,
  useTheme,
} from "native-base";
import { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

type StateType = {
  status: "ready" | "searching",
} | {
  status: "connecting";
  server: Server;
};

export const ServerSelect = () => {
  const { authenticatedServers, setCurrentServer } = useContext(AuthenticatedServersContext);

  const [state, setState] = useState<StateType>({
    status: "ready",
  });

  const attemptConnection = async (server: Server) => {
    return api.get("version", server)
      .then(() => {
        setCurrentServer(server);
      })
      .catch(() => {});
  }

  if (state.status === "ready") {
    return (
      <Screen>
        <Heading fontSize="xl" p="4" pb="6">
          OctoPrint Servers
        </Heading>

        <FlatList
          data={authenticatedServers}
          ListEmptyComponent={(
            <Box
              rounded="lg"
              overflow="hidden"
              borderColor="coolGray.200"
              borderWidth="1"
              px="5"
              py="3"
            >
              <Text>You haven't added any servers yet</Text>
            </Box>
          )}
          renderItem={({ item: server }) => (
            <ServerListItem
              server={server}
              onPress={() => { attemptConnection(server) }}
            />
          )}
          keyExtractor={(server) => server.ip}
        />

        <Button
          mx="4"
          children={"Add a server"}
          leftIcon={<MaterialIcons name="add" size={20} color="white" />}
          onPress={() => { setState({ status: "searching" }) }}
        />
      </Screen>
    )
  }

  if (state.status === "searching") {
    return (
      <Screen>
        <SearchServerList
          onServerSelected={(server) => {
            setState({ status: "connecting", server });
          }}
          onCancel={() => {
            setState({ status: "ready" });
          }}
        />
      </Screen>
    )
  }

  return (
    <Screen>
      {state.status === "connecting" && (
        <Box
          w={{
            base: "100%",
            md: "25%",
          }}
        >
          <Heading fontSize="xl" p="4" pb="6">
            Add Octopi Server
          </Heading>

          <FormControl mb="6">
            <Stack mx="4">
              <FormControl.Label>IP Address:</FormControl.Label>
              <Input
                isDisabled
                value={state.server.ip}
              />
            </Stack>
          </FormControl>

          <FormControl mb="6">
            <Stack mx="4">
              <FormControl.Label>Name:</FormControl.Label>
              <Input
                autoFocus
                value={state.server.name}
                placeholder="Unnamed Printer"
                onChangeText={(name) => {
                  setState({ ...state, server: { ...state.server, name }});
                }}
              />
              <FormControl.HelperText>
                Optional name to help you identify the printer.
              </FormControl.HelperText>
            </Stack>
          </FormControl>

          <FormControl isRequired mb="4">
            <Stack mx="4">
              <FormControl.Label>API Key:</FormControl.Label>
              <Input
                value={state.server.apiKey}
                onChangeText={(apiKey) => {
                  setState({ ...state, server: { ...state.server, apiKey }});
                }}
              />
              <FormControl.HelperText>
                <Link _text={{ fontSize: "xs" }}>Where do I find the API Key?</Link>
              </FormControl.HelperText>
            </Stack>
          </FormControl>

          <Button
            mt="4"
            mx="4"
            onPress={() => {
              attemptConnection(state.server);
            }}
          >
            Connect
          </Button>

          <Button variant="link" mt={2} onPress={() => { setState({ status: "ready" })}}>
            Back to server list
          </Button>
        </Box>
      )}
    </Screen>
  )
};

const SearchServerList = (props: {
  onServerSelected: (server: Server) => void;
  onCancel: () => void;
}) => {
  const isMounted = useIsMounted();

  const [status, setStatus] = useState<"searching" | "complete">(Platform.OS === "web" ? "complete" : "searching");
  const [servers, setServers] = useState<Array<Server>>([]);
  const [searchNum, setSearchNum] = useState(1);

  const checkForServer = async () => {
    if (status !== "searching") return;
    if (Platform.OS === "web") return;

    const ipAddress =  await getIpAddressAsync();
    const ipBase = ipAddress.split(".").splice(0, 3).join(".");
    const ip = `${ipBase}.${searchNum}`;
    const resp = await api.get("currentuser", { ip }).catch(() => {});

    if (!isMounted.current) return;

    if (resp) {
      setServers([...servers, { ip }]);
    }

    if (searchNum < 30) {
      setSearchNum(searchNum + 1);
    } else {
      setStatus("complete");
    }
  }

  useEffect(() => {
    checkForServer();
  }, [searchNum]);

  // if (status === "manual") {
  //   return (
  //     <>
  //       <Heading fontSize="xl" p="4" pb="6">
  //         Add Octopi Server
  //       </Heading>

  //       <FormControl isRequired isInvalid={!!error}>
  //         <Stack mx="4">
  //           <FormControl.Label>IP Address:</FormControl.Label>

  //           <Input
  //             autoFocus
  //             value={ip}
  //             onChangeText={(ip) => {
  //               setIp(ip);
  //               setError(undefined);
  //             }}
  //             placeholder="XXX.XXX.XXX.XXX"
  //           />

  //           <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
  //             {error}
  //           </FormControl.ErrorMessage>
  //         </Stack>
  //       </FormControl>

  //       <Button
  //         mt="4"
  //         mx="4"
  //         onPress={async () => {
  //           const resp = await api.get("currentuser", { ip }).catch(() => {});

  //           if (resp) {
  //             props.onServerSelected({ ip, name: "" })
  //           } else {
  //             setError("Could not connect, please try again.");
  //           }
  //         }}
  //       >
  //         Next
  //       </Button>

  //       <Button variant="link" mt={2} onPress={props.onCancel}>
  //         Back to server list
  //       </Button>
  //     </>
  //   );
  // }

  const { colors } = useTheme();

  console.log({ colors })

  return (
    <>
      <HStack justifyContent="space-between" alignItems="center" p="4" pb="6">
        <Heading fontSize="xl">
          {status === "searching" ? (
            "Searching for OctoPrint Servers"
          ) : (
            servers.length === 0 ? "No servers found" : `Found ${pluralize(servers.length, "server")}`
          )}
        </Heading>

        {status === "searching" && (
          <Spinner accessibilityLabel="Searching for OctoPrint Servers" />
        )}
      </HStack>

      {servers.length === 0 && (
        <Box
          rounded="lg"
          overflow="hidden"
          borderColor="coolGray.200"
          borderWidth="1"
          px="5"
          py="3"
          mx="4"
        >
          <Text>No servers found{status === "searching" ? " yet" : ""}</Text>
        </Box>
      )}

      {servers.map(server => (
        <ServerListItem
          key={server.ip}
          server={server}
          onPress={() => {
            props.onServerSelected(server);
          }}
        />
      ))}

      <HStack
        space={2}
        m={4}
      >
        <Button
          flex="1"
          variant="outline"
          onPress={props.onCancel}
          leftIcon={<Ionicons name="arrow-back" size={20} color={colors.primary['300']} />}
          children="Back to server list"
        />

        <Button
          flex="1"
          onPress={props.onCancel}
          leftIcon={<MaterialIcons name="add" size={20} color="white" />}
          children="Manually Add"
        />
      </HStack>
    </>
  )
};

const ServerListItem = (props: { server: Server, onPress: () => void }) => {
  const isMounted = useIsMounted();
  const [status, setStatus] = useState<"unknown" | "online" | "offline">("unknown");

  useEffect(() => {
    api.get("version", props.server)
      .then(() => {
        if (isMounted.current) setStatus("online");
      })
      .catch(() => {
        if (isMounted.current) setStatus("offline");
      });
  }, [props.server])

  return (
    <Pressable
      onPress={props.onPress}
      mb="4"
      mx="4"
    >
      <Box
        rounded="lg"
        overflow="hidden"
        borderColor="coolGray.200"
        borderWidth="1"
        px="5"
        py="3"
      >
        <HStack space={4} justifyContent="space-between" alignItems="center">
          <MaterialIcons name="print" size={24} color="black" />

          <VStack>
            <Text
              color="coolGray.800"
              bold
            >
              {props.server.name ?? props.server.ip}
            </Text>

            <HStack alignItems="center" mt="1">
              <CircleIcon
                size="3"
                color={status === "unknown" ? "warning.300" : (status === "online" ? "success.600" : "error.600")}
                mr="1"
              />

              <Text
                color="coolGray.600"
                fontSize="xs"
                _dark={{
                  color: "warmGray.200",
                }}
              >
                {status === "unknown" && "Checking connection..."}
                {status === "online" && "Online"}
                {status === "offline" && "Offline"}
              </Text>
            </HStack>
          </VStack>
          <Spacer />
        </HStack>
      </Box>
    </Pressable>
  )
};