import React from "react";
import "../../styles/Notification.css";

type Action = {
  text: string;
  action: Function;
}

interface NormalNotifProps {
  imgSrc: string;
  header: string;
  content: string;
  action1?: Action;
  action2?: Action;
}

export const NormalNotif: React.FC<NormalNotifProps> = ({ imgSrc, header, content, action1, action2 }) => {
  return (
    <div className="row center notification">
      <div className="notification-icon">
        <img src={imgSrc} alt={imgSrc} />
      </div>

      <div className="col center text-container">
        <div>
          <h2>{header}</h2>
        </div>
        <div>
          <h4>{content}</h4>
        </div>
      </div>

      <div id="notification_actions_container">
        {action1 &&
          <button type="button" className="button" id="action_button_1" onClick={() => action1.action()}>
            {action1.text}
          </button>
        }
        {action2 &&
          <button type="button" className="button" id="action_button_2" onClick={() => action2.action()}>
            {action2.text}
          </button>
        }
      </div>
    </div >
  );
}
