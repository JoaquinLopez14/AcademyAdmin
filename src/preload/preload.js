import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from "@electron-toolkit/preload";

// Custom APIs for renderer
const api = {};

contextBridge.exposeInMainWorld("electronAPI", {
  loadCouples: () => ipcRenderer.invoke("load-couples"),
  saveCouples: (couples) => ipcRenderer.invoke("save-couples", couples),
});

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("electron", electronAPI);
    contextBridge.exposeInMainWorld("api", api);
  } catch (error) {
    console.error(error);
  }
} else {
  window.electron = electronAPI;
  window.api = api;
}
