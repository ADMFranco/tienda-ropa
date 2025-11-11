// --- Lista de productos ---
const productos = [
  { id: 1, nombre: "Camiseta Negra", precio: 50, imagen: "img/camiseta.jpg" },
  { id: 2, nombre: "Zapatillas Urbanas", precio: 120, imagen: "img/zapatillas.jpg" },
  { id: 3, nombre: "Gorra Casual", precio: 35, imagen: "img/gorra.jpg" },
  { id: 4, nombre: "Casaca Street", precio: 180, imagen: "img/casaca.jpg" },
  { id: 5, nombre: "Pantalón Denim", precio: 95, imagen: "img/pantalon.jpg" },
  { id: 6, nombre: "Conjunto Deportivo", precio: 120, imagen: "img/cdeportivo.jpg" },
  { id: 7, nombre: "Conjunto De Verano", precio: 80, imagen: "img/cverano.jpg" },
  { id: 8, nombre: "Conjunto De Invierno", precio: 90, imagen: "img/cinvierno.jpg" },
  { id: 9, nombre: "Conjunto Casual (Mujer)", precio: 150, imagen: "img/cmcasual.jpg" },
  { id: 10, nombre: "Conjunto Formal", precio: 250, imagen: "img/cformal.jpg" }
];

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// --- Mostrar productos ---
const contenedor = document.getElementById("productos-container");

if (contenedor) {
  productos.forEach(prod => {
    const card = document.createElement("div");
    card.classList.add("tarjeta");
    card.innerHTML = `
      <img src="${prod.imagen}" alt="${prod.nombre}">
      <h3>${prod.nombre}</h3>
      <p>Precio: S/ ${prod.precio}</p>
      <button onclick="agregarAlCarrito(${prod.id})">Agregar al carrito</button>
    `;
    contenedor.appendChild(card);
  });
}

// --- Funciones del carrito ---
function agregarAlCarrito(id) {
  const producto = productos.find(p => p.id === id);
  carrito.push(producto);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  mostrarCarrito();
}

// --- Mostrar carrito ---
function mostrarCarrito() {
  const itemsDiv = document.getElementById("carrito-items");
  const totalTexto = document.getElementById("total");

  itemsDiv.innerHTML = "";
  let total = 0;

  if (carrito.length === 0) {
    // 🔸 Mensaje cuando no hay productos
    const mensaje = document.createElement("p");
    mensaje.classList.add("carrito-vacio");
    mensaje.textContent = "Aún no tienes ningún producto agregado 🛍️";
    itemsDiv.appendChild(mensaje);
    totalTexto.textContent = "Total: S/ 0";
    return;
  }

  carrito.forEach((item, index) => {
    total += item.precio;
    const itemDiv = document.createElement("p");
    itemDiv.innerHTML = `
      ${item.nombre} - S/ ${item.precio}
      <button onclick="eliminarDelCarrito(${index})">x</button>
    `;
    itemsDiv.appendChild(itemDiv);
  });

  totalTexto.textContent = `Total: S/ ${total}`;
}


function eliminarDelCarrito(index) {
  carrito.splice(index, 1);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  mostrarCarrito();
}

// --- Mostrar / Ocultar Carrito ---
document.getElementById("verCarrito")?.addEventListener("click", () => {
  document.getElementById("carrito").classList.add("mostrar");
  mostrarCarrito(); //Se asegura de mostrar el estado actual (vacío o con productos)
});

document.getElementById("cerrarCarrito")?.addEventListener("click", () => {
  document.getElementById("carrito").classList.remove("mostrar");
});


document.getElementById("vaciarCarrito")?.addEventListener("click", () => {
  carrito = [];
  localStorage.removeItem("carrito");
  mostrarCarrito();
});

// --- Formulario de contacto ---
const form = document.getElementById("formContacto");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    document.getElementById("mensajeEnviado").classList.remove("oculto-contacto");
    form.reset();

    // Ocultar mensaje después de unos segundos
    setTimeout(() => {
      document.getElementById("mensajeEnviado").classList.add("oculto-contacto");
    }, 4000);
  });
}


/* ===== Autenticación simple (localStorage) ===== */

// Utilidades
function mostrarMensaje(element, text, tipo = "error") {
  element.textContent = text;
  element.classList.remove("oculto", "error", "exito");
  element.classList.add("mensaje", tipo === "exito" ? "exito" : "error");
  // ocultar luego de 3s
  setTimeout(() => {
    element.classList.add("oculto");
  }, 3000);
}

// Registrar nuevo usuario (guardado en localStorage)
// Estructura: usuarios = [{name, email, passHash}]
function obtenerUsuarios() {
  return JSON.parse(localStorage.getItem("usuarios") || "[]");
}
function guardarUsuarios(list) {
  localStorage.setItem("usuarios", JSON.stringify(list));
}

// Registro
const formRegister = document.getElementById("formRegister");
if (formRegister) {
  formRegister.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("regName").value.trim();
    const email = document.getElementById("regEmail").value.trim().toLowerCase();
    const pass = document.getElementById("regPass").value;
    const pass2 = document.getElementById("regPass2").value;
    const msg = document.getElementById("msgRegister");

    if (!name || !email || !pass) {
      mostrarMensaje(msg, "Completa todos los campos.");
      return;
    }
    if (pass !== pass2) {
      mostrarMensaje(msg, "Las contraseñas no coinciden.");
      return;
    }

    const usuarios = obtenerUsuarios();
    if (usuarios.some(u => u.email === email)) {
      mostrarMensaje(msg, "Ya existe una cuenta con ese correo.");
      return;
    }

    // Guardamos (no encriptamos en este prototipo)
    usuarios.push({ name, email, pass });
    guardarUsuarios(usuarios);

    mostrarMensaje(msg, "Cuenta creada correctamente.", "exito");
    formRegister.reset();

    // cambiar a pestaña de login automáticamente
    setTimeout(() => {
      activarTab("login");
    }, 800);
  });
}

// Login
const formLogin = document.getElementById("formLogin");
if (formLogin) {
  formLogin.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value.trim().toLowerCase();
    const pass = document.getElementById("loginPass").value;
    const msg = document.getElementById("msgLogin");

    const usuarios = obtenerUsuarios();
    const usuario = usuarios.find(u => u.email === email && u.pass === pass);
    if (!usuario) {
      mostrarMensaje(msg, "Correo o contraseña incorrectos.");
      return;
    }

    // Guardar sesión (simple)
    localStorage.setItem("currentUser", JSON.stringify({ name: usuario.name, email: usuario.email }));

    mostrarMensaje(msg, "¡Has iniciado sesión!", "exito");

    // Actualizar navbar y (opcional) redirigir a productos
    actualizarNavUsuario();
    setTimeout(() => {
      window.location.href = "productos.html";
    }, 800);
  });
}

// Mostrar usuario en navbar + logout
function actualizarNavUsuario() {
  const span = document.getElementById("nav-usuario");
  const usuario = JSON.parse(localStorage.getItem("currentUser"));
  if (!span) return;

  if (usuario && usuario.name) {
    span.innerHTML = `
      <span class="usuario-nombre">Hola, ${usuario.name}</span>
      <button id="logoutBtn" class="link-like" style="margin-left:8px">Cerrar sesión</button>
    `;
    const logoutBtn = document.getElementById("logoutBtn");
    logoutBtn?.addEventListener("click", () => {
      localStorage.removeItem("currentUser");
      actualizarNavUsuario();
      // recargar para actualizar UI si necesitas
      window.location.reload();
    });
  } else {
    span.innerHTML = `<a href="login.html" class="link-like">Iniciar sesión</a>`;
  }
}

// Pestañas login/register
function activarTab(tab) {
  document.getElementById("tab-login").classList.remove("activo");
  document.getElementById("tab-register").classList.remove("activo");
  document.getElementById("formLogin").classList.remove("activo");
  document.getElementById("formRegister").classList.remove("activo");

  if (tab === "login") {
    document.getElementById("tab-login").classList.add("activo");
    document.getElementById("formLogin").classList.add("activo");
  } else {
    document.getElementById("tab-register").classList.add("activo");
    document.getElementById("formRegister").classList.add("activo");
  }
}

// Eventos para tabs y enlaces
document.getElementById("tab-login")?.addEventListener("click", () => activarTab("login"));
document.getElementById("tab-register")?.addEventListener("click", () => activarTab("register"));
document.getElementById("toRegister")?.addEventListener("click", () => activarTab("register"));

// Iniciar: mostrar usuario si ya está logueado y activar tab por defecto
document.addEventListener("DOMContentLoaded", () => {
  actualizarNavUsuario();
  activarTab("login");
});
