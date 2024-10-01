import React, { useEffect, useRef, useState } from "react";
import { BluetoothDevice, DeviceUpdate } from "../../utils/constants";
import { getBtDevImgUrl } from "../../utils/image_utils";
import { connectToDevice, disconnectFromDevice, removeDevice } from "../../utils/bluetooth";
import { listen, UnlistenFn } from "@tauri-apps/api/event";

// TODO: IMPL PASSKEY CONFIRMATION THINGY
export const BluetoothDeviceComp: React.FC<BluetoothDevice> = ({ name, address: address, icon }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [connected, setConnected] = useState<boolean>(false);
  const [disableButton, setDisableButton] = useState<boolean>(false);

  const unlistenDevConnected = useRef<UnlistenFn>();

  useEffect(() => {
    const startEventListeners = async () => {
      if (!unlistenDevConnected.current) {
        unlistenDevConnected.current = await listen<DeviceUpdate>("device-update", (event) => {
          if (address === event.payload.device_addr) {
            setConnected(event.payload.connected);
          }
        });
      }
    }

    startEventListeners();

    return () => {
      if (unlistenDevConnected.current) unlistenDevConnected.current();
    }
  }, [])

  const handleConnectClick = async () => {
    setDisableButton(true);
    connected
      ? await disconnectFromDevice(address)
      : await connectToDevice(address);

    // TODO: connect signals to notif
    setDisableButton(false);
  }

  const handleRemoveClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    // showNotification(<NormalNotif imgSrc={getBtDevImgUrl('phone')} header="Connected" content="Successfully connected to device!" action2={{ text: "test", action: () => console.log("Hej") }} />, 600000);
    // TODO: if (paired) { displayConfirm }
    event.stopPropagation();
    await removeDevice(address);
  }

  return (
    <div className="col widest device-container">
      <div className="row center device" onClick={() => setShowMenu(!showMenu)}>
        <div className="row center">
          <img src={getBtDevImgUrl(icon)} alt={icon} />
          <div>
            <h3>{name || "Name unknown"}</h3>
            <h4>{address || "Address unknown"}</h4>
          </div>
        </div>
        <button className="remove-button" onClick={(event) => { handleRemoveClick(event) }}>
          <h3>X</h3>
        </button>
      </div>

      <div className={showMenu ? "menu show" : "menu"}>
        <div className="cont">
          <div className="col center">
            <button className="big" disabled={disableButton} onClick={() => { handleConnectClick() }}>
              {disableButton && connected
                ? "Disconnecting..."
                : disableButton && !connected
                  ? "Connecting..."
                  : !disableButton && connected
                    ? "Disconnect"
                    : "Connect"
              }
            </button>
            <div className="row center">
              <label htmlFor="autoConnect">Auto connect</label>
              <input type="checkbox" id="autoConnect"></input>
            </div>
          </div>
          <div>
            <button className="big">Unpair</button>
          </div>
        </div>
      </div>
    </div>
  );
}
