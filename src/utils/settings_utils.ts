import { Store } from "tauri-plugin-store-api";
import { appDataDir } from "@tauri-apps/api/path";

const store = new Store(await appDataDir() + 'settings/settings.json');

export const getSetting = async (name: string) => {
  console.log("Getting setting: ", name);
  return store.get<{ value: string }>(name);
}

export const saveSetting = async (name: string, value: string) => {
  console.log("Saving setting: ", name, value);
  await store.set(name, { value });
  await store.save();
}

export const getColorSettings = async () => {
  const background = await getSetting('background-color');
  const text = await getSetting('text-color');
  const topBar = await getSetting('top-bar-color');
  const bottomBar = await getSetting('bottom-bar-color');
  const icon = await getSetting('icon-color');

  return {
    background: background?.value || "#2f2f2f",
    text: text?.value || "#f6f6f6",
    topBar: topBar?.value || "black",
    bottomBar: bottomBar?.value || "black",
    icon: icon?.value || "#ffffff",
  };
}
