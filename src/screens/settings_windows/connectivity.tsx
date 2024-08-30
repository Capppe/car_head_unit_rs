import { SettingsRow, SettingsRowType } from "../../components/settings/row";
import { SettingsRowLabel } from "../../components/settings/rowlabel";

export const ConnectivitySettings = () => {
  const toggleBluetooth = (on: boolean) => {
    console.log("Toggling bluetooth: ", on);
  }

  const toggleWifi = (on: boolean) => {
    console.log("Toggling wifi: ", on);
  }

  const showConfigRadio = () => {
    console.log("Showing radio config");
  }

  return (
    <div className="col center self-start" style={{ width: '90%' }}>
      <SettingsRowLabel title="Connectivity" />
      <SettingsRow
        inputType={SettingsRowType.Switch}
        setting="bluetooth_on"
        title="Bluetooth"
        label="Enable/disable bluetooth"
        onInput={(b: boolean) => toggleBluetooth(b)}
      />
      <SettingsRow
        inputType={SettingsRowType.Switch}
        setting="wifi_on"
        title="Wifi"
        label="Enable/disable wifi"
        onInput={(b: boolean) => toggleWifi(b)}
      />
      <SettingsRow
        inputType={SettingsRowType.Button}
        setting="config_radio"
        title="Radio"
        btnLabel="Configure"
        label="Configure radio"
        onInput={() => showConfigRadio()}
      />
    </div>
  );
}
