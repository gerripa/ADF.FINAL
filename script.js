// ─────────────────────────────────────────────
// ALMACÉN DE FRAGANCIAS – script.js
// ─────────────────────────────────────────────

const WA_NUMBER = '5492284582125';

// ── BASE DE DATOS – GOOGLE SHEETS ─────────────
const SHEETS_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTH5tnRo9-KRhyMRCRNA7ZGQ-LX8ErEExVbHw3T7vhhhmVPxlG-JX7bzFD922QAVFYxPPoyP9ccVuyK/pub?gid=1676840940&single=true&output=csv';

let productos = [];
let _pendingFiltro = null;

function parsearCSV(texto) {
  const lineas = texto.trim().split('\n');
  const headers = lineas[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  return lineas.slice(1).map(linea => {
    const cols = [];
    let actual = '';
    let dentroComillas = false;
    for (let i = 0; i < linea.length; i++) {
      const c = linea[i];
      if (c === '"') { dentroComillas = !dentroComillas; }
      else if (c === ',' && !dentroComillas) { cols.push(actual.trim()); actual = ''; }
      else { actual += c; }
    }
    cols.push(actual.trim());
    const obj = {};
    headers.forEach((h, i) => { obj[h] = (cols[i] || '').replace(/^"|"$/g, '').trim(); });
    return obj;
  });
}

async function cargarProductos() {
  try {
    const res = await fetch(SHEETS_URL);
    const texto = await res.text();
    const filas = parsearCSV(texto);

    productos = filas
      .filter(f => f.nombre && f.nombre.trim() !== '')
      .map(f => ({
        name:  f.nombre,
        brand: f.marca,
        price: parseInt(f.precio.toString().replace(/\./g, '').replace(',', '')) || 0,
        image: f.imagen,
        desc:  f.descripcion,
        stock: parseInt(f.stock) || 0,
      }));

    const contenedor = document.getElementById('catalogo');
    if (contenedor) {
      // Prioridad: filtro pendiente > ?marca= en URL > data-marca en el div
      const params = new URLSearchParams(window.location.search);
      const marcaParam = params.get('marca');
      const dataMarca = contenedor.dataset.marca || null;
      renderCatalogo(_pendingFiltro || marcaParam || dataMarca || null);
    }

  } catch (err) {
    console.error('Error cargando productos desde Sheets:', err);
    const contenedor = document.getElementById('catalogo');
    if (contenedor) {
      contenedor.innerHTML = '<p class="no-productos">No se pudieron cargar los productos. Intentá de nuevo más tarde.</p>';
    }
  }
}

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
    let msg = '¡Hola! Me gustaría hacer el siguiente pedido desde Almacén de Fragancias:\n\n';
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
  _pendingFiltro = filtroMarca;
  const contenedor = document.getElementById('catalogo');
  if (!contenedor) return;

  if (productos.length === 0) {
    contenedor.innerHTML = '<p class="no-productos" style="opacity:0.5">Cargando productos...</p>';
    return;
  }

  const lista = filtroMarca
    ? productos.filter(p => p.brand === filtroMarca)
    : productos;

  if (lista.length === 0) {
    contenedor.innerHTML = '<p class="no-productos">No hay productos en esta categoría todavía.</p>';
    return;
  }

  contenedor.innerHTML = lista.map((prod) => {
    const idx = productos.indexOf(prod);
    const sinStock = prod.stock === 0;
    return `
      <div class="producto-card${sinStock ? ' sin-stock' : ''}" data-index="${idx}">
        <div class="producto-img-wrap">
          <img src="${prod.image}" alt="${prod.name}" onerror="this.src='img/SinFoto.webp'">
          <span class="producto-marca-tag">${prod.brand}</span>
          ${sinStock ? '<span class="tag-sin-stock">Sin stock</span>' : ''}
        </div>
        <div class="producto-info">
          <h4 class="producto-name">${prod.name}</h4>
          <p class="producto-desc">${prod.desc}</p>
          <p class="producto-price">$${prod.price.toLocaleString('es-AR')}</p>
          <button class="btn-agregar" data-idx="${idx}" ${sinStock ? 'disabled' : ''}>
            ${sinStock ? 'Sin stock' : '+ Agregar a mi selección'}
          </button>
        </div>
      </div>
    `;
  }).join('');

  contenedor.querySelectorAll('.btn-agregar:not([disabled])').forEach(btn => {
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
  cargarProductos();
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