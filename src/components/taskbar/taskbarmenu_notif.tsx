import React from "react";
import { Notification } from "../../utils/constants";

interface TaskbarMenuNotifProps extends Notification {
  onClick: () => void;
}

export const TaskbarMenuNotif: React.FC<TaskbarMenuNotifProps> = ({ imgSrc, header, content, onClick }) => {
  return (
    <div className="taskbarmenu_notif" onClick={() => onClick()}>
      <img src={imgSrc} alt="" />
      <div className="taskbarmenu_notif_text">
        <div>
          <h3>{header}</h3>
          <h4>{content}</h4>
        </div>
      </div>
      <div className="taskbarmenu_notif_time">
        13:37
      </div>
    </div>
  );
}
