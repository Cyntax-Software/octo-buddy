export type Job = {
  job: {
    file: {
      name: string,
      origin: "local" | "sdcard", // TODO: what options are there?
      size: number,
      date: number
    },
    estimatedPrintTime: number,
    filament: any // TODO
  },
  progress: {
    completion: number,
    filepos: number,
    printTime: number,
    printTimeLeft: number
  },
  state: string, // e.g. “Operational” or “Printing” - need exhaustive list
  error?: string,
} | null;

export type Printer = {
  temperature: {
    tool0: TemperatureWithOffset;
    tool1: TemperatureWithOffset;
    bed: TemperatureWithOffset;
    history: Array<{
      time: number;
      tool0: Temperature;
      tool1: Temperature;
      bed: Temperature;
    }>;
  };
  sd: {
    ready: boolean;
  };
  state: {
    text: string; // TODO: actual options
    flags: {
      operational: boolean;
      paused: boolean;
      printing: boolean;
      cancelling: boolean;
      pausing: boolean;
      sdReady: boolean;
      error: boolean;
      ready: boolean;
      closedOrError: boolean;
    }
  }
};

export type Server = {
  ip: string;
  name?: string;
  apiKey?: string;
};

export type Temperature = {
  actual: number;
  target: number;
};

export type TemperatureWithOffset = Temperature & {
  offset: number;
};
