import { useEffect, useRef, useState } from "react";
import { getNetworkStatus } from "../../utils/network";

export const Taskbar = () => {
  const imgPath = "./src/assets/icons/taskbar/";

  const [currentTime, setCurrentTime] = useState<string>(`${new Date().getHours()}:${new Date().getMinutes()}`);
  const [networkStatus, setNetworkStatus] = useState<string>("off");
  const [bluetoothStatus, setBluetoothStatus] = useState<string>("off");
  const [missedNotifs, setMissedNotifs] = useState<boolean>(false);
  const timer = useRef<number>();

  useEffect(() => {
    const updateStatus = () => {
      const date = new Date();
      setCurrentTime(`${date.getHours()}:${date.getMinutes()}`);
      getNetworkStatus().then((status) => {
        setNetworkStatus(status);
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



  return (
    <div className="taskbar" id="taskbar">
      <div className="taskbar_group" id="taskbar_left">
        <div className="text_orange text_bold text22" id="taskbar_location">
          Home
        </div>
      </div>

      <div className="taskbar_group" id="taskbar_right">
        <div className="taskbar_statuses">
          {missedNotifs &&
            <div className="taskbar_img">
              <img src={`${imgPath}notif.svg`} />
            </div>
          }
          <div className="taskbar_img">
            <img src={`${imgPath}${bluetoothStatus == "on" ? "bluetooth-on.svg" : bluetoothStatus == "off" ? "bluetooth-off.svg" : "bluetooth-searching.svg"}`} />
          </div>
          <div className="taskbar_img">
            <img src={`${imgPath}${networkStatus == "connected" ? "wifi-on.svg" : "wifi-off.svg"}`} />
          </div>
        </div>
        <div className="text_orange text_bold text24" id="clock">
          {currentTime}
        </div>
      </div>
    </div>
  );
}
