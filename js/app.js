import { products } from './data.js';
import { loadCart, saveCart, getCartCount } from './cart-storage.js';
import { formatPrice } from './utils.js';

const cart = loadCart();
const productGrid = document.getElementById('productGrid');
const categoryFilter = document.getElementById('categoryFilter');
const searchInput = document.getElementById('searchInput');
const categoryChips = document.getElementById('categoryChips');
const cartCount = document.getElementById('cartCount');
const cartDrawer = document.getElementById('cartDrawer');
const cartToggle = document.getElementById('cartToggle');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const checkoutButton = document.getElementById('checkoutButton');

function renderCategories() {
  const categories = [...new Set(products.map((product) => product.category))];
  categoryFilter.innerHTML = '<option value="all">ทั้งหมด</option>';
  categoryChips.innerHTML = '';

  categories.forEach((category) => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);

    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = `category-chip ${categoryFilter.value === category ? 'active' : ''}`;
    chip.textContent = category;
    chip.addEventListener('click', () => {
      categoryFilter.value = category;
      renderProducts();
      renderCategories();
    });
    categoryChips.appendChild(chip);
  });
}

function renderProducts() {
  const filterValue = categoryFilter.value;
  const keyword = searchInput.value.trim().toLowerCase();

  productGrid.innerHTML = '';

  const filteredProducts = products.filter((product) => {
    const matchesCategory = filterValue === 'all' || product.category === filterValue;
    const matchesSearch =
      product.name.toLowerCase().includes(keyword) ||
      product.description.toLowerCase().includes(keyword) ||
      product.category.toLowerCase().includes(keyword);
    return matchesCategory && matchesSearch;
  });

  if (filteredProducts.length === 0) {
    productGrid.innerHTML = '<p class="empty-state">ไม่พบสินค้าตามที่ค้นหา ลองเปลี่ยนคำค้นหรือหมวดหมู่ดู</p>';
    return;
  }

  filteredProducts.forEach((product) => {
    const card = document.createElement('article');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="product-card-head">
        <span class="product-tag">${product.badge}</span>
        <span class="product-shipping">${product.shipping}</span>
      </div>
      <img src="${product.image}" alt="${product.name}" />
      <div class="product-meta">
        <div class="category">${product.category}</div>
        <h3>${product.name}</h3>
        <p>${product.description}</p>
      </div>
      <div class="product-rating">
        <strong>⭐ ${product.rating}</strong>
        <span>${product.sold.toLocaleString()} ขายแล้ว</span>
      </div>
      <div class="product-card-footer">
        <div class="price-row">
          <strong>${formatPrice(product.price)}</strong>
          <span class="old-price">${formatPrice(product.originalPrice)}</span>
        </div>
        <div class="card-buttons">
          <a href="product.html?id=${product.id}" class="secondary-btn">ดูรายละเอียด</a>
          <button data-product-id="${product.id}">ใส่ตะกร้า</button>
        </div>
      </div>
    `;

    card.querySelector('button').addEventListener('click', () => addToCart(product.id));
    productGrid.appendChild(card);
  });
}

function updateCartCount() {
  cartCount.textContent = String(getCartCount(cart));
}

function renderCart() {
  cartItems.innerHTML = '';
  let total = 0;

  if (cart.size === 0) {
    cartItems.innerHTML = '<p>ตะกร้าว่างอยู่ ลองเพิ่มสินค้าด้านบนได้เลย</p>';
  }

  cart.forEach((quantity, productId) => {
    const product = products.find((item) => item.id === productId);
    if (!product) return;
    const itemTotal = product.price * quantity;
    total += itemTotal;

    const item = document.createElement('div');
    item.className = 'cart-item';
    item.innerHTML = `
      <img src="${product.image}" alt="${product.name}" />
      <div class="cart-item-details">
        <div>
          <h4>${product.name}</h4>
          <p>${formatPrice(product.price)} x ${quantity}</p>
        </div>
        <div class="quantity-controller">
          <button data-action="decrease" data-product-id="${product.id}">-</button>
          <span>${quantity}</span>
          <button data-action="increase" data-product-id="${product.id}">+</button>
        </div>
        <div class="summary-row">
          <span>รวม</span>
          <strong>${formatPrice(itemTotal)}</strong>
        </div>
        <button class="remove-item" data-action="remove" data-product-id="${product.id}">ลบ</button>
      </div>
    `;

    item.querySelectorAll('button').forEach((button) => {
      button.addEventListener('click', handleCartAction);
    });

    cartItems.appendChild(item);
  });

  cartTotal.textContent = formatPrice(total);
  updateCartCount();
}

function addToCart(productId) {
  cart.set(productId, (cart.get(productId) || 0) + 1);
  saveCart(cart);
  renderCart();
  openCart();
}

function handleCartAction(event) {
  const button = event.currentTarget;
  const action = button.dataset.action;
  const productId = Number(button.dataset.productId);

  if (!action) return;

  const currentQuantity = cart.get(productId) || 0;

  if (action === 'increase') {
    cart.set(productId, currentQuantity + 1);
  } else if (action === 'decrease') {
    if (currentQuantity > 1) {
      cart.set(productId, currentQuantity - 1);
    } else {
      cart.delete(productId);
    }
  } else if (action === 'remove') {
    cart.delete(productId);
  }

  saveCart(cart);
  renderCart();
}

function openCart() {
  cartDrawer.classList.add('open');
  cartDrawer.setAttribute('aria-hidden', 'false');
}

function closeCartDrawer() {
  cartDrawer.classList.remove('open');
  cartDrawer.setAttribute('aria-hidden', 'true');
}

function initEventListeners() {
  categoryFilter.addEventListener('change', renderProducts);
  searchInput.addEventListener('input', renderProducts);
  cartToggle.addEventListener('click', () => {
    if (cartDrawer.classList.contains('open')) {
      closeCartDrawer();
    } else {
      openCart();
    }
  });
  closeCart.addEventListener('click', closeCartDrawer);
  checkoutButton.addEventListener('click', () => {
    if (cart.size === 0) {
      alert('กรุณาเพิ่มสินค้าในตะกร้าก่อน');
      return;
    }
    closeCartDrawer();
    window.location.href = 'checkout.html';
  });
}

function init() {
  renderCategories();
  renderProducts();
  renderCart();
  initEventListeners();
}

init();
