const KEY_LOCATION = "medpin:userLocation"
const KEY_LAST_QUERY = "medpin:lastQuery"

export function persistSearchSession({ userLocation, lastQuery }) {
  try {
    if (
      userLocation &&
      typeof userLocation.lat === "number" &&
      typeof userLocation.lng === "number"
    ) {
      localStorage.setItem(KEY_LOCATION, JSON.stringify(userLocation))
    }
    if (typeof lastQuery === "string") {
      localStorage.setItem(KEY_LAST_QUERY, lastQuery)
    }
  } catch {
    // ignore quota / private mode
  }
}

export function loadStoredUserLocation() {
  try {
    const raw = localStorage.getItem(KEY_LOCATION)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (
      parsed &&
      typeof parsed.lat === "number" &&
      typeof parsed.lng === "number"
    ) {
      return { lat: parsed.lat, lng: parsed.lng }
    }
  } catch {
    // ignore
  }
  return null
}

export function loadStoredLastQuery() {
  try {
    return localStorage.getItem(KEY_LAST_QUERY) ?? ""
  } catch {
    return ""
  }
}
