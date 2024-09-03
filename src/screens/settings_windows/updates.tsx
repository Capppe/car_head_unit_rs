import { invoke } from "@tauri-apps/api/tauri";
import { SettingsRow, SettingsRowType } from "../../components/settings/row";
import { SettingsRowLabel } from "../../components/settings/rowlabel";
import { useState } from "react";

//TODO check if actually working
export const UpdateSettings = () => {
  const [status, setStatus] = useState<string>("");

  const checkUpdates = () => {
    console.log("Checking for updates");
    setStatus("Checking...");
    invoke('check_for_update', {
      currVersion: '0.0.0',
    }).then(r => {
      if (!r) {
        setStatus("Latest version!");
      } else {
        setStatus("Update available, press download to begin download");
      }
    });
  }

  return (
    <div className="col center self-start" style={{ width: '90%' }}>
      <SettingsRowLabel title="Updates" />
      <SettingsRow
        inputType={SettingsRowType.Button}
        settingName="updates"
        getCurrentValue={() => { }}
        title="Check for updates"
        btnLabel="Check"
        onInput={() => { checkUpdates(); }}
      />
      <div>{status != "" ? status : ""}</div>
    </div>
  );
}
