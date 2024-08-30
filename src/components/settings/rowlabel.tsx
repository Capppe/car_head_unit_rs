import React from "react";
import "../../styles/Settings.css";

interface RowLabelProps {
  title: string;
}

export const SettingsRowLabel: React.FC<RowLabelProps> = ({ title }) => {
  return (

    <div className="row center" style={{ width: '80%', paddingTop: '50px', paddingBottom: '10px' }}>
      <div className="settings-divider"></div>
      <label className="text28" style={{ whiteSpace: 'nowrap' }}>{title}</label>
      <div className="settings-divider"></div>
    </div>
  );
}
