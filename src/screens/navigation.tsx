import { WebView } from "../components/navigation/webview";

export const NavigationWindow = () => {
  const networkConnected = true;

  return (
    <div>
      {networkConnected ? (
        <WebView src="https://www.openstreetmap.org/export/embed.html" />
      ) : (
        <div>An internet connection is required to use navigation!</div>
      )}
    </div>
  );
}
