const STORAGE_KEY = 'shoppe-cart';

export function loadCart() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return new Map();

    const entries = JSON.parse(stored);
    return new Map(
      entries
        .map(([productId, quantity]) => [Number(productId), Number(quantity)])
        .filter(([productId, quantity]) => Number.isInteger(productId) && quantity > 0),
    );
  } catch (error) {
    return new Map();
  }
}

export function saveCart(cart) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...cart]));
}

export function getCartCount(cart) {
  return [...cart.values()].reduce((sum, quantity) => sum + quantity, 0);
}
