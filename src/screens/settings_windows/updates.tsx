import { SettingsRow, SettingsRowType } from "../../components/settings/row";
import { SettingsRowLabel } from "../../components/settings/rowlabel";
import { checkForUpdates } from "../../utils/settings_utils";

export const UpdateSettings = () => {
  const checkUpdates = () => {
    console.log("Checking for updates");
    checkForUpdates();
  }

  return (
    <div className="col center self-start" style={{ width: '90%' }}>
      <SettingsRowLabel title="Updates" />
      <SettingsRow
        inputType={SettingsRowType.Button}
        setting="updates"
        title="Check for updates"
        btnLabel="Check"
        onInput={() => { checkUpdates(); }}
      />
    </div>
  );
}
