import { invoke } from "@tauri-apps/api/tauri";
import { SettingsRow, SettingsRowType } from "../../components/settings/row";
import { SettingsRowLabel } from "../../components/settings/rowlabel";
import { saveSetting } from "../../utils/settings_utils";

export const ConnectivitySettings = () => {
  const showConfigRadio = () => {
    console.log("Showing radio config");
  }

  const handleBtSwitch = (b: boolean) => {
    saveSetting('bluetooth-on', b ? 'true' : 'false')

    invoke(b ? 'turn_on_bt' : 'turn_off_bt').then(() => {
    }).catch(e => {
      console.error("Show in error modal: ", e);
    });
  }

  const handleWifiSwitch = (b: boolean) => {
    saveSetting('wifi-on', b ? 'true' : 'false');

    invoke(b ? 'turn_on_wifi' : 'turn_off_wifi').then(() => {
    }).catch(e => {
      console.error("Show in error modal: ", e);
    });;
  }

  return (
    <div className="col center self-start" style={{ width: '90%' }}>
      <SettingsRowLabel title="Connectivity" />
      <SettingsRow
        inputType={SettingsRowType.Switch}
        settingName="bluetooth-on"
        getCurrentValue={() => { }}
        title="Bluetooth"
        label="Enable/disable bluetooth"
        onInput={(b: boolean) => handleBtSwitch(b)}
      />
      <SettingsRow
        inputType={SettingsRowType.Switch}
        settingName="wifi-on"
        getCurrentValue={() => { }}
        title="Wifi"
        label="Enable/disable wifi"
        onInput={(b: boolean) => handleWifiSwitch(b)}
      />
      <SettingsRow
        inputType={SettingsRowType.Button}
        settingName="config-radio"
        getCurrentValue={() => { }}
        title="Radio"
        btnLabel="Configure"
        label="Configure radio"
        onInput={() => showConfigRadio()}
      />
    </div>
  );
}
