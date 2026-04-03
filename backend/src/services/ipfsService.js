import { nanoid } from "nanoid";
import { encryptJson, sha256 } from "../utils/crypto.js";

export async function uploadIdentityPayload(payload, files = []) {
  const encrypted = encryptJson(payload);
  const documentHashes = files.map((file) => sha256(file.originalname + file.size));

  return {
    metadataCid: `bafyblockid${nanoid(10)}`,
    encryptedPayload: encrypted,
    documentHashes,
    documents: files.map((file, index) => ({
      name: file.originalname,
      cid: `bafydoc${index}${nanoid(8)}`,
      hash: documentHashes[index]
    }))
  };
}
