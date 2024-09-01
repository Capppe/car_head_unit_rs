import { invoke } from "@tauri-apps/api/tauri";
import { SettingsRow, SettingsRowType } from "../../components/settings/row";
import { SettingsRowLabel } from "../../components/settings/rowlabel";
import { saveSetting } from "../../utils/settings_utils";
import { useGlobalState } from "../../components/globalstatecontext";

export const ConnectivitySettings = () => {
  const { state, setState } = useGlobalState();

  const showConfigRadio = () => {
    console.log("Showing radio config");
  }

  const handleBtSwitch = (b: boolean) => {
    saveSetting('bluetooth-on', b ? 'true' : 'false')

    invoke(b ? 'turn_on_bt' : 'turn_off_bt').then(() => {
      setState(prevState => ({
        ...prevState,
        btPowered: b,
      }));
    }).catch(e => {
      console.error("Show in error modal: ", e);
    });
  }

  const handleWifiSwitch = (b: boolean) => {
    saveSetting('wifi-on', b ? 'true' : 'false');

    invoke(b ? 'turn_on_wifi' : 'turn_off_wifi').then(() => {
      setState(prevState => ({
        ...prevState,
        networkPowered: b,
      }));
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
