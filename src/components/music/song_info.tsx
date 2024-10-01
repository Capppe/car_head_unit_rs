import React, { useEffect, useRef, useState } from "react";
import { getMusicImgUrl } from "../../utils/image_utils";
import { removeQuotes, microSecToMinSec } from "../../utils/utils";
import '../../styles/MusicInfo.css';
import { invoke } from "@tauri-apps/api/tauri";

interface SongInfoProps {
  title: string,
  artist: string,
  album: string,
  length: number,
}

export const SongInfo: React.FC<SongInfoProps> = ({ title, artist, album, length }) => {
  const [position, setPosition] = useState<number>(0);

  const isSliding = useRef(false);
  const seekOffset = useRef(0);

  useEffect(() => {
    const fetchPosition = async () => {
      if (isSliding.current) return;
      const pos = await invoke<number>("get_music_position");
      setPosition(pos);
    }

    fetchPosition();
    const interval = window.setInterval(fetchPosition, 1000);

    return () => {
      clearInterval(interval);
    }
  }, []);

  const changePosition = (e: React.ChangeEvent<HTMLInputElement>) => {

    console.log("New pos: ", parseInt(e.target.value, 10));
    setPosition(parseInt(e.target.value, 10));
  }

  const handlePress = async (down: boolean) => {
    if (down) {
      if (!seekOffset.current) {
        console.log("Setting offset: ", position);
        seekOffset.current = position;
      }

      isSliding.current = true;
    } else {
      await seek(position - seekOffset.current);
      seekOffset.current = 0;
      isSliding.current = false;
    }
  }

  const seek = async (pos: number) => {
    console.log("Seeking: ", pos);

    await invoke('seek_song', { position: pos });
  }

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
        <div className="text_orange">{microSecToMinSec(position)}</div>
        <input
          type="range"
          min={0}
          max={length}
          value={position}
          onChange={changePosition}
          onMouseDown={() => handlePress(true)}
          onMouseUp={() => handlePress(false)}
          onTouchStart={() => handlePress(true)}
          onTouchEnd={() => handlePress(false)}
          className="slider song-slider"
        />
        <div className="text_orange">{microSecToMinSec(length)}</div>
      </div>
    </div>
  )
}
