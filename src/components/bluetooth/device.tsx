import React, { useState } from "react";
import { BluetoothDevice } from "../../screens/bluetooth";
import { getBtDevImgUrl } from "../../utils/utils";

export const BluetoothDeviceComp: React.FC<BluetoothDevice> = ({ name, mac, icon, paired, connected }) => {

  const [shouldShowInfo, setShouldShowInfo] = useState(false);

  return (
    <div className="bluetooth_device">
      <div className="bt_dev_mini" onClick={() => setShouldShowInfo(!shouldShowInfo)}>
        <div style={{ display: 'flex', flexDirection: "row" }}>
          <img src={getBtDevImgUrl(icon)} alt={icon} />
          <div>
            <h3>{name}</h3>
            <h4>{mac}hej</h4>
          </div>
        </div>
        <button className="bt_dev_button">
          <h3>X</h3>
        </button>
      </div>

      <div className={shouldShowInfo ? "bt_dev_maxi" : "bt_dev_maxi hide"}>
        hej
      </div>
    </div>
  );
}
