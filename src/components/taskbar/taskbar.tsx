import { DropDown } from "./dropdown";
import { useGlobalState } from "../globalstatecontext";
import { getBtImgUrl, getNetImgUrl } from "../../utils/utils";

export const Taskbar: React.FC = () => {
  const imgPath = "./src/assets/icons/taskbar/";

  const { state, setState } = useGlobalState();

  return (
    <DropDown>
      <div className="taskbar_group" id="taskbar_left">
        <div className="text_orange text_bold text22" id="taskbar_location">
          Home
        </div>
      </div>

      <img style={{ width: "100%", height: "inherit", objectFit: "fill", zIndex: "1", position: "absolute", left: "0%", right: "0%" }} src="./src/assets/icons/taskbar/bg.svg" />

      <div className="taskbar_group" id="taskbar_right">
        <div className="taskbar_statuses">
          {state.noOfMissedNotifs !== 0 &&
            <div className="taskbar_img">
              <img src={`${imgPath}notif.svg`} />
            </div>
          }
          <div className="taskbar_img">
            <img src={getBtImgUrl(state)}
            />
          </div>
          <div className="taskbar_img">
            <img src={getNetImgUrl(state)} />
          </div>
        </div>
        <div className="text_orange text_bold text24" id="clock">
          {state.currentTime}
        </div>
      </div>
    </DropDown>
  );
}
