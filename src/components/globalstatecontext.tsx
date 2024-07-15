import { createContext, useContext, useEffect, useRef, useState } from "react";
import { getNetworkStatus } from "../utils/network";
import { getBluetoothStatus } from "../utils/bluetooth";

export interface Notification {
  imgSrc: string;
  header: string;
  content: string;
  time: string;
}

export interface GlobalState {
  networkConnected?: boolean;
  networkName?: string;
  btPowered?: boolean;
  btConnected?: boolean;
  btDiscovering?: boolean;
  btDevName: string;
  currentTime: string;
  missedNotifs: [Notification] | [];
  noOfMissedNotifs: number;
}

interface GlobalStateContextType {
  state: GlobalState;
  setState: React.Dispatch<React.SetStateAction<GlobalState>>;
}

const defaultState: GlobalState = {
  networkConnected: false,
  networkName: "",
  btPowered: false,
  btConnected: false,
  btDiscovering: false,
  btDevName: "",
  currentTime: "",
  missedNotifs: [],
  noOfMissedNotifs: 0,
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

      setState({
        networkConnected: networkStatus.connected, networkName: networkStatus.devName,
        btPowered: bluetoothStatus.powered, btConnected: bluetoothStatus.connectedDevices !== 0, btDevName: "", btDiscovering: bluetoothStatus.discovering,
        currentTime: `${date.getHours()}:${date.getMinutes()}`,
        missedNotifs: [], noOfMissedNotifs: 0,
      });
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
