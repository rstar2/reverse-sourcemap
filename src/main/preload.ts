import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

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

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
