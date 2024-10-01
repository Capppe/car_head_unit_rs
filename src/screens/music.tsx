import { useEffect, useState } from "react";
import { AlbumLogo } from "../components/music/album_logo";
import { MusicControls } from "../components/music/music_controls";
import { SongInfo } from "../components/music/song_info";
import '../styles/MusicInfo.css';
import { MusicStatus } from "../utils/constants";
import { listen } from "@tauri-apps/api/event";
import { invoke } from "@tauri-apps/api/tauri";

export const MusicWindow = () => {
  const [musicState, setMusicState] = useState<MusicStatus | undefined>(undefined);

  useEffect(() => {
    const getStatus = async () => {
      const status = await invoke<MusicStatus>("get_music_status");
      setMusicState(status);
    }

    const unlisten = listen<MusicStatus>("music-status-changed", (event) => {
      setMusicState(event.payload);
    });

    getStatus();

    return () => {
      unlisten.then((fn: Function) => fn());
    }
  }, []);

  return (
    <div className="song-container">
      {musicState && (
        <div className="col center">
          <div className="row center">
            <AlbumLogo url={musicState.album_url} />
            <SongInfo
              title={musicState.title}
              artist={musicState.artist.join(', ')}
              album={musicState.album}
              length={musicState.length}
            />
          </div>
          <MusicControls isPlaying={musicState.is_playing} />
        </div>
      )}
    </div>
  );
}
