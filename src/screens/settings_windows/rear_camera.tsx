import { SettingsRow, SettingsRowType } from "../../components/settings/row";
import { SettingsRowLabel } from "../../components/settings/rowlabel";

export const RearCameraSettings = () => {
  const viewRearCamera = () => {
    console.log("Viewing rear camera");
  }

  const toggleRearCamera = (value: boolean) => {
    console.log("Rear camera on: ", value);
  }

  const toggleGuideLines = (value: boolean) => {
    console.log("Guidelines on: ", value);
  }

  const showConfigGuideLine = () => {
    console.log("Showing config");
  }

  return (
    <div className="col center self-start" style={{ width: '90%' }}>
      <SettingsRowLabel title="Rear camera" />
      <SettingsRow
        inputType={SettingsRowType.Button}
        setting=""
        title="View rear camera"
        btnLabel="View"
        onInput={() => viewRearCamera()}
      />
      <SettingsRow
        inputType={SettingsRowType.Switch}
        setting="rear-camera-enable"
        title="Enable rear camera"
        onInput={(b: boolean) => toggleRearCamera(b)}
      />
      <SettingsRow
        inputType={SettingsRowType.Switch}
        setting="rear-camera-show-lines"
        title="Guide-lines"
        label="Show guiding lines when reversing"
        onInput={(b: boolean) => toggleGuideLines(b)}
      />
      <SettingsRow
        inputType={SettingsRowType.Button}
        setting="rear-camera-lines-setup"
        title="Configure lines"
        label="Configure guide-lines"
        btnLabel="Configure"
        onInput={() => showConfigGuideLine()}
      />
    </div>
  );
}
