import React, { useRef, useState } from "react";
import { getDockImg } from "../../utils/utils";
import { invoke } from "@tauri-apps/api/tauri";

export const VolumeSlider = () => {
  const [volume, setVolume] = useState(50);

  const [volChanged, setVolChanged] = useState(false);

  const timer = useRef<number | null>();

  const changeVolume = (val: number) => {
    setVolume(volume + val);
    setVolChanged(true);
    startTimer();
    invoke('change_volume', { val: (volume + val).toString() });
  }

  const startTimer = () => {
    if (!timer.current) {
      timer.current = setTimeout(() => { handleStopChange() }, 1000);
    }
  }

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(event.target.value, 10);
    setVolume(val);
    invoke('change_volume', { val: val.toString() });
    setVolChanged(true);
    startTimer();
  }

  const handleStopChange = () => {
    setVolChanged(false);
    timer.current = null;
  }

  return (
    <div className="vol_slider">
      <button className="dockbar_vol_button" onClick={() => changeVolume(-5)}>
        <img src={getDockImg("volume-down.svg")} alt="VolDown" />
      </button>

      <div>
        <input
          type="range"
          min={0}
          max={100}
          value={volume}
          className="slider"
          onChange={handleVolumeChange}
          onMouseUp={handleStopChange}
        />
        <div style={{ display: volChanged ? "block" : "none", position: "fixed", bottom: 0, marginLeft: "56px" }}>
          {volume}%
        </div>
      </div>

      <button className="dockbar_vol_button" onClick={() => changeVolume(5)}>
        <img src={getDockImg("volume-up.svg")} alt="VolUp" />
      </button>
    </div>
  );
}
