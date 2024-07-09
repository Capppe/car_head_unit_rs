import { invoke } from "@tauri-apps/api/tauri"

export async function getNetworkStatus(): Promise<string> {
  const status = await invoke<string>("get_network_status")
  console.log(status);
  return status;
}
