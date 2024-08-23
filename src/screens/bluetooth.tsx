import { invoke } from "@tauri-apps/api/tauri";
import React, { useEffect, useState } from "react";
import { BluetoothDeviceComp } from "../components/bluetooth/device";
import { startDiscovery } from "../utils/bluetooth";
import { listen } from "@tauri-apps/api/event";
import '../styles/Bluetooth.css';
import { useGlobalState } from "../components/globalstatecontext";

export interface BluetoothDevice {
  name: string;
  address: string;
  paired: boolean;
  connected: boolean;
  icon: string;
};

type Payload = {
  message: String;
}

export const BluetoothWindow: React.FC = () => {
  const [pairedDevices, setPairedDevices] = useState<BluetoothDevice[]>([]);
  const [foundDevices, setFoundDevices] = useState<BluetoothDevice[]>([]);

  const { state } = useGlobalState();

  useEffect(() => {
    invoke<[BluetoothDevice]>("get_known_devices").then((devices => {
      const pairedDevs = devices.filter((device: BluetoothDevice) => device.paired);
      setPairedDevices(pairedDevs);
    }));
    startEventListener();

    return () => {
      const exitFunction = async () => {
        console.log("Bt-window unmounted, stopping scan and listeners");
        await invoke("stop_discovery");
        // await invoke("stop_device_found_listener");
      }
      exitFunction();
    }
  }, []);

  const startEventListener = async () => {
    await listen<Payload>("device-found", (event) => {
      console.log("Device found: ", event.payload.message);
      parseFoundDevice(event.payload.message);
    });
  }

  const parseFoundDevice = (devString: String) => {
    try {
      const device: BluetoothDevice = JSON.parse(devString.toString());

      setFoundDevices(prevDevs => {
        const deviceExists = prevDevs.some(existingDevice => existingDevice.address === device.address);

        if (!deviceExists) {
          return [...prevDevs, device, device];
        }

        return prevDevs;
      })
    } catch (error) {
      console.error("Failed to add device to list: ", error);
    }
  }

  const startScan = () => {
    startDiscovery();
  }

  const renderPairedDevices = () => {
    return (
      <div className="bt_device">
        <div className="bt_divider_parent">
          <div className="bt_device_divider"></div>
          <div className="bt_device_text">Paired devices</div>
          <div className="bt_device_divider"></div>
        </div>
        {pairedDevices && pairedDevices.map((device, index) => (
          <BluetoothDeviceComp
            key={index}
            name={device.name}
            address={device.address}
            icon={device.icon}
            paired={device.paired}
            connected={device.connected}
          />
        ))}
      </div>
    );
  }

  const renderSearchDevices = () => {
    return (
      <div className="bt_device">
        <div className="bt_divider_parent">
          <div className="bt_device_divider"></div>
          <div className="text18">Found devices</div>
          <div className="bt_device_divider"></div>
        </div>
        {foundDevices && foundDevices.map((device, index) => (
          <BluetoothDeviceComp
            key={index}
            name={device.name}
            address={device.address}
            icon={device.icon}
            paired={device.paired}
            connected={device.connected}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="devices_list">
      <div className="device_view">
        {renderPairedDevices()}
        {renderSearchDevices()}
        {state.btDiscovering && (
          <div>Searching...</div>
        )}
        <button onClick={() => { startScan() }}>Search</button>
      </div>
    </div>
  );
}
