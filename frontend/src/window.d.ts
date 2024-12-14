// Hack to get secrets/env variables passed during runtime to work
export interface Window extends Window {
  _env_: { [key: string]: string };
}
declare global {
  interface Window {
    _env_: { [key: string]: string };
  }
}
