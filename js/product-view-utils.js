import { products } from './data.js';

export function parseProductId(search) {
  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
  const rawId = params.get('id');

  if (!rawId) {
    return null;
  }

  const parsed = Number(rawId);
  return Number.isInteger(parsed) ? parsed : null;
}

export function resolveProduct(productList = products, search = window.location.search) {
  const productId = parseProductId(search);

  if (productId === null) {
    return productList[0] ?? null;
  }

  return productList.find((item) => item.id === productId) ?? null;
}
