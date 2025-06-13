import CryptoJS from "crypto-js";

const ENCRYPTION_KEY =
  import.meta.env.VITE_ENCRYPTION_KEY || process.env.VITE_ENCRYPTION_KEY || ""; // This key should be securely stored, preferably as an environment variable

// Function to encrypt data
export const encryptData = (data: any): string => {
  const encryptedData = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    ENCRYPTION_KEY
  ).toString();
  return encryptedData;
};

// Function to decrypt data
export const decryptData = (encryptedData: string): any => {
  const decryptedDataBytes = CryptoJS.AES.decrypt(
    encryptedData,
    ENCRYPTION_KEY
  );
  const decryptedDataString = decryptedDataBytes.toString(CryptoJS.enc.Utf8);
  return JSON.parse(decryptedDataString);
};

// Save encrypted data to session storage
export const saveDataToSessionStorage = (key: string, data: any) => {
  const encryptedData = encryptData(data);
  sessionStorage.setItem(key, encryptedData);
};

// Retrieve and decrypt data from session storage
export const getDataFromSessionStorage = (key: string): any | null => {
  const encryptedData = sessionStorage.getItem(key);
  if (encryptedData) {
    return decryptData(encryptedData);
  }
  return null;
};
