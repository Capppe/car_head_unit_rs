import { SettingsRow, SettingsRowType } from "../../components/settings/row";
import { SettingsRowLabel } from "../../components/settings/rowlabel";
import { Languages } from "../../utils/constants";
import { getSetting, saveSetting } from "../../utils/settings_utils";

export const SystemSettings = () => {
  const getCurrentLang = async () => {
    const current = await getSetting('language');

    return Languages[parseInt(current ? current.value : '-1', 10)].label
  }
  return (
    <div className="col center self-start" style={{ width: '90%' }}>
      <SettingsRowLabel title="System" />
      <SettingsRow
        inputType={SettingsRowType.DropDown}
        settingName="language"
        getCurrentValue={() => getCurrentLang()}
        ddOptions={Languages}
        title="Language"
        label="Not fully supported yet"
        onInput={(o: number) => { console.log("Saving language"); saveSetting('language', o.toString()) }}
      />
    </div>
  );
}
