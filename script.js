// TimbrArte 
/* =====================================================
   1. CONFIGURACIÓN INICIAL
   ===================================================== */
const galleryItems = [
  { type: 'image', src: 'img/girlcode.jpeg', alt: 'girlcode' },
  { type: 'image', src: 'img/dinosaurio.jpeg', alt: 'llavero dinosaurio' },
  { type: 'image', src: 'img/snoopy.jpeg', alt: 'Cuaderno Personalizado' }
];

// Array de productos disponibles (id único, nombre, precio pesos chilenos, imagen)
const products = [
  { id: 1, name: 'Libreta + llavero post-it', price: 8000, img: 'img/girlcode.jpeg' },
  { id: 2, name: 'Llavero post-it', price: 2000, img: 'img/dinosaurio.jpeg' },
  { id: 3, name: 'Cuaderno Snoopy', price: 13500, img: 'img/snoopy.jpeg' }
];

// Carrito (se carga desde localStorage o inicia vacío)
let cart = JSON.parse(localStorage.getItem('timbrarte-cart')) || [];

/* =====================================================
   2. REFERENCIAS DEL DOM
   ===================================================== */
const galeriaContenedor = document.getElementById('galeria-contenedor');
const listaCarrito      = document.getElementById('lista-carrito');
const totalSpan         = document.getElementById('total');
const formCompra        = document.getElementById('form-compra');
const mensajesError     = document.getElementById('mensajes-error');

/* =====================================================
   3. GALERÍA DINÁMICA
   ===================================================== */
function renderGallery() {
  galeriaContenedor.innerHTML = '';


  galleryItems.forEach((item) => {
    const figure = document.createElement('figure');
    figure.classList.add('media-item');

    if (item.type === 'image') {
      const img = document.createElement('img');
      img.src = item.src;
      img.alt = item.alt;
      figure.appendChild(img);
    } else if (item.type === 'video') {
      const video = document.createElement('video');
      video.src = item.src;
      video.controls = true;
      figure.appendChild(video);
    }

    // Botón para agregar primer producto como demo
    const btn = document.createElement('button');
    btn.textContent = 'Agregar al carrito';
    btn.classList.add('btn-carrito');
    btn.addEventListener('click', () => addToCart(products[0].id));
    figure.appendChild(btn);

    galeriaContenedor.appendChild(figure);
  });
}

/* =====================================================
   4. CARRITO DE COMPRAS
   ===================================================== */
function addToCart(id) {
  const product = products.find((p) => p.id === id);
  if (!product) return;

  const itemInCart = cart.find((item) => item.id === id);
  if (itemInCart) {
    itemInCart.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  saveCart();
  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter((item) => item.id !== id);
  saveCart();
  renderCart();
}

function renderCart() {
  listaCarrito.innerHTML = '';
  let total = 0;

  cart.forEach((item) => {
    total += item.price * item.qty;

    const li = document.createElement('li');
    li.innerHTML = `
      ${item.name} x${item.qty} - $${item.price * item.qty}
      <button class="btn-eliminar" data-id="${item.id}">✕</button>
    `;
    listaCarrito.appendChild(li);
  });

  totalSpan.textContent = total;

  // Eventos de los botones eliminar
  document.querySelectorAll('.btn-eliminar').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const id = Number(e.target.dataset.id);
      removeFromCart(id);
    });
  });
}

function saveCart() {
  localStorage.setItem('timbrarte-cart', JSON.stringify(cart));
}

/* =====================================================
   5. VALIDACIÓN DE FORMULARIO
   ===================================================== */
formCompra.addEventListener('submit', (e) => {
  e.preventDefault();
  mensajesError.innerHTML = '';

  const nombre    = formCompra.nombre.value.trim();
  const correo    = formCompra.correo.value.trim();
  const direccion = formCompra.direccion.value.trim();

  const errores = [];

  if (!nombre) errores.push('El nombre es obligatorio.');
  if (!validateEmail(correo)) errores.push('Correo electrónico inválido.');
  if (!direccion) errores.push('La dirección es obligatoria.');
  if (cart.length === 0) errores.push('Tu carrito está vacío.');

  if (errores.length > 0) {
    mostrarErrores(errores);
    return;
  }

  // Procesamiento exitoso (simulado)
  alert(`¡Gracias por tu compra, ${nombre}!`);
  cart = [];
  saveCart();
  renderCart();
  formCompra.reset();
});

function validateEmail(mail) {
  const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/;
  return regex.test(mail);
}

function mostrarErrores(arr) {
  const ul = document.createElement('ul');
  arr.forEach((err) => {
    const li = document.createElement('li');
    li.textContent = err;
    ul.appendChild(li);
  });
  mensajesError.appendChild(ul);
}

/* =====================================================
   6. INICIALIZACIÓN
   ===================================================== */
document.addEventListener('DOMContentLoaded', () => {
  renderGallery();
  renderCart();
});
