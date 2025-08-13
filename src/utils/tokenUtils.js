import { AES, enc } from "crypto-js";
import secureLocalStorage from "react-secure-storage";
import { de } from "zod/v4/locales";

//set up mechanism of encrypt and decrypted accesstoken

const ENCRYPT_KEY = import.meta.env.VITE_ENCRYPTED_KEY;

// set up encrypt with crypto-js to encrypted the accesstoken

export const encryptedToken = (encrypted) => {
  const dataEncrypted = AES.encrypt(encrypted, ENCRYPT_KEY).toString();
  console.log("==========> Data encrypted : ", dataEncrypted);
  return dataEncrypted;
};

//store accessToken
export const storeAccessToken = (accessToken) => {
  console.log("======> accessToken <======", accessToken);
  const dataEncrypted = encryptedToken(accessToken);
  console.log("========? ", dataEncrypted);
  secureLocalStorage.setItem(ENCRYPT_KEY, dataEncrypted);
};

//decrypted accesstoken
export const decryptedAccessToken = (encryptedToken) => {
  if (encryptedToken) {
    const decrypted = AES.decrypt(encryptedToken, ENCRYPT_KEY);
    return decrypted.toString(enc.Utf8);
  }
};

//getDecryptAccessToken
export const getDecryptAccessToken = () => {
  const encryptedToken = secureLocalStorage.getItem(ENCRYPT_KEY);
  console.log("The encryptedToken :", encryptedToken);
  if (encryptedToken) {
    return decryptedAccessToken(encryptedToken);
  }
  return null;
};
