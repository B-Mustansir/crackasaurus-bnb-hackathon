import { client, getAllSps } from "../client";

/**
 * generate off-chain auth key pair and upload public key to sp
 */
export const getOffchainAuthKeys = async (address, provider) => {
  const storageResStr = localStorage.getItem(address);

  if (storageResStr) {
    const storageRes = JSON.parse(storageResStr);
    if (storageRes.expirationTime < Date.now()) {
      alert("Your auth key has expired, please generate a new one");
      localStorage.removeItem(address);
      return;
    }

    return storageRes;
  }

  const allSps = await getAllSps();
  const offchainAuthRes =
    await client.offchainauth.genOffChainAuthKeyPairAndUpload(
      {
        sps: allSps,
        chainId: import.meta.env.VITE_GREEN_CHAIN_ID,
        expirationMs: 5 * 24 * 60 * 60 * 1000,
        domain: window.location.origin,
        address,
      },
      provider
    );

  const { code, body: offChainData } = offchainAuthRes;
  if (code !== 0 || !offChainData) {
    throw offchainAuthRes;
  }

  localStorage.setItem(address, JSON.stringify(offChainData));
  return offChainData;
};
