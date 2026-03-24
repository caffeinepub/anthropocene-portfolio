import { HttpAgent } from "@icp-sdk/core/agent";
import { loadConfig } from "../config";
import { StorageClient } from "../utils/StorageClient";

/**
 * Upload raw bytes to the Caffeine blob-storage CDN.
 * Returns a persistent CDN URL that can be stored in Motoko Text fields.
 * Works on ICP — no Cloudinary or external dependencies.
 */
export async function uploadToBlobStorage(
  bytes: Uint8Array,
  onProgress?: (percentage: number) => void,
): Promise<string> {
  const config = await loadConfig();

  // Use the storage gateway URL from config, falling back to Caffeine's CDN
  const gatewayUrl =
    config.storage_gateway_url && config.storage_gateway_url !== "nogateway"
      ? config.storage_gateway_url
      : "https://blob.caffeine.ai";

  const agent = new HttpAgent({
    host: config.backend_host,
  });

  if (config.backend_host?.includes("localhost")) {
    await agent.fetchRootKey().catch(() => {});
  }

  const storageClient = new StorageClient(
    config.bucket_name,
    gatewayUrl,
    config.backend_canister_id,
    config.project_id,
    agent,
  );

  const { hash } = await storageClient.putFile(bytes, onProgress);
  return storageClient.getDirectURL(hash);
}
