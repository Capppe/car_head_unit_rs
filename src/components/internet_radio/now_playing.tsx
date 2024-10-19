import React from "react";

interface IRNowPlayingProps {
  station_name: string;
  track: string;
}

export const IRNowPlaying: React.FC<IRNowPlayingProps> = ({ station_name, track }) => {
  return (
    <div>
      <div>Now playing</div>
      <div>{station_name}</div>
      <div>{track}</div>
    </div>
  );
}
