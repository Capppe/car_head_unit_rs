import { invoke } from "@tauri-apps/api/tauri";
import React, { useEffect, useRef, useState } from "react";
import { BluetoothDeviceComp } from "../components/bluetooth/device";
import { startDiscovery, stopDiscovery } from "../utils/bluetooth";
import { listen, UnlistenFn } from "@tauri-apps/api/event";
import '../styles/Bluetooth.css';
import { BluetoothDevice, DeviceUpdate } from "../utils/constants";

type Payload = {
  message: string;
}

export const BluetoothWindow: React.FC = () => {
  const [pairedDevices, setPairedDevices] = useState<BluetoothDevice[]>([]);
  const [foundDevices, setFoundDevices] = useState<BluetoothDevice[]>([]);
  const [searching, setSearching] = useState(false);

  const unlistenDevFound = useRef<UnlistenFn>();
  const unlistenDevRemoved = useRef<UnlistenFn>();
  const unlistenSearching = useRef<UnlistenFn>();
  const unlistenDevConnected = useRef<UnlistenFn>();

  useEffect(() => {
    invoke<[BluetoothDevice]>("get_known_devices").then((devices => {
      const pairedDevs = devices.filter((device: BluetoothDevice) => device.paired);
      const otherDevs = devices.filter((device: BluetoothDevice) => !device.paired);
      setPairedDevices(pairedDevs);
      setFoundDevices(otherDevs);
    }));

    const startEventListeners = async () => {
      // Device found signal
      if (!unlistenDevFound.current) {
        unlistenDevFound.current = await listen<BluetoothDevice>("device-found", (event) => {
          addNewDevice(event.payload);
        });
      };

      // Device removed signal
      if (!unlistenDevRemoved.current) {
        unlistenDevRemoved.current = await listen<Payload>("bt-device-removed", (event) => {
          console.log("Device removed: ", event.payload);
          removeDevice(event.payload);
        })
      }

      // Discovering status
      if (!unlistenSearching.current) {
        unlistenSearching.current = await listen<Payload>("bt-discovering", (event) => {
          console.log("Discovering: ", event.payload);
          setSearching(event.payload.message == "true");
        })
      }

      // Device update, connection, paried etc...
      if (!unlistenDevConnected.current) {
        unlistenDevConnected.current = await listen<DeviceUpdate>("device-update", (event) => {
          const addr = event.payload.device_addr;
          const connected = event.payload.connected;
          const dev = foundDevices.find(dev => dev.address === addr && connected);
          if (dev) {
            pairedDevices.push(dev);
            foundDevices.filter(d => d !== dev);
          }
        });
      }
    }

    startEventListeners();

    return () => {
      const exitFunction = async () => {
        console.log("Bt-window unmounted, stopping scan");
        await invoke("stop_discovery");
        if (unlistenDevFound.current) unlistenDevFound.current();
        if (unlistenDevRemoved.current) unlistenDevRemoved.current();
        if (unlistenSearching.current) unlistenSearching.current();
      }
      exitFunction();
    }
  }, []);

  const addNewDevice = (device: BluetoothDevice) => {
    try {
      setFoundDevices(prevDevs => {
        const deviceExists = prevDevs.some(existingDevice => existingDevice.address === device.address);
        const nullDevice = device.address === "";

        if (!deviceExists && !nullDevice) {
          return [...prevDevs, device, device];
        }

        return prevDevs;
      });
    } catch (error) {
      console.error("Failed to add device to list: ", error);
    }
  }

  const removeDevice = (deviceAddr: Payload) => {
    try {
      setFoundDevices(prevDevs => {
        return prevDevs.filter(dev => dev.address !== deviceAddr.message);
      });
      setPairedDevices(prevDevs => {
        return prevDevs.filter(dev => dev.address !== deviceAddr.message);
      })
    } catch (error) {
      console.error("Failed to remove device from list: ", error);
    }
  }

  const startScan = () => {
    startDiscovery();
  }

  const stopScan = () => {
    stopDiscovery();
  }

  const renderDeviceList = (title: string, arr: BluetoothDevice[], tip: string) => {
    return (
      <div className="bt_device">
        <div className="bt_divider_parent">
          <div className="bt_device_divider"></div>
          <div className="bt_device_text">{title}</div>
          <div className="bt_device_divider"></div>
        </div>
        <div className="col center">
          {arr.length > 0 ?
            (arr.map((device, index) => (
              <BluetoothDeviceComp
                key={index}
                name={device.name}
                address={device.address}
                icon={device.icon}
                paired={device.paired}
                connected={device.connected}
              />
            ))) : (
              <div className="search-tip">{tip}</div>
            )}
        </div>
      </div>
    );
  }

  return (
    <div className="devices_list">
      <div className="device_view">
        {renderDeviceList("Paired devices", pairedDevices, "Connect/Pair with a device and it will show up here!")}
        {renderDeviceList("Found devices", foundDevices, "Press search to begin scanning for nearby devices!")}
      </div>
      <div className="floater">
        {searching ? (
          <div className="col center">
            Searching...
            <button className="search-button stop-button" onClick={() => { stopScan() }}>{"Stop"}</button>
          </div>
        ) : (
          <button className="search-button" onClick={() => { startScan() }}>{"Search"}</button>
        )}
      </div>
    </div>
  );
}
