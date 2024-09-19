import axios from "axios";

const pinataApiKey = "b5d787f18c4fcfba4c7f";
const pinataSecretApiKey =
  "fc27ea47e412c9762f1e744b7fa0988cda372ea193e2e68a8cabf7bd6dfeda44";

const pinataBaseUrl = "https://api.pinata.cloud/pinning/pinFileToIPFS";

export async function uploadImage(file) {
  const formData = new FormData();
  formData.append("file", file);

  console.log("API Key:", pinataApiKey); 
  console.log("API Secret:", pinataSecretApiKey); 

  try {
    const res = await axios.post(pinataBaseUrl, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        pinata_api_key: pinataApiKey,
        pinata_secret_api_key: pinataSecretApiKey,
      },
    });

    return `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
  } catch (error) {
    console.error(
      "Pinata upload error:",
      error.response?.data || error.message
    );
    throw error;
  }
}