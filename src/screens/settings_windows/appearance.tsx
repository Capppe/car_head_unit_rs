import { useColorState } from "../../components/globalstatecontext";
import { SettingsRow, SettingsRowType } from "../../components/settings/row";
import { SettingsRowLabel } from "../../components/settings/rowlabel";
import { saveSetting } from "../../utils/settings_utils";

export const AppearanceSettings = () => {
  const { colorState, setColorState } = useColorState();

  const setColor = (color: string, where: string) => {
    saveSetting(where, color);

    const newState = {
      ...colorState,
      colors: {
        background: where === 'background-color' ? color : colorState.colors.background,
        text: where === 'text-color' ? color : colorState.colors.text,
        topBar: where === 'top-bar-color' ? color : colorState.colors.topBar,
        bottomBar: where === 'bottom-bar-color' ? color : colorState.colors.bottomBar,
        icon: where === 'icon-color' ? color : colorState.colors.icon,
      }
    }
    setColorState(newState);
  }
  return (
    <div className="col center self-start" style={{ width: '90%' }}>
      <SettingsRowLabel title="Appearance" />
      <SettingsRow
        inputType={SettingsRowType.ColorInput}
        title="Background color"
        settingName="background-color"
        getCurrentValue={() => { }}
        onInput={(o: string) => setColor(o, 'background-color')}
      />
      <SettingsRow
        inputType={SettingsRowType.ColorInput}
        title="Text color"
        settingName="text-color"
        getCurrentValue={() => { }}
        onInput={(o: string) => setColor(o, 'text-color')}
      />
      <SettingsRow
        inputType={SettingsRowType.ColorInput}
        title="Top bar color"
        settingName="top-bar-color"
        getCurrentValue={() => { }}
        onInput={(o: string) => setColor(o, 'top-bar-color')}
      />
      <SettingsRow
        inputType={SettingsRowType.ColorInput}
        title="Bottom bar color"
        settingName="bottom-bar-color"
        getCurrentValue={() => { }}
        onInput={(o: string) => setColor(o, 'bottom-bar-color')}
      />
      <SettingsRow
        inputType={SettingsRowType.ColorInput}
        title="Icon color"
        settingName="icon-color"
        getCurrentValue={() => { }}
        onInput={(o: string) => setColor(o, 'icon-color')}
      />
    </div>
  );
}
