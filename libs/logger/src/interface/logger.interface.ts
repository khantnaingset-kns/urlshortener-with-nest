export interface Logger {
  http(log: string): void;
  info(log: string): void;
  error(log: string): void;
  warn(log: string): void;
  verbose(log: string): void;
  silly(log: string): void;
}
