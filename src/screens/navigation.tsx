import { useGlobalState } from "../components/globalstatecontext";
import { WebView } from "../components/navigation/webview";

export const NavigationWindow = () => {
  const { state, setState } = useGlobalState();
  return (
    <div>
      {state.networkConnected ? (
        <WebView src="https://www.openstreetmap.org/export/embed.html" />
      ) : (
        <div>An internet connection is required to use navigation!</div>
      )}
    </div>
  );
}
