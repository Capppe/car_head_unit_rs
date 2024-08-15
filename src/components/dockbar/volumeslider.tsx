import React, { useEffect, useRef, useState } from "react";
import { getDockImg } from "../../utils/utils";
import { invoke } from "@tauri-apps/api/tauri";

export const VolumeSlider = () => {
  const [volume, setVolume] = useState(50);

  const [volChanged, setVolChanged] = useState(false);

  const timer = useRef<number | null>();

  useEffect(() => {
    const getCurrVolume = async () => {
      const currVol = await invoke('get_curr_volume') as string;
      console.log("Currvol: ", parseInt(currVol, 10));
      setVolume(parseInt(currVol, 10));
    }
    getCurrVolume();
  }, []);

  useEffect(() => {
    setVolChanged(true);
    if (timer.current) {
      clearTimeout(timer.current);
    }

    console.log("Volume: ", volume);

    timer.current = setTimeout(() => setVolChanged(false), 500);
  }, [volume]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    val > volume ? incrVolume() : decrVolume();
    setVolChanged(true);
  }

  const incrVolume = () => {
    if (volume >= 100) return;

    invoke('change_volume', { val: (volume + 5).toString() });
    setVolume(volume + 5);
  }

  const decrVolume = () => {
    if (volume <= 0) return;

    invoke('change_volume', { val: (volume - 5).toString() });
    setVolume(volume - 5);
  }

  return (
    <div className="vol_slider">
      <button className="dockbar_vol_button" onClick={() => decrVolume()}>
        <img src={getDockImg("volume-down.svg")} alt="VolDown" />
      </button>

      <div>
        <input
          type="range"
          step={5}
          min={0}
          max={100}
          value={volume}
          className="slider"
          onChange={handleVolumeChange}
        />
        <div style={{ display: volChanged ? "block" : "none", position: "fixed", bottom: 0, marginLeft: "56px" }}>
          {volume}%
        </div>
      </div>

      <button className="dockbar_vol_button" onClick={() => incrVolume()}>
        <img src={getDockImg("volume-up.svg")} alt="VolUp" />
      </button>
    </div>
  );
}
