import { DropDown } from "./dropdown";
import { getBtImgUrl, getDockImg, getNetImgUrl, getTaskBarImg } from "../../utils/image_utils";
import { useEffect, useRef, useState } from "react";
import { getFormattedTime } from "../../utils/utils";
import { listen, UnlistenFn } from "@tauri-apps/api/event";

type Payload = {
  message: string;
}

export const Taskbar: React.FC = () => {
  const noOfMissedNotifs = 0;

  const [currTime, setCurrTime] = useState("");
  const [btImage, setBtImage] = useState("");
  const [netImage, setNetImage] = useState("");

  const unlistenBt = useRef<UnlistenFn>();

  const setTime = () => {
    setCurrTime(getFormattedTime());
  }

  const setBtImg = async () => {
    setBtImage(await getBtImgUrl());
  }

  const setNetImg = async () => {
    setNetImage(await getNetImgUrl());
  }

  const startEventListeners = async () => {
    if (!unlistenBt.current) {
      unlistenBt.current = await listen<Payload>("bt-discovering", () => {
        setBtImg();
      })
    }
  }

  useEffect(() => {
    setTime();
    setBtImg();
    setNetImg();

    const interval = setInterval(setTime, 1000);

    startEventListeners();

    return () => {
      clearInterval(interval);
      if (unlistenBt.current) unlistenBt.current();
    }
  }, []);

  return (
    <DropDown>
      <div className="taskbar_group" id="taskbar_left">
        <div className="text_orange text_bold text22" id="taskbar_location">
          Home
        </div>
      </div>

      <img style={{ width: "100%", height: "inherit", objectFit: "fill", zIndex: "1", position: "absolute", left: "0%", right: "0%" }} src={getTaskBarImg('bg')} />

      <div className="taskbar_group" id="taskbar_right">
        <div className="taskbar_statuses">
          {noOfMissedNotifs !== 0 &&
            <div className="taskbar_img">
              <img src={getDockImg('notif')} />
            </div>
          }
          <div className="taskbar_img">
            <img src={btImage}
            />
          </div>
          <div className="taskbar_img">
            <img src={netImage} />
          </div>
        </div>
        <div className="text_orange text_bold text24" id="clock">
          {currTime}
        </div>
      </div>
    </DropDown>
  );
}
