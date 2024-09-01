import { useEffect, useState } from "react";
import { SettingsRow, SettingsRowType } from "../../components/settings/row";
import { SettingsRowLabel } from "../../components/settings/rowlabel";
import { AudioSink, CustomDropdownOption } from "../../utils/constants";
import { invoke } from "@tauri-apps/api/tauri";
import { saveSetting } from "../../utils/settings_utils";

export const AudioSettings = () => {
  const [audioDevices, setAudioDevices] = useState<CustomDropdownOption[]>([]);
  const [audioSinks, setAudioSinks] = useState<AudioSink[]>([]);

  useEffect(() => {
    const getHardware = async () => {
      const devices = await invoke<AudioSink[]>('find_sinks');

      setAudioSinks(devices);
      setAudioDevices([]);
      for (let device of devices) {
        setAudioDevices(prev =>
          [...prev, { label: device.description || device.name, value: device.index }]);
      }
    }
    getHardware();
  }, []);

  const getCurrentAudioDev = async () => {
    const device = await invoke<AudioSink>('get_current_sink');
    return device.description || device.name || "None";
  }

  const handleChange = (o: number) => {
    saveSetting('audio-device', o.toString());
    invoke('set_active_sink', {
      name: audioSinks.find(a => a.index === o)?.name,
    })
  }

  return (
    <div className="col center self-start" style={{ width: '90%' }}>
      <SettingsRowLabel title="Audio settings" />
      <SettingsRow
        inputType={SettingsRowType.DropDown}
        settingName='audio-device'
        getCurrentValue={async () => await getCurrentAudioDev()}
        ddOptions={audioDevices}
        title="Audio device"
        onInput={(o: number) => handleChange(o)}
      />
    </div>
  );
}
