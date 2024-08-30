import { invoke } from "@tauri-apps/api/tauri";

const getSetting = async (name: string, type: any) => {
  const setting = await invoke<typeof type>('get_setting', {
    setting: name,
  });

  return setting;
}

export const getBooleanSetting = async (name: string) => {
  return getSetting(name, typeof true);
}

export const getNumberSetting = async (name: string) => {
  return getSetting(name, typeof 1);
}

export const getTextSetting = async (name: string) => {
  return getSetting(name, typeof "");
}

export const checkForUpdates = async () => {
  await invoke('check_for_updates');
}
