import React from "react";

interface WebViewProps {
  src: string,
}

export const WebView: React.FC<WebViewProps> = ({ src }) => {
  return (
    <div>
      <iframe src={src} title="WebView" style={{ width: '1850px', height: '900px' }} />
    </div>
  );
}
