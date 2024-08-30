import React from "react";

interface ButtonProps {
  title: string;
  onClick: Function;
}

export const SettingsButton: React.FC<ButtonProps> = ({ title, onClick }) => {
  return (
    <div>
      <button type="button" className="button big" onClick={() => onClick()}>
        <label className="text24">
          {title}
        </label>
      </button>
    </div>
  );
}
