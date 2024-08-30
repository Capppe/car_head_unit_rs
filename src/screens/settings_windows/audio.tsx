import { useEffect, useState } from "react";
import { SettingsRow, SettingsRowType } from "../../components/settings/row";
import { SettingsRowLabel } from "../../components/settings/rowlabel";
import { CustomDropdownOption } from "../../utils/constants";
import { invoke } from "@tauri-apps/api/tauri";

export const AudioSettings = () => {
  const [audioDevices, setAudioDevices] = useState<CustomDropdownOption[]>([])

  useEffect(() => {
    const getHardware = async () => {
      const devices = await invoke<CustomDropdownOption[]>('get_hardware', {
        name: 'audio-devices',
      });

    }
    setAudioDevices([
      { label: 'alsa', value: 0 },
      { label: 'pulse', value: 1 }
    ]);
    getHardware();
  }, []);

  return (
    <div className="col center self-start" style={{ width: '90%' }}>
      <SettingsRowLabel title="Audio settings" />
      <SettingsRow
        inputType={SettingsRowType.DropDown}
        setting="audio-device"
        ddOptions={audioDevices}
        title="Audio device"
        onInput={(o: number) => console.log(o)}
      />
    </div>
  );
}
