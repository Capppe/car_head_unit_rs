import { GlobalState } from "../components/globalstatecontext";

const iconPath = "./src/assets/icons/";
const taskbarIconPath = `${iconPath}taskbar/`;
const btDevIconPath = `${iconPath}bt/`;
const dockbarIconPath = `${iconPath}dockbar/`;
const musicIconPath = `${iconPath}music/`;
const mainPath = `${iconPath}main/`;
const arduinoPath = `${iconPath}arduino/`;


export const getDockImg = (icon: string) => {
  return `${dockbarIconPath}${icon}`;
}

export const getBtImgUrl = (state: GlobalState) => {
  let svgName = "";

  if (state.btConnected) { svgName = "bluetooth-on.svg" }
  else if (state.btDiscovering) { svgName = "bluetooth-searching.svg" }
  else if (state.btPowered) { svgName = "bluetooth-on.svg" }
  else { svgName = "bluetooth-off.svg" }

  return taskbarIconPath.concat(svgName);
}

export const getNetImgUrl = (state: GlobalState) => {
  let svgName = "";

  if (state.networkConnected) { svgName = "wifi-on.svg" }
  else { svgName = "wifi-off.svg" }

  return taskbarIconPath.concat(svgName);
}

export const getBtDevImgUrl = (icon: string) => {
  if (icon === null || icon === 'null') { return `${btDevIconPath}unknown.svg`; }
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

export const removeQuotes = (str: string) => {
  return str.replace(/(^"|"$|^'|'$)/g, '');
}

export const secToMinSec = (sec: number) => {
  const m = Math.floor(sec / 60);
  const s = (sec - m * 60);
  const secs = s < 9 ? '0' + s.toFixed(0) : s.toFixed(0);
  return `${m.toFixed(0)}:${secs}`;
}
