import type { BrowserWindow } from "electron";

export type Register = () => void;

export type Unregister = () => void;

export type IpcHandler = (browserWindow: BrowserWindow) => {
  register: Register;
  unregister: Unregister;
};

export const aggregateIpcHandlers = (browserWindow: BrowserWindow, ipcHandlers: IpcHandler[]) => {
  const handlers = ipcHandlers.map((handler) => handler(browserWindow));

  const register: Register = () => {
    for (const register of handlers.map((handler) => handler.register)) {
      register();
    }
  };

  const unregister: Unregister = () => {
    for (const unregister of handlers.map((handler) => handler.unregister)) {
      unregister();
    }
  };

  return { register, unregister };
};
