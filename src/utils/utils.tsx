import { invoke } from "@tauri-apps/api/tauri";

export const removeQuotes = (str: string) => {
  try {
    return str.replace(/(^"|"$|^'|'$)/g, '');
  } catch {
    return str;
  }
}

export const microSecToMinSec = (mSec: number) => {
  const totalSecs = Math.floor(mSec / 1_000_000);

  const mins = Math.floor(totalSecs / 60);
  const secs = totalSecs % 60;

  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

export const microSecToSec = (mSec: number) => {
  return (mSec / 1_000_000).toFixed(0);
}

export const getFormattedTime = () => {
  const date = new Date();
  const hours = date.getHours();
  let minutes = date.getMinutes();

  if (minutes <= 9) {
    return `${hours.toString()}:0${minutes.toString()}`;
  } else {
    return `${hours.toString()}:${minutes.toString()}`;
  }
}

export const getSettings = async (file: string) => {
  const settingsFile = await invoke('get-settings', { file });
  return settingsFile;
}
