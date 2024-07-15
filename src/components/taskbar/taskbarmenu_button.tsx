import React from "react";

interface TaskbarMenuButtonProps {
  src: string;
  text?: string;
  onClick: Function;
}

export const TaskbarMenuButton: React.FC<TaskbarMenuButtonProps> = ({ src, text, onClick }) => {
  return (
    <div className="taskbarmenu_button_div" onClick={() => onClick()}>
      <img src={src} alt="" />
      <h4 style={{ display: text ? "block" : "none" }}>{text}</h4>
    </div>
  );
}
