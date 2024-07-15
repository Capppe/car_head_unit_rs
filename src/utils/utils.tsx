import { GlobalState } from "../components/globalstatecontext";

const iconPath = "./src/assets/icons/";
const taskbarIconPath = `${iconPath}taskbar/`;
const btDevIconPath = `${iconPath}bt/`;
const dockbarIconPath = `${iconPath}dockbar/`;

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
  return `${btDevIconPath}${icon}.svg`;
}

export const getDockImg = (icon: string) => {
  return `${dockbarIconPath}${icon}`;
}
