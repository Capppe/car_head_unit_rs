import React from "react";

interface MainContainerProps {
  child_element: React.JSX.Element;
}

export const MainContainer: React.FC<MainContainerProps> = ({ child_element }) => {
  return (
    <div className="main_layout">
      {child_element}
    </div>
  );
}
