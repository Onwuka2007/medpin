const TOKEN_KEY = "pharmacyAccessToken";

export function getPharmacyToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setPharmacyToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearPharmacyToken() {
  localStorage.removeItem(TOKEN_KEY);
}
