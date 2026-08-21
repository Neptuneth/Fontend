import { products } from './data.js';
import { loadCart, saveCart, getCartCount } from './cart-storage.js';
import { formatPrice } from './utils.js';
import { parseProductId, resolveProduct } from './product-view-utils.js';

const cart = loadCart();
const productDetail = document.getElementById('productDetail');
const cartCount = document.getElementById('cartCount');
const cartDrawer = document.getElementById('cartDrawer');
const cartToggle = document.getElementById('cartToggle');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const checkoutButton = document.getElementById('checkoutButton');
const productId = parseProductId(window.location.search);

function updateCartCount() {
  cartCount.textContent = String(getCartCount(cart));
}

function showError(message) {
  productDetail.innerHTML = `
    <div class="product-error">
      <h2>${message}</h2>
      <p>ลองกลับไปที่หน้าหลักหรือเลือกสินค้าจากด้านล่าง</p>
      <a href="index.html" class="secondary-btn">กลับสู่หน้าหลัก</a>
    </div>
  `;
}

function renderProductList() {
  productDetail.innerHTML = `
    <div class="product-list-page">
      <div class="product-list-summary">
        <h2>เลือกสินค้า</h2>
        <p>คุณยังไม่ได้เลือกสินค้า สามารถเลือกจากสินค้าที่แนะนำด้านล่างได้</p>
      </div>
      <div class="product-list-grid">
        ${products
          .map(
            (product) => `
            <article class="product-list-card">
              <div class="product-card-head">
                <span class="product-tag">${product.badge}</span>
                <span class="product-shipping">${product.shipping}</span>
              </div>
              <img src="${product.image}" alt="${product.name}" />
              <div class="product-list-body">
                <span class="category">${product.category}</span>
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-rating">
                  <strong>⭐ ${product.rating}</strong>
                  <span>${product.sold.toLocaleString()} ขายแล้ว</span>
                </div>
                <div class="product-list-actions">
                  <a href="product.html?id=${product.id}" class="secondary-btn">ดูรายละเอียด</a>
                  <button class="primary-btn product-add-btn" data-product-id="${product.id}">ใส่ตะกร้า</button>
                </div>
              </div>
            </article>
          `,
          )
          .join('')}
      </div>
    </div>
  `;

  productDetail.querySelectorAll('.product-add-btn').forEach((button) => {
    button.addEventListener('click', (event) => {
      const productId = Number(event.currentTarget.dataset.productId);
      cart.set(productId, (cart.get(productId) || 0) + 1);
      saveCart(cart);
      renderCart();
      updateCartCount();
      event.currentTarget.textContent = 'เพิ่มแล้ว';
    });
  });
}

function renderProduct() {
  const product = resolveProduct(products, window.location.search);

  if (!product) {
    renderProductList();
    return;
  }

  if (!productId) {
    renderProductList();
    return;
  }

  const quantity = cart.get(product.id) || 0;

  productDetail.innerHTML = `
    <div class="product-page-card">
      <div class="product-page-image">
        <img src="${product.image}" alt="${product.name}" />
      </div>
      <div class="product-page-info">
        <div class="product-badge-row">
          <span class="product-tag">${product.badge}</span>
          <span class="product-shipping">${product.shipping}</span>
        </div>
        <span class="category">${product.category}</span>
        <h1>${product.name}</h1>
        <div class="product-rating-row">
          <strong>⭐ ${product.rating}</strong>
          <span>${product.sold.toLocaleString()} ขายแล้ว</span>
        </div>
        <p class="product-description">${product.description}</p>
        <div class="price-block">
          <div>
            <div class="product-price">${formatPrice(product.price)}</div>
            <div class="old-price">${formatPrice(product.originalPrice)}</div>
          </div>
          <div class="promo-badge">ลดทันที 20%</div>
        </div>
        <div class="action-row">
          <button id="buyNowButton" class="primary-btn">ซื้อเลย</button>
          <button id="addToCartButton" class="secondary-btn">${quantity > 0 ? 'เพิ่มอีก' : 'ใส่ตะกร้า'}</button>
        </div>
        <div class="seller-card">
          <h3>ร้านค้า</h3>
          <p>Mellow Shop Store · ตอบกลับเร็ว · ส่งไวภายใน 24 ชั่วโมง</p>
        </div>
        <div class="product-meta-list">
          <div>
            <span>สถานะ</span>
            <strong>พร้อมส่ง</strong>
          </div>
          <div>
            <span>รหัสสินค้า</span>
            <strong>${product.id}</strong>
          </div>
          <div>
            <span>การจัดส่ง</span>
            <strong>ส่งฟรี</strong>
          </div>
        </div>
      </div>
    </div>

    <section class="detail-highlights">
      <article>
        <h3>🚚 ส่งไว</h3>
        <p>จัดส่งภายใน 24 ชั่วโมง เพื่อให้คุณได้สินค้าภายในระยะเวลาอันรวดเร็ว</p>
      </article>
      <article>
        <h3>✅ รับประกัน</h3>
        <p>สินค้าทุกชิ้นมีการรับประกันความพอใจและสามารถคืนได้ภายใน 7 วัน</p>
      </article>
      <article>
        <h3>💬 ติดต่อง่าย</h3>
        <p>ร้านค้ายินดีตอบคำถามเกี่ยวกับสินค้าก่อนตัดสินใจซื้อ</p>
      </article>
    </section>
  `;

  document.getElementById('addToCartButton').addEventListener('click', () => {
    cart.set(product.id, (cart.get(product.id) || 0) + 1);
    saveCart(cart);
    updateCartCount();
    renderCart();
    document.getElementById('addToCartButton').textContent = 'เพิ่มแล้ว';
  });

  document.getElementById('buyNowButton').addEventListener('click', () => {
    cart.set(product.id, (cart.get(product.id) || 0) + 1);
    saveCart(cart);
    updateCartCount();
    renderCart();
    window.location.href = 'checkout.html';
  });
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

function toggleCart() {
  if (cartDrawer.classList.contains('open')) {
    closeCartDrawer();
  } else {
    openCart();
  }
}

function initEventListeners() {
  cartToggle.addEventListener('click', toggleCart);
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
  updateCartCount();
  renderProduct();
  renderCart();
  initEventListeners();
}

init();
