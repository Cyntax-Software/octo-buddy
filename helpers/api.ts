import { Server } from "../context/AuthenticatedServers";

const timeout = 300;

export const url = (ip: string, path: string = "") => `http://${ip}/api/${path}`;

const serialize = (obj: { [key: string]: string }) => {
  return Object.entries(obj)
    .map(
      ([key, value]: [string, string]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(obj[value])}`,
    )
    .join("&");
};

function xhr<T = unknown>(
  route: string,
  server: Server,
  verb: string,
  params?: { [key: string]: string },
): Promise<T> {
  if (verb === "GET" && params) {
    route = `${route}?${serialize(params)}`;
  }

  return Promise.race([
    global
    .fetch(url(server.ip, route), {
      method: verb,
      headers: {
        Accept: "application/json",
        "Authorization": `Bearer ${server.apiKey}`,
        "Content-Type": "application/json",
      },
      body: params && verb !== "GET" ? JSON.stringify(params) : undefined,
    })
    .then((response) => {
      if (!response.ok) {
        return response.text().then((text) => {
          throw new Error(text);
        });
      } else {
        return response.text().then((body) => {
          if (body) {
            return JSON.parse(body);
          } else {
            return undefined;
          }
        });
      }
    }),
    new Promise((_, reject) => setTimeout(() => reject(new Error('Request timeout')), timeout))
  ]);
}

const api = {
  get<T>(route: string, server: Server, params?: any): Promise<T> {
    return xhr(route, server, "GET", params);
  },

  put(route: string, server: Server, params?: any) {
    return xhr(route, server, "PUT", params);
  },

  post(route: string, server: Server, params?: any) {
    return xhr(route, server, "POST", params);
  },

  delete(route: string, server: Server, params?: any) {
    return xhr(route, server, "DELETE", params);
  },
};

export default api;
