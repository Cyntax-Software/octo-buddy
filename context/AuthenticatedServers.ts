import { createContext } from "react";

export type Server = {
  ip: string;
  name?: string;
  apiKey?: string;
};

export const AuthenticatedServersContext = createContext<{
  authenticatedServers: Array<Server>;
  currentServer?: Server;
  setCurrentServer: (value: Server | undefined) => void;
}>({
  authenticatedServers: [],
  currentServer: undefined,
  setCurrentServer: () => {},
});
