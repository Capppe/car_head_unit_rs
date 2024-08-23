import { useGlobalState } from "../components/globalstatecontext";
import { AlbumLogo } from "../components/music/album_logo";
import { MusicControls } from "../components/music/music_controls";
import { SongInfo } from "../components/music/song_info";
import '../styles/MusicInfo.css';

export const MusicWindow = () => {
  const { state } = useGlobalState();

  return (
    <div className="song-container">
      <div className="row center" style={{ marginRight: '150px' }}>
        <AlbumLogo url={state.musicStatus.album_url} />
        <SongInfo
          title={state.musicStatus.title}
          artist={state.musicStatus.artist}
          album={state.musicStatus.album}
          length={state.musicStatus.length}
        />
      </div>
      <MusicControls isPlaying={state.musicStatus.is_playing} />
    </div>
  );
}
