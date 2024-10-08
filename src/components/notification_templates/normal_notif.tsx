import React from "react";

interface NormalNotifProps {
  imgSrc: string;
  header: string;
  content: string;
}

export const NormalNotif: React.FC<NormalNotifProps> = ({ imgSrc, header, content }) => {
  return (
    <div className="" id="notification_container" >
      <div id="notification_icon">
        <img src={imgSrc} alt="notification image" id="notif_image" />
      </div>

      <div id="notification_text_container">
        <div id="notification_header">
          <h3 className="notif_text" id="notif_header">{header}</h3>
        </div>
        <div id="notification_text">
          <h5 className="notif_text" id="notif_content">{content}</h5>
        </div>
      </div>

      <div id="notification_actions_container">
        <button type="button" className="button" id="action_button_1">
          Action 1
        </button>
        <button type="button" className="button" id="action_button_2">
          Action 2
        </button>
      </div>
    </div >
  );
}
