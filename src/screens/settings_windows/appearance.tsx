import { SettingsRow, SettingsRowType } from "../../components/settings/row";
import { SettingsRowLabel } from "../../components/settings/rowlabel";

export const AppearanceSettings = () => {
  const setColor = (color: string, where: string) => {
    console.log("Setting color: ", color, "for: ", where);
  }
  return (
    <div className="col center self-start" style={{ width: '90%' }}>
      <SettingsRowLabel title="Appearance" />
      <SettingsRow
        inputType={SettingsRowType.ColorInput}
        title="Background color"
        setting="background-color"
        onInput={(o: string) => setColor(o, 'background')}
      />
      <SettingsRow
        inputType={SettingsRowType.ColorInput}
        title="Text color"
        setting="text-color"
        onInput={(o: string) => setColor(o, 'text')}
      />
      <SettingsRow
        inputType={SettingsRowType.ColorInput}
        title="Top bar color"
        setting="top-bar-color"
        onInput={(o: string) => setColor(o, 'topBar')}
      />
      <SettingsRow
        inputType={SettingsRowType.ColorInput}
        title="Bottom bar color"
        setting="bottom-bar-color"
        onInput={(o: string) => setColor(o, 'bottomBar')}
      />
      <SettingsRow
        inputType={SettingsRowType.ColorInput}
        title="Icon color"
        setting="icon-color"
        onInput={(o: string) => setColor(o, 'icon')}
      />
    </div>
  );
}
