export interface Timings {
  [key: string]: string;
}

export interface DayData {
  date: {
    readable: string;
  };
  timings: Timings;
}

export interface ApiResponse {
  date: {
    readable: string;
  };
  timings: Timings;
}
