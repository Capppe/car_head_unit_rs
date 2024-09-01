import { SettingsRow, SettingsRowType } from "../../components/settings/row";
import { SettingsRowLabel } from "../../components/settings/rowlabel";
import { getSetting, saveSetting } from "../../utils/settings_utils";

export const RearCameraSettings = () => {
  const viewRearCamera = () => {
    console.log("Viewing rear camera");
  }

  const showConfigGuideLine = () => {
    console.log("Showing config");
  }

  return (
    <div className="col center self-start" style={{ width: '90%' }}>
      <SettingsRowLabel title="Rear camera" />
      <SettingsRow
        inputType={SettingsRowType.Button}
        settingName=""
        getCurrentValue={() => { }}
        title="View rear camera"
        btnLabel="View"
        onInput={() => viewRearCamera()}
      />
      <SettingsRow
        inputType={SettingsRowType.Switch}
        settingName='rear-camera-enable'
        getCurrentValue={() => getSetting('rear-camera-enable')}
        title="Enable rear camera"
        onInput={(b: boolean) => saveSetting('rear-camera-enable', b ? 'true' : 'false')}
      />
      <SettingsRow
        inputType={SettingsRowType.Switch}
        settingName="rear-camera-show-lines"
        getCurrentValue={() => getSetting('rear-camera-show-lines')}
        title="Guide-lines"
        label="Show guiding lines when reversing"
        onInput={(b: boolean) => saveSetting('rear-camera-show-lines', b ? 'true' : 'false')}
      />
      <SettingsRow
        inputType={SettingsRowType.Button}
        settingName=""
        getCurrentValue={() => { }}
        title="Configure lines"
        label="Configure guide-lines"
        btnLabel="Configure"
        onInput={() => showConfigGuideLine()}
      />
    </div>
  );
}
