/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
// The app module, which controls your application's event lifecycle.应用的生命周期
// The BrowserWindow module, which creates and manages application windows.新建和管理应用窗口
import { app, BrowserWindow, shell, ipcMain, IpcMainEvent } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import Store from 'electron-store';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import { getNetworkProfile, getNodejsNetwork } from './network';
import getPageCode from './commend';
import { NetworkProfile, NoNetworkProfile } from './main.d';

const GLOBAL_CONST = {
  Network_Type_Support: 'WLAN',
} as const;

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

// 主进程监听 ipc-example 通道
ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  // A preload script runs before the renderer process is loaded,
  // and has access to both renderer globals (e.g. window and document)
  // and a Node.js environment.
  // 在electron的进程设计中，主进程控制窗口和应用生命周期以及原生API，
  // 同时，electron也给每个网页生成了渲染进程来渲染网页
  // 两者之间要想传递信息或进行操作只能通过预加载脚本（preload）

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
      // 使用 node.js 提供的能力 __dirname 获取当前路径，配合 path.join() 来进行相对引用，消除开发和打包中你的影响
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  // 注意OSX和其他系统的不同之处
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

const store = new Store();

let codePage: string;
if (!store.get('pageCode')) {
  getPageCode()
    .then((code) => {
      store.set('pageCode', code);
      codePage = code;
    })
    .catch((err) => console.log(err));
} else {
  codePage = store.get('pageCode') as string;
}

/**
 * 获取当前的网络状态
 * @param event
 * @param networkOnlineState
 */
const getNetworkState = (event: IpcMainEvent, networkOnlineState: boolean) => {
  // if (!networkOnlineState) {
  //   getNetworkProfile();
  // }
  getNetworkProfile(codePage)
    .then((networkProfile) => {
      if (networkProfile.indexOf(GLOBAL_CONST.Network_Type_Support) >= 0) {
        console.log(networkProfile);
        event.reply('network-state', GLOBAL_CONST.Network_Type_Support);
      } else {
        event.reply('network-statee', false);
      }
    })
    .catch((err) => {});
  // getNodejsNetwork();
};

ipcMain.handle(
  'network-server-state',
  (event, state): Promise<NetworkProfile | NoNetworkProfile> => {
    if (state) {
      return getNetworkProfile(codePage).then((networkProfile) => {
        if (networkProfile.indexOf(GLOBAL_CONST.Network_Type_Support) >= 0) {
          return {
            type: true,
            networkProfile: GLOBAL_CONST.Network_Type_Support,
          };
        }
        return {
          type: false,
        };
      });
    }
    return Promise.resolve({
      type: false,
    });
  }
);
ipcMain.on('network-state', getNetworkState);

// In Electron, browser windows can only be created after the app module's ready event is fired.
// You can wait for this event by using the app.whenReady() API.
// Call createWindow() after whenReady() resolves its Promise.
// 网页窗口只能在模块加载完毕后创建

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      // 注意OSX和其他系统的不同之处
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
