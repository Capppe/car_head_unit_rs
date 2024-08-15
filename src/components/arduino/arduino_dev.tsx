import React from "react";
import { Port } from "../../screens/arduino_mgr";
import { getArduinoImgUrl } from "../../utils/utils";
import "../../styles/Arduino.css";

interface ArduinoDeviceProps {
  name: string;
  fqbn: string;
  port: Port;
  onClick: Function;
}

export const ArduinoDevice: React.FC<ArduinoDeviceProps> = ({ name, fqbn, port, onClick }) => {
  return (
    <div className="row s-b arduino border" onClick={() => onClick()}>
      <div className="row">
        <img src={getArduinoImgUrl('board')} />
        <div>
          <div>{name}</div>
          <div>{fqbn}</div>
        </div>
      </div>
      <div className="row center">{port.label || "jfdjfkdjfkdjeje"}</div>
    </div>
  );
}
