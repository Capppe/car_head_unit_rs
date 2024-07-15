import React from "react";

interface ImageButtonProps {
  id: string;
  imgSrc: string;
  text: string;
  onClick: Function;
}

export const ImageButton: React.FC<ImageButtonProps> = ({ id, imgSrc, text, onClick }) => {
  return (
    <button className="button image_button window_button" id={id} onClick={() => onClick()}>
      {imgSrc !== "" &&
        <img src={imgSrc} alt="button image" />
      }
      {text && text}
    </button>
  );
}
