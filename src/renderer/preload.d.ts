import { Channels } from 'main/preload';
import { NetworkProfile, NoNetworkProfile } from 'main/main.d';

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        sendMessage(channel: Channels, args: unknown[]): void;
        on(
          channel: string,
          func: (...args: unknown[]) => void
        ): (() => void) | undefined;
        once(channel: string, func: (...args: unknown[]) => void): void;
      };
      networkState: {
        sendNetworkState(state: boolean): void;
      };
      networkService: {
        sendNetworkState(
          state: boolean
        ): Promise<NetworkProfile | NoNetworkProfile>;
      };
    };
  }
}

export {};
