export function formatPrice(value) {
  return `฿${value.toLocaleString('en-US')}`;
}

export function createElement(tag, options = {}) {
  const element = document.createElement(tag);

  if (options.className) element.className = options.className;
  if (options.textContent) element.textContent = options.textContent;
  if (options.html) element.innerHTML = options.html;
  if (options.attrs) {
    Object.entries(options.attrs).forEach(([key, value]) => element.setAttribute(key, value));
  }

  return element;
}
