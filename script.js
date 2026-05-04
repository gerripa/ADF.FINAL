// ─────────────────────────────────────────────
// ALMACEN DE FRAGANCIAS – script.js
// ─────────────────────────────────────────────

const WA_NUMBER = '5492284582125';

// ── PRODUCTOS ──────────────────────────────────
// Para agregar un producto real: copiá uno de estos objetos,
// cambiá los datos y agregá la imagen en la carpeta img/.
// Cada producto necesita: name, brand, price, image, desc
const productos = [
  // KALA
  { name: "Perfume Kala Nº1",       brand: "Kala",               price: 3200,  image: "img/kala1.webp", desc: "Fragancia floral y amaderada, 50ml" },
  { name: "Perfume Kala Nº3",       brand: "Kala",               price: 3800,  image: "img/kala2.webp", desc: "Notas orientales con fondo de ámbar, 50ml" },
  { name: "Kala Roll-On",           brand: "Kala",               price: 1500,  image: "img/kala3.webp", desc: "Aceite perfumado en roll-on, 10ml" },

  // PAQUE COCO
  { name: "Paque Noche",            brand: "Paque Coco",         price: 2900,  image: "img/paque1.webp", desc: "Intenso y sensual, ideal para la noche" },
  { name: "Paque Día",              brand: "Paque Coco",         price: 2600,  image: "img/paque2.webp", desc: "Fresco y frutal para el día a día" },
  { name: "Paque Mini Set",         brand: "Paque Coco",         price: 1800,  image: "img/paque3.webp", desc: "Set de 2 mini perfumes 15ml c/u" },

  // NANDA
  { name: "Difusor Nanda Bambú",    brand: "Nanda",              price: 4200,  image: "img/nanda1.webp", desc: "Difusor de ambiente 200ml, bambú y sándalo" },
  { name: "Difusor Nanda Jazmín",   brand: "Nanda",              price: 4200,  image: "img/nanda2.webp", desc: "Difusor de ambiente 200ml, jazmín y musgo" },
  { name: "Perfume Nanda 001",      brand: "Nanda",              price: 5500,  image: "img/nanda3.webp", desc: "Perfume de autor, cruelty free, 60ml" },

  // NEW CANDLES
  { name: "Vela Canela & Vainilla", brand: "New Candles",        price: 1800,  image: "img/candles1.jpg", desc: "Vela artesanal de cera de soja, 200g" },
  { name: "Vela Lavanda",           brand: "New Candles",        price: 1800,  image: "img/candles2.jpg", desc: "Vela artesanal de cera de soja, 200g" },
  { name: "Set 3 Velas Mini",       brand: "New Candles",        price: 2400,  image: "img/candles3.jpg", desc: "Set de 3 velas pequeñas, aromas a elección" },

  // VELAS DE SOJA
  { name: "Vela Soja Clásica",      brand: "Velas de Soja",      price: 1600,  image: "img/velas1.jpeg", desc: "Vela de elaboración propia, cera 100% soja" },
  { name: "Vela Soja Grande",       brand: "Velas de Soja",      price: 2200,  image: "img/velas2.jpeg", desc: "Vela grande, 350g, larga duración" },
  { name: "Vela Soja Regalo",       brand: "Velas de Soja",      price: 2800,  image: "img/velas3.jpeg", desc: "Presentación caja regalo, ideal para regalar" },

  // TOUCH AROMAS
  { name: "Aromatizador Touch",     brand: "Touch Aromas",       price: 1900,  image: "img/touch1.webp", desc: "Aromatizador de ambiente, 250ml" },
  { name: "Body Splash Touch",      brand: "Touch Aromas",       price: 2100,  image: "img/touch2.webp", desc: "Splash corporal refrescante, 200ml" },
  { name: "Crema Perfumada Touch",  brand: "Touch Aromas",       price: 2300,  image: "img/touch3.webp", desc: "Crema corporal con fragancia duradera" },

  // COMPAÑÍA DE BRUJAS
  { name: "Camino Toronto",         brand: "Compañía de Brujas", price: 38000, image: "img/brujas1.webp", desc: "Camino de mesa artesanal con flecos" },
  { name: "Camino York",            brand: "Compañía de Brujas", price: 58000, image: "img/brujas2.webp", desc: "Camino de mesa boho con terminación tejida" },
  { name: "Camino Lisboa",          brand: "Compañía de Brujas", price: 58000, image: "img/brujas3.webp", desc: "Camino de mesa en lino natural con flecos" },

  // MARÍA FERNÁNDEZ BA
  { name: "Perfum NYC New York",    brand: "María Fernández BA", price: 3500,  image: "img/maria1.jpeg", desc: "Perfume de ambiente inspirado en Nueva York" },
  { name: "Perfum BS AS",           brand: "María Fernández BA", price: 3500,  image: "img/maria2.jpeg", desc: "Perfume de ambiente con esencia porteña" },
  { name: "Perfum París",           brand: "María Fernández BA", price: 3500,  image: "img/maria3.jpeg", desc: "Home spray inspirado en París, 250ml" },
];

// ── CARRITO ────────────────────────────────────
let cartItems = JSON.parse(localStorage.getItem('cart_af')) || [];

const cartOverlay       = document.getElementById('cartOverlay');
const openCartBtn       = document.getElementById('openCart');
const closeCartBtn      = document.getElementById('closeCart');
const cartContent       = document.getElementById('cart-content');
const cartCount         = document.getElementById('cart-count');
const cartBadge         = document.getElementById('cart-count-badge');
const cartFooterActions = document.getElementById('cart-footer-actions');
const btnWhatsapp       = document.getElementById('btnWhatsapp');
const btnClearCart      = document.getElementById('btnClearCart');

function updateCart() {
  cartContent.innerHTML = '';
  const totalItems = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  if (cartCount) cartCount.textContent = totalItems;
  if (cartBadge) {
    cartBadge.textContent = totalItems;
    cartBadge.style.display = totalItems > 0 ? 'flex' : 'none';
  }

  if (cartItems.length === 0) {
    cartContent.innerHTML = `
      <p class="empty-cart">Tu selección está vacía</p>
      <a href="catalogo.html" class="btn-ver-catalogo-empty">Ver catálogo</a>
    `;
    if (cartFooterActions) cartFooterActions.style.display = 'none';
    localStorage.removeItem('cart_af');
    return;
  }

  let total = 0;
  cartItems.forEach((item, index) => {
    total += item.price * item.quantity;
    const div = document.createElement('div');
    div.classList.add('cart-item');
    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="cart-item-image" onerror="this.src='img/SinFoto.webp'">
      <div class="cart-item-details">
        <p class="cart-item-name">${item.name}</p>
        <p class="cart-item-brand">${item.brand}</p>
        <p class="cart-item-price">$${item.price.toLocaleString('es-AR')}</p>
        <div class="cart-controls">
          <button class="btn-qty minus" data-index="${index}">−</button>
          <span class="cart-qty-number">${item.quantity}</span>
          <button class="btn-qty plus" data-index="${index}">+</button>
        </div>
      </div>
      <button class="remove-item" data-index="${index}">×</button>
    `;
    cartContent.appendChild(div);
  });

  const totalDiv = document.createElement('div');
  totalDiv.classList.add('cart-total');
  totalDiv.innerHTML = `<span>Total estimado</span><span>$${total.toLocaleString('es-AR')}</span>`;
  cartContent.appendChild(totalDiv);

  if (cartFooterActions) cartFooterActions.style.display = 'flex';
  localStorage.setItem('cart_af', JSON.stringify(cartItems));
}

// Eventos dentro del carrito
if (cartContent) {
  cartContent.addEventListener('click', (e) => {
    const index = parseInt(e.target.dataset.index);
    if (isNaN(index)) return;
    if (e.target.classList.contains('remove-item')) {
      cartItems.splice(index, 1);
    } else if (e.target.classList.contains('plus')) {
      cartItems[index].quantity++;
    } else if (e.target.classList.contains('minus')) {
      if (cartItems[index].quantity > 1) cartItems[index].quantity--;
      else cartItems.splice(index, 1);
    }
    updateCart();
  });
}

if (openCartBtn) openCartBtn.addEventListener('click', (e) => { e.preventDefault(); cartOverlay.classList.add('active'); });
if (closeCartBtn) closeCartBtn.addEventListener('click', () => cartOverlay.classList.remove('active'));

if (btnClearCart) {
  btnClearCart.addEventListener('click', () => {
    cartItems = [];
    updateCart();
  });
}

// ── WHATSAPP ───────────────────────────────────
if (btnWhatsapp) {
  btnWhatsapp.addEventListener('click', () => {
    if (cartItems.length === 0) return;
    let msg = '¡Hola! Me gustaría hacer el siguiente pedido desde Almacen de Fragancias:\n\n';
    let total = 0;
    cartItems.forEach(item => {
      const subtotal = item.price * item.quantity;
      total += subtotal;
      msg += `• ${item.quantity}x ${item.name} (${item.brand}) – $${subtotal.toLocaleString('es-AR')}\n`;
    });
    msg += `\n*Total estimado: $${total.toLocaleString('es-AR')}*`;
    msg += '\n\n¿Me podés confirmar disponibilidad y forma de pago? ¡Gracias!';
    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  });
}

// ── CATÁLOGO ───────────────────────────────────
function renderCatalogo(filtroMarca = null) {
  const contenedor = document.getElementById('catalogo');
  if (!contenedor) return;

  const lista = filtroMarca
    ? productos.filter(p => p.brand === filtroMarca)
    : productos;

  if (lista.length === 0) {
    contenedor.innerHTML = '<p class="no-productos">No hay productos en esta categoría todavía.</p>';
    return;
  }

  contenedor.innerHTML = lista.map((prod) => `
    <div class="producto-card" data-index="${productos.indexOf(prod)}">
      <div class="producto-img-wrap">
        <img src="${prod.image}" alt="${prod.name}" onerror="this.src='img/SinFoto.webp'">
        <span class="producto-marca-tag">${prod.brand}</span>
      </div>
      <div class="producto-info">
        <h4 class="producto-name">${prod.name}</h4>
        <p class="producto-desc">${prod.desc}</p>
        <p class="producto-price">$${prod.price.toLocaleString('es-AR')}</p>
        <button class="btn-agregar" data-idx="${productos.indexOf(prod)}">
          + Agregar a mi selección
        </button>
      </div>
    </div>
  `).join('');

  contenedor.querySelectorAll('.btn-agregar').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.idx);
      const prod = productos[idx];
      const existing = cartItems.find(i => i.name === prod.name);
      if (existing) {
        existing.quantity++;
      } else {
        cartItems.push({ name: prod.name, brand: prod.brand, price: prod.price, quantity: 1, image: prod.image });
      }
      updateCart();

      btn.textContent = '✓ Agregado';
      btn.classList.add('agregado');
      setTimeout(() => {
        btn.textContent = '+ Agregar a mi selección';
        btn.classList.remove('agregado');
      }, 1500);
    });
  });
}

// ── MENÚ MOBILE ────────────────────────────────
const menuToggle = document.getElementById('menuToggle');
const navLinks   = document.getElementById('navLinks');
const overlay    = document.getElementById('overlay');

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    overlay.classList.toggle('active');
  });
}
if (overlay) {
  overlay.addEventListener('click', () => {
    navLinks.classList.remove('active');
    overlay.classList.remove('active');
    cartOverlay.classList.remove('active');
  });
}

// ── INIT ───────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  updateCart();
  if (document.getElementById('catalogo')) {
    const params = new URLSearchParams(window.location.search);
    const marcaParam = params.get('marca');
    renderCatalogo(marcaParam || null);
  }
});

// Scroll suave
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});