import { products } from './data.js';
import { loadCart, saveCart } from './cart-storage.js';
import { formatPrice } from './utils.js';

const cart = loadCart();
const checkoutItems = document.getElementById('checkoutItems');
const checkoutTotal = document.getElementById('checkoutTotal');
const checkoutForm = document.getElementById('checkoutForm');

function renderCheckoutSummary() {
  checkoutItems.innerHTML = '';
  let total = 0;

  if (cart.size === 0) {
    checkoutItems.innerHTML = '<p class="empty-state">ตะกร้าว่างอยู่ กรุณาเลือกสินค้าก่อน</p>';
    checkoutTotal.textContent = formatPrice(0);
    return;
  }

  cart.forEach((quantity, productId) => {
    const product = products.find((item) => item.id === productId);
    const itemTotal = product.price * quantity;
    total += itemTotal;

    const item = document.createElement('div');
    item.className = 'checkout-item';
    item.innerHTML = `
      <div>
        <strong>${product.name}</strong>
        <p>${quantity} x ${formatPrice(product.price)}</p>
      </div>
      <strong>${formatPrice(itemTotal)}</strong>
    `;
    checkoutItems.appendChild(item);
  });

  checkoutTotal.textContent = formatPrice(total);
}

checkoutForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const name = document.getElementById('customerName').value.trim();
  const phone = document.getElementById('customerPhone').value.trim();
  const address = document.getElementById('customerAddress').value.trim();
  const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value || 'ไม่ระบุ';

  if (!name || !phone || !address) {
    alert('กรุณากรอกข้อมูลให้ครบถ้วน');
    return;
  }

  if (cart.size === 0) {
    alert('ตะกร้าว่างอยู่ ไม่สามารถสั่งซื้อได้');
    return;
  }

  const orderSummary = {
    name,
    phone,
    address,
    paymentMethod,
    items: [...cart.entries()],
    total: checkoutTotal.textContent,
  };

  localStorage.setItem('shoppe-last-order', JSON.stringify(orderSummary));
  cart.clear();
  saveCart(cart);
  renderCheckoutSummary();
  checkoutForm.reset();
  alert(`สั่งซื้อสำเร็จแล้ว! ขอบคุณ ${name} ที่ช้อปกับเรา\nวิธีชำระเงิน: ${paymentMethod}`);
  window.location.href = 'index.html';
});

renderCheckoutSummary();
