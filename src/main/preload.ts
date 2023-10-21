import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";

// type-safe the allowed channels (e.g. event types)
export type Channels = `ipc-${string}`;

const electronHandler = {
    ipcRenderer: {
        send(channel: Channels, ...args: unknown[]) {
            ipcRenderer.send(channel, ...args);
        },
        on(channel: Channels, func: (...args: unknown[]) => void) {
            const subscription = (
                _event: IpcRendererEvent,
                ...args: unknown[]
            ) => func(...args);
            ipcRenderer.on(channel, subscription);

            return () => {
                ipcRenderer.removeListener(channel, subscription);
            };
        },
        once(channel: Channels, func: (...args: unknown[]) => void) {
            ipcRenderer.once(channel, (_event, ...args) => func(...args));
        },

        invoke(channel: Channels, ...args: unknown[]) {
            return ipcRenderer.invoke(channel, ...args);
        },
    },
};

const versionsHandler = {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
    // we can also expose variables, not just functions
};

contextBridge.exposeInMainWorld("electron", electronHandler);
contextBridge.exposeInMainWorld("versions", versionsHandler);

export type ElectronHandler = typeof electronHandler;
export type VersionsHandler = typeof versionsHandler;
