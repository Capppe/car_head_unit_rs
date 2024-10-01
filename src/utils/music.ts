import { invoke } from "@tauri-apps/api/tauri";

export interface MusicPlayerStatus {
  is_playing: boolean;
  title: string;
  artist: string;
  album: string;
  album_url: string;
  length: number;
}

export const getMusicStatus = async (): Promise<MusicPlayerStatus> => {
  const status = await invoke<MusicPlayerStatus>("get_music_status");
  return status;
}
