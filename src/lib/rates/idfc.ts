"use server";

import CryptoJS from "crypto-js";

type ForexRate = {
  buyRate: string;
  sellRate: string;
  currency: string;
};

type IDFCForexResponse = {
  bills: ForexRate[];
  telegraphicTransfer: ForexRate[];
  currCard: ForexRate[];
  cash: ForexRate[];
  publishTime: string;
};

async function fetchRate() {
  const res = await fetch(
    "https://www.idfcfirst.bank.in/content/idfcfirstbank/api/forexRate",
  );

  if (!res.ok) {
    throw new Error(`IDFC request failed: ${res.status}`);
  }
  const data = await res.json();

  const encrypted = data.responseJson.EncryptedString.trim();

  // IDFC publishes these values in the JavaScript served on their forex page.
  // They are reproduced here to decrypt the public forex API response.
  const salt = CryptoJS.MD5("fc74a45dsalt");
  const iv = CryptoJS.MD5("c29aab06iv");
  const pass =
    "d6163f0659cfe4196dc03c2c29aab06f10cb0a79cdfc74a45da2d72358712e80";

  const key = CryptoJS.PBKDF2(pass, salt, {
    keySize: 128 / 32,
    iterations: 100,
    hasher: CryptoJS.algo.SHA1,
  });

  const decrypted = CryptoJS.AES.decrypt(encrypted, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  const json: IDFCForexResponse = JSON.parse(
    CryptoJS.enc.Utf8.stringify(decrypted),
  );

  const ttUSDINR = json.telegraphicTransfer.find(
    (x) => x.currency === "USDINR",
  );

  if (!ttUSDINR) {
    throw new Error("USDINR rate not found");
  }

  return Number(ttUSDINR.buyRate);
}

export async function getIDFCRate() {
  return fetchRate();
}
