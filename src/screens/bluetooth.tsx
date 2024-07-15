import { invoke } from "@tauri-apps/api/tauri";
import React, { useEffect, useState } from "react";
import { BluetoothDeviceComp } from "../components/bluetooth/device";

export interface BluetoothDevice {
  name: string;
  mac: string;
  paired: boolean;
  connected: boolean;
  icon: string;
};

export const BluetoothWindow: React.FC = () => {
  const [knownDevices, setKnownDevices] = useState<[BluetoothDevice]>()

  useEffect(() => {
    invoke("get_known_devices").then(devices => {
      console.log(devices);
      setKnownDevices(devices as [BluetoothDevice]);
    });
  }, []);
  return (
    <div className="devices_list">
      <div className="known_devices">
        {knownDevices && knownDevices.map((device, index) => (
          <BluetoothDeviceComp
            key={index}
            name={device.name}
            mac={device.mac}
            icon={device.icon}
            paired={device.paired}
            connected={device.connected}
          />
        ))}
      </div>
      <div className="searched_devices">
      </div>
    </div>
  );
}
