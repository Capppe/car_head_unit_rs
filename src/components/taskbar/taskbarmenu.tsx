import React, { LegacyRef, useEffect, useState } from "react";
import { TaskbarMenuButton } from "./taskbarmenu_button";
import { Notification } from "../../utils/constants";
import { getBtImgUrl, getNetImgUrl } from "../../utils/image_utils";
import { TaskbarMenuNotif } from "./taskbarmenu_notif";

interface TaskbarMenuProps {
  ddRef: LegacyRef<HTMLDivElement> | undefined;
  modalVisible: boolean;
  notifications?: [Notification] | [];
}

export const TaskbarMenu: React.FC<TaskbarMenuProps> = ({ ddRef, modalVisible, notifications }) => {
  const [btImage, setBtImage] = useState("");
  const [netImage, setNetImage] = useState("");

  useEffect(() => {
    const getBtImage = async () => {
      setBtImage(await getBtImgUrl());
    }
    const getNetImage = async () => {
      setNetImage(await getNetImgUrl());
    }
    getBtImage();
    getNetImage();
  }, []);

  return (
    <div ref={ddRef} className={modalVisible ? "modal" : "modal hide"} id="notifModal">
      <div className="taskbarmenu_button_row">
        <TaskbarMenuButton src={btImage} onClick={() => console.log("Bt")} />
        <TaskbarMenuButton src={netImage} onClick={() => console.log("wifi")} />
      </div>
      <div className="taskbarmenu_notifs_container">
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
          <div style={{ padding: "15px" }}>
            Notifications
          </div>
          <div className="taskbarmenu_notifs_divider">
          </div>
          <div>
            <button>
              Clear all
            </button>
          </div>
        </div>
        {0 != 0 ? notifications && notifications.map((notif, index) => (
          <TaskbarMenuNotif
            key={index}
            imgSrc={notif.imgSrc}
            header={notif.header}
            content={notif.content}
            time={notif.time}
            onClick={() => console.log("Notif")}
          />
        )) : (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            No notifications
          </div>
        )}
      </div>
    </div>
  );
}
