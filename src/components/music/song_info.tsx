import React, { useEffect, useRef, useState } from "react";
import { getMusicImgUrl } from "../../utils/image_utils";
import { removeQuotes, secToMinSec } from "../../utils/utils";
import '../../styles/MusicInfo.css';
import { invoke } from "@tauri-apps/api/tauri";

interface SongInfoProps {
  title: string,
  artist: string,
  album: string,
  length: number,
}

interface SongPosition {
  position: number,
}

export const SongInfo: React.FC<SongInfoProps> = ({ title, artist, album, length }) => {
  const [position, setPosition] = useState<number>(0);
  const [posChanging, togglePosChanging] = useState<boolean>(false);

  const timer = useRef<number>();

  const changePosition = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPosition(parseInt(e.target.value, 10));
  }

  const fetchPosition = async () => {
    if (posChanging) return;
    const pos = await invoke<SongPosition>("get_music_position");
    setPosition(pos.position);
  }

  const handlePress = async (down: boolean) => {
    if (down) {
      togglePosChanging(true);
    } else {
      togglePosChanging(false);
      await seek(position.toString());
    }
  }

  const seek = async (position: string) => {
    await invoke('seek_song', { position });
  }

  useEffect(() => {
    timer.current = window.setInterval(fetchPosition, 900);

    return () => {
      if (timer.current) {
        clearInterval(timer.current);
      }
    }
  }, []);

  return (
    <div className="col song-info-container">
      <div className="row song-row">
        <img src={getMusicImgUrl('title')} />
        <h2 className="text_orange">{removeQuotes(title)}</h2>
      </div>

      <div className="row song-row">
        <img src={getMusicImgUrl('artist')} />
        <h4>{removeQuotes(artist)}</h4>
      </div>

      <div className="row song-row">
        <img src={getMusicImgUrl('album')} />
        <h4>{removeQuotes(album)}</h4>
      </div>

      <div className="row song-row slider-row">
        <div className="text_orange">{secToMinSec(position)}</div>
        <input
          type="range"
          step={1}
          min={0}
          max={length}
          value={position}
          onChange={changePosition}
          onMouseDown={() => handlePress(true)}
          onMouseUp={() => handlePress(false)}
          className="slider song-slider"
        />
        <div className="text_orange">{secToMinSec(length)}</div>
      </div>
    </div>
  )
}
