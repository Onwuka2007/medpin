export function getGoogleMapsSearchUrl(item) {
  const { lat, lng } = item.pharmacy.coordinates;
  return `https://www.google.com/maps/@?api=1&map_action=map&center=${lat}%2C${lng}&zoom=17`;
}

export function getStatusLabel(status) {
  if (status === "low_stock") {
    return "Low stock";
  }

  return "In stock";
}

export function getStatusClasses(status) {
  if (status === "low_stock") {
    return "bg-[#fff4de] text-[#9c6500]";
  }

  return "bg-[#e8f5ee] text-[#1f5649]";
}
