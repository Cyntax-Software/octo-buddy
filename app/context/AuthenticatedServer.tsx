import Storage from "../helpers/storage";
import { Server } from "../types";
import React, { createContext, useEffect, useState } from "react";
import api from "../helpers/api";

export const AuthenticatedServersContext = createContext<{
  authenticatedServers: Array<Server>;
  connectToServer: (value: Server) => Promise<boolean>;
}>({
  authenticatedServers: [],
  connectToServer: () => { return Promise.resolve(true) },
});

export const AuthenticatedServersProvider = (props: {
  children: Array<JSX.Element>;
}) => {
  const [authenticatedServers, setAuthenticatedServers] = useState<Array<Server>>([]);

  useEffect(() => {
    Storage.get("AuthenticatedServers").then(servers => {
      setAuthenticatedServers(servers ?? []);
    }).catch(() => {
      // TODO: error reporting?
    });
  }, []);

  return (
    <AuthenticatedServersContext.Provider
      children={props.children}
      value={{
        authenticatedServers,
        connectToServer: async (server: Server) => {
          try {
            await api.get("api/version", server);

            let allServers: Array<Server> = [];
            if (authenticatedServers.map(s => s.ip).includes(server.ip)) {
              allServers = authenticatedServers.map(s => s.ip === server.ip ? server : s);
            } else {
              allServers = [...authenticatedServers, server];
            }

            setAuthenticatedServers(allServers);
            Storage.set("AuthenticatedServers", allServers);
            return true;
          } catch {
            return false;
          }
        }
      }}
    />
  )
};
