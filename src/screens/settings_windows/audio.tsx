import { useEffect, useState } from "react";
import { SettingsRow, SettingsRowType } from "../../components/settings/row";
import { SettingsRowLabel } from "../../components/settings/rowlabel";
import { AudioSinks, CustomDropdownOption } from "../../utils/constants";
import { invoke } from "@tauri-apps/api/tauri";

export const AudioSettings = () => {
  const [audioDevices, setAudioDevices] = useState<CustomDropdownOption[]>([])

  useEffect(() => {
    const getHardware = async () => {
      const devices = await invoke<AudioSinks[]>('find_sinks');

      setAudioDevices([]);
      for (let device of devices) {
        setAudioDevices(prev =>
          [...prev, { label: device.description || device.name, value: device.index }]);
      }
    }
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
