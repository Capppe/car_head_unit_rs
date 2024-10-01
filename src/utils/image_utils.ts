import { getBluetoothStatus } from "./bluetooth";
import { getNetworkStatus } from "./network";

const iconPath = "icons/";
const taskbarIconPath = `${iconPath}taskbar/`;
const btDevIconPath = `${iconPath}bt/`;
const dockbarIconPath = `${iconPath}dockbar/`;
const musicIconPath = `${iconPath}music/`;
const mainPath = `${iconPath}main/`;
const arduinoPath = `${iconPath}arduino/`;
const radioPath = `${iconPath}radio/`;
const settingsPath = `${iconPath}settings/`;

export const getDockImg = (icon: string) => {
  return `${dockbarIconPath}${icon}.svg`;
}

export const getTaskBarImg = (icon: string) => {
  return `${taskbarIconPath}${icon}.svg`;
}

export const getBtImgUrl = async () => {
  let status = await getBluetoothStatus();
  let svgName = "";

  if (status.connectedDevices && status.connectedDevices > 0) { svgName = "bluetooth-on.svg" }
  else if (status.discovering) { svgName = "bluetooth-searching.svg" }
  else if (status.powered) { svgName = "bluetooth-on.svg" }
  else { svgName = "bluetooth-off.svg" }

  return taskbarIconPath.concat(svgName);
}

export const getNetImgUrl = async () => {
  const status = await getNetworkStatus();

  return taskbarIconPath.concat(status.connected ? "wifi-on.svg" : "wifi-off.svg");
}

export const getBtDevImgUrl = (icon: string) => {
  if (icon === null || icon === 'null' || icon === "") { return `${btDevIconPath}unknown.svg`; }
  return `${btDevIconPath}${icon}.svg`;
}

export const getMusicImgUrl = (icon: string) => {
  if (icon === null || icon === 'null') { return "" }
  return `${musicIconPath}${icon}.svg`;
}

export const getMainImgUrl = (icon: string) => {
  if (icon === null || icon === 'null') { return "" }
  return `${mainPath}${icon}.svg`;
}

export const getArduinoImgUrl = (icon: string) => {
  if (icon === null || icon === 'null') { return "" }
  return `${arduinoPath}${icon}.svg`;
}

export const getRadioImgUrl = (icon: string) => {
  if (icon === null || icon === 'null') { return "" }
  return `${radioPath}${icon}.svg`;
}

export const getSettingImgUrl = (icon: string) => {
  if (icon === null || icon === 'null') { return "" }
  return `${settingsPath}${icon}.svg`;
}
