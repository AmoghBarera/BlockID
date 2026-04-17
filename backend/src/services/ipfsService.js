import { nanoid } from "nanoid";
import { encryptJson, sha256 } from "../utils/crypto.js";
import axios from "axios";
import FormData from "form-data";
import { env } from "../config/env.js";

export async function uploadIdentityPayload(payload, files = []) {
  const encrypted = encryptJson(payload);
  const documentHashes = files.map((file) => sha256(file.originalname + file.size));

  const hasPinataToken = env.pinataJwt && env.pinataJwt !== "pinata_jwt";
  let metadataCid = `bafyblockid${nanoid(10)}`;
  const documentsInfo = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    let cid = `bafydoc${i}${nanoid(8)}`;

    if (hasPinataToken) {
      try {
        const formData = new FormData();
        formData.append("file", file.buffer, file.originalname);
        const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
          headers: {
            Authorization: `Bearer ${env.pinataJwt}`,
            ...formData.getHeaders()
          }
        });
        cid = res.data.IpfsHash;
      } catch (error) {
        console.error("Pinata file upload failed, using mock CID:", error.message);
      }
    }
    
    documentsInfo.push({
      name: file.originalname,
      cid,
      hash: documentHashes[i]
    });
  }

  if (hasPinataToken) {
    try {
      const res = await axios.post("https://api.pinata.cloud/pinning/pinJSONToIPFS", { encrypted }, {
        headers: {
          Authorization: `Bearer ${env.pinataJwt}`,
        }
      });
      metadataCid = res.data.IpfsHash;
    } catch (e) {
      console.error("Pinata JSON upload failed, using mock CID:", e.message);
    }
  }

  return {
    metadataCid,
    encryptedPayload: encrypted,
    documentHashes,
    documents: documentsInfo
  };
}
