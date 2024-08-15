import { listen } from "@tauri-apps/api/event";
import { invoke } from "@tauri-apps/api/tauri";

export interface MusicPlayerStatus {
  is_playing: boolean;
  title: string;
  artist: string;
  album: string;
  album_url: string;
  length: number;
}

type Payload = {
  message: string;
}

export const startMusicEventListener = async () => {
  await listen<Payload>("music-status-changed", (event) => {
    const json: MusicPlayerStatus = JSON.parse(event.payload.message);
    return json;
  });
}

export const getMusicStatus = async (): Promise<MusicPlayerStatus> => {
  const status = await invoke<MusicPlayerStatus>("get_music_status");
  return status;
}
