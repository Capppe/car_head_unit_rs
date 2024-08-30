import { SettingsRow, SettingsRowType } from "../../components/settings/row";
import { SettingsRowLabel } from "../../components/settings/rowlabel";
import { Languages } from "../../utils/constants";

export const SystemSettings = () => {
  return (
    <div className="col center self-start" style={{ width: '90%' }}>
      <SettingsRowLabel title="System" />
      <SettingsRow
        inputType={SettingsRowType.DropDown}
        setting="language"
        ddOptions={Languages}
        title="Language"
        label="Not fully supported yet"
        onInput={(o: number) => { console.log(o) }}
      />
    </div>
  );
}
