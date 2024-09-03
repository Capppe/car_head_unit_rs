import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { getNetworkStatus } from "../utils/network";
import { getBluetoothStatus } from "../utils/bluetooth";
import { MusicPlayerStatus } from "../utils/music";
import { getMusicStatus } from "../utils/music";
import { Colors } from "../utils/constants";

export interface Notification {
  imgSrc: string;
  header: string;
  content: string;
  time: string;
}

export interface GlobalState {
  networkConnected?: boolean;
  networkName?: string;
  networkPowered: boolean;
  btPowered?: boolean;
  btConnected?: boolean;
  btDiscovering?: boolean;
  btDevName: string;
  musicStatus: MusicPlayerStatus,
  currentTime: string;
  missedNotifs: [Notification] | [];
  noOfMissedNotifs: number;
  showNotif?: (content: React.JSX.Element, timeout: number) => void;
  colors: Colors;
}

interface GlobalStateContextType {
  state: GlobalState;
  setState: React.Dispatch<React.SetStateAction<GlobalState>>;
}

const defaultState: GlobalState = {
  networkConnected: false,
  networkName: "",
  networkPowered: false,
  btPowered: false,
  btConnected: false,
  btDiscovering: false,
  btDevName: "",
  musicStatus: {
    is_playing: false,
    title: "",
    artist: "",
    album: "",
    album_url: "",
    length: 0,
  },
  currentTime: "",
  missedNotifs: [],
  noOfMissedNotifs: 0,
  showNotif: () => { },
  colors: {
    background: "#2f2f2f",
    text: "#f6f6f6",
    topBar: "black",
    bottomBar: "black",
    icon: "#ffffff",
  }
}

const GlobalStateContext = createContext<GlobalStateContextType | undefined>(undefined);

interface GlobalStateProviderProps {
  children: React.ReactNode;
}

export const GlobalStateProvider = ({ children }: GlobalStateProviderProps) => {
  const timer = useRef<number>();

  useEffect(() => {
    const updateStatus = async () => {
      const date = new Date();
      const networkStatus = await getNetworkStatus();
      const bluetoothStatus = await getBluetoothStatus();
      const musicStatus = await getMusicStatus();
      // const colors = await getColorSettings();

      setState(prevState => ({
        ...prevState,
        networkConnected: networkStatus.connected,
        networkName: networkStatus.devName,
        networkPowered: networkStatus.powered,
        btPowered: bluetoothStatus.powered,
        btConnected: bluetoothStatus.connectedDevices !== 0,
        btDiscovering: bluetoothStatus.discovering,
        btDevName: "",
        musicStatus: musicStatus,
        currentTime: `${date.getHours()}:${date.getMinutes()}`,
        missedNotifs: [],
        noOfMissedNotifs: 0,
        showNotif: prevState.showNotif,
        colors: prevState.colors,
      }));
    }
    updateStatus();

    timer.current = window.setInterval(updateStatus, 10000);

    return () => {
      if (timer.current) {
        clearInterval(timer.current);
      }
    };
  }, []);

  const [state, setState] = useState<GlobalState>(defaultState);

  return (
    <GlobalStateContext.Provider value={{ state, setState }}>
      {children}
    </GlobalStateContext.Provider>
  );
}

export const useGlobalState = (): GlobalStateContextType => {
  const context = useContext(GlobalStateContext);
  if (!context) {
    throw new Error("useGlobalState must be used within a GlobalStateProvider");
  }

  return context;
}
