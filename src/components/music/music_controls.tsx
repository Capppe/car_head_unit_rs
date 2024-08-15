import { invoke } from "@tauri-apps/api/tauri";
import { getMusicImgUrl } from "../../utils/utils"
import React from "react";

interface MusicControlProps {
  isPlaying: boolean,
}

export const MusicControls: React.FC<MusicControlProps> = ({ isPlaying }) => {

  const playPause = async () => {
    await invoke('play_pause');
  }

  const nextSong = async () => {
    await invoke('next_song');
  }

  const prevSong = async () => {
    await invoke('prev_song');
  }

  return (
    <div className="row music-control">
      <div>
        <button type="button" className="music-control-btn">
          <img src={getMusicImgUrl('shuffle')} />
        </button>
      </div>
      <div>
        <button type="button" className="music-control-btn" onClick={prevSong}>
          <img src={getMusicImgUrl('backward')} />
        </button>
      </div>
      <div>
        <button type="button" className="music-control-btn" onClick={playPause}>
          <img src={getMusicImgUrl(isPlaying ? 'pause' : 'play')} />
        </button>
      </div>
      <div>
        <button type="button" className="music-control-btn" onClick={nextSong}>
          <img src={getMusicImgUrl('backward')} className="img_flip" />
        </button>
      </div>
    </div>
  )
}
