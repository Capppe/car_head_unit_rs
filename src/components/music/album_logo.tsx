import React from "react";
import { removeQuotes } from "../../utils/utils";

interface AlbumLogoProps {
  url: string;
}

export const AlbumLogo: React.FC<AlbumLogoProps> = ({ url }) => {
  return (
    <div className="album-container">
      <img src={removeQuotes(url)} />
    </div>
  )
}
