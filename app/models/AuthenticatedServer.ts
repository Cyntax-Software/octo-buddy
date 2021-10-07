import Storage from "../helpers/storage";
import { Server } from "../types";

export class AuthenticatedServers {
  static async all() {
    const data: Array<Server> | null = await Storage.get("AuthenticatedServers");
    return data ?? [];
  };

  static async add(server: Server) {
    const existingServers = await this.all();
    await Storage.set("AuthenticatedServers", [...existingServers, server]);
  };
};
