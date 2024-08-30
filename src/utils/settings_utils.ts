import { invoke } from "@tauri-apps/api/tauri";
import { Setting } from "./constants";

const getSetting = async (name: string, type: any): Promise<Setting> => {
  const setting = await invoke<typeof type>('get_setting', {
    name,
  });

  return setting;
}

export const getBooleanSetting = async (name: string): Promise<boolean> => {
  const setting = await getSetting(name, typeof "boolean");

  return setting.value === "true";
}

export const getNumberSetting = async (name: string): Promise<number> => {
  const setting = await getSetting(name, typeof 1);
  return parseInt(setting.value.toString(), 10);
}

export const getTextSetting = async (name: string): Promise<string> => {
  const setting = await getSetting(name, typeof "");

  return setting.value.toString();
}

export const checkForUpdates = async () => {
  await invoke('check_for_updates');
}
