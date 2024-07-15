import { invoke } from "@tauri-apps/api/tauri"

interface NetworkStatus {
  connected?: boolean;
  devName?: string;
}

export async function getNetworkStatus(): Promise<NetworkStatus> {
  const status = await invoke<NetworkStatus>("get_network_status");
  return status;
}
