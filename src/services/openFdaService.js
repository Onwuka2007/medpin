const OPEN_FDA_ENDPOINT = "https://api.fda.gov/drug/drugsfda.json";

function normalizeText(value) {
  return String(value ?? "").trim();
}

function encodeSearchValue(value) {
  return normalizeText(value).replaceAll('"', '\\"');
}

function mapOpenFdaResult(application) {
  return (application.products ?? []).map((product) => ({
    id: `${application.application_number}-${product.product_number}`,
    source: "openfda",
    name: normalizeText(product.brand_name) || "Unnamed drug",
    genericName: normalizeText(product.generic_name) || "Generic name unavailable",
    strength: normalizeText(product.strength),
    form: normalizeText(product.dosage_form),
    status: normalizeText(product.marketing_status),
  }));
}

export async function searchOpenFdaDrugs(query, { signal, limit = 8 } = {}) {
  const trimmedQuery = normalizeText(query);

  if (!trimmedQuery) {
    return [];
  }

  const search = `products.brand_name:"${encodeSearchValue(trimmedQuery)}"`;
  const url = `${OPEN_FDA_ENDPOINT}?search=${encodeURIComponent(search)}&limit=${limit}`;
  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error(`openFDA request failed with status ${response.status}`);
  }

  const payload = await response.json();

  return (payload.results ?? [])
    .flatMap(mapOpenFdaResult)
    .filter((item) => item.name);
}
