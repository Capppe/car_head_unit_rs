import { invoke } from "@tauri-apps/api/tauri";
import { getMusicImgUrl } from "../../utils/image_utils"
import React, { useState } from "react";

interface MusicControlProps {
  isPlaying: boolean,
}

export const MusicControls: React.FC<MusicControlProps> = ({ isPlaying }) => {
  const [shuffling, setShuffling] = useState(false);

  const playPause = async () => {
    await invoke('play_pause');
  }

  const nextSong = async () => {
    await invoke('next_song');
  }

  const prevSong = async () => {
    await invoke('prev_song');
  }

  const toggleShuffle = async () => {
    setShuffling(!shuffling);
    await invoke('toggle_shuffle');
  }

  return (
    <div className="row music-control">
      <div>
        <button type="button" className={shuffling ? 'music-control-btn shuffling' : 'music-control-btn'} onClick={toggleShuffle}>
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
