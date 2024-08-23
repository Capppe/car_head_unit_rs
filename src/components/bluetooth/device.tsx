import React, { useState } from "react";
import { BluetoothDevice } from "../../screens/bluetooth";
import { getBtDevImgUrl } from "../../utils/image_utils";
import { connectToDevice, disconnectFromDevice } from "../../utils/bluetooth";
import { useGlobalState } from "../globalstatecontext";
import { NormalNotif } from "../notification_templates/normal_notif";

export const BluetoothDeviceComp: React.FC<BluetoothDevice> = ({ name, address: address, icon }) => {

  const [shouldShowInfo, setShouldShowInfo] = useState(false);
  const [connStatus, setConnStatus] = useState<boolean>(false);
  const [disableButton, setDisableButton] = useState<boolean>(false);

  const { state } = useGlobalState();

  const handleConnectClick = async () => {
    setDisableButton(true);
    const status = connStatus ? await disconnectFromDevice(address) : await connectToDevice(address);

    if (status && status === "connected") {
      setConnStatus(true);
      if (state && state.showNotif) {
        state.showNotif(<NormalNotif imgSrc={getBtDevImgUrl(icon)} header="Connected" content={name + " connected successfully"} />, 3000);
      }
    }
    setDisableButton(false);
  }

  return (
    <div className="bluetooth_device">
      <div className="bt_dev_mini" onClick={() => setShouldShowInfo(!shouldShowInfo)}>
        <div style={{ display: 'flex', flexDirection: "row" }}>
          <img src={getBtDevImgUrl(icon)} alt={icon} />
          <div>
            <h3>{name || "Name unknown"}</h3>
            <h4>{address || "Mac unknown"}</h4>
          </div>
        </div>
        <button className="bt_dev_button">
          <h3>X</h3>
        </button>
      </div>

      <div className={shouldShowInfo ? "bt_dev_maxi" : "bt_dev_maxi hide"}>
        <div className="row expand">
          <div className="col">
            <button className="big" disabled={disableButton} onClick={() => { handleConnectClick() }}>
              {disableButton && connStatus
                ? "Disconnecting..."
                : disableButton && !connStatus
                  ? "Connecting..."
                  : !disableButton && connStatus
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
