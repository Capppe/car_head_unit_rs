import { useState } from "react";
import { getRadioImgUrl } from "../utils/image_utils";
import "../styles/Radio.css";

export const RadioWindow = () => {
  const [currFm, setCurrFm] = useState(93.5);
  const [currentlyPlaying, _setCurrentlyPlaying] = useState<string>("Pink Floyd - Dogs");
  const [currentStation, _setCurrentStation] = useState<string>("Radio Vega");
  const [seeking, _setSeeking] = useState<boolean>(false);

  return (
    <div>
      <div className="col center" style={{ padding: '25px' }}>
        <div className="text40 text_orange">{seeking ? ("Seeking...") : currentStation}</div>
        <div className="col center widest">
          <div className="col center widest">
            <input type="range" min={87.5} max={108} step={0.5} value={currFm} onChange={(v) => { setCurrFm(parseFloat(v.target.value)) }} className="slider radio-slider" />
          </div>
        </div>
        <div className="row" style={{ alignSelf: 'start', padding: '10px' }}>
          <div className="text_orange text22">Now playing: </div>
          <div className="text22">{currentlyPlaying}</div>
        </div>
        <div className="grid3">
          <div>
            <button className="button big">
              <img src={getRadioImgUrl('seek-back')} />
            </button>
          </div>
          <div className="col center fm-display">
            <div className="col center fm-display-inner text30 text_orange">
              {currFm.toFixed(1)}
            </div>
          </div>
          <div>
            <button className="button big">
              <img src={getRadioImgUrl('seek-forward')} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
