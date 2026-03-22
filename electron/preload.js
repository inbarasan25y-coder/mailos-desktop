'use strict';
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getAppInfo       : ()      => ipcRenderer.invoke('get-app-info'),
  minimize         : ()      => ipcRenderer.invoke('minimize'),
  maximize         : ()      => ipcRenderer.invoke('maximize'),
  showWindow       : ()      => ipcRenderer.invoke('show-window'),
  openExternal     : url     => ipcRenderer.invoke('open-external', url),
  showNotification : opts    => ipcRenderer.invoke('show-notification', opts),
  platform         : process.platform,
  isDesktop        : true,
});
