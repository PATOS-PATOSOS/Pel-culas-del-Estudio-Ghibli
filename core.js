const boton = document.getElementById('nuevaPeli');
const contenedorAleatorio = document.getElementById('peli-destacada');
const contenedorCatalogo = document.getElementById('peliculas-container');
const contenedorFavoritos = document.getElementById('favoritos-container'); // NUEVO
const buscador = document.getElementById('buscador');
const btnMusica = document.getElementById('btnMusica');
const musica = document.getElementById('musicaGhibli');
const iconoMusica = document.getElementById('iconoMusica');

const urlGhibli = 'https://ghibliapi.vercel.app/films';
let todasLasPelis = []; 

// --- LÓGICA DE FAVORITOS (Basada en recetas) ---
let favoritos = JSON.parse(localStorage.getItem('ghibli_favs')) || [];

function cargarContenido() {
    fetch(urlGhibli)
        .then(respuesta => respuesta.json())
        .then(datos => {
            todasLasPelis = datos; 
            mostrarCatalogo(todasLasPelis);
            mostrarAleatoria(todasLasPelis);
            mostrarFavoritos(); // Mostrar favoritas al cargar

            boton.addEventListener('click', () => {
                mostrarAleatoria(todasLasPelis);
            });

            // Lógica del BUSCADOR
            buscador.addEventListener('input', (e) => {
                const texto = e.target.value.toLowerCase();
                const filtradas = todasLasPelis.filter(peli => 
                    aplicarNombreMofa(peli.title).toLowerCase().includes(texto) || 
                    peli.director.toLowerCase().includes(texto)
                );
                mostrarCatalogo(filtradas);
            });

            intentarReproducir();
        })
        .catch(error => console.error("Error al conectar con la API:", error));
}

// --- FUNCIÓN PARA TUS NOMBRES MOFA (Centralizada) ---
function aplicarNombreMofa(originalTitle) {
    const mofas = {
        "Castle in the Sky": "Laputa",
        "The Wind Rises": "Soy él, si hubiese escogido aviación",
        "Grave of the Fireflies": "Llore mucho :(",
        "Spirited Away": "Mis padres son unos cerdos y el negro es el malo",
        "Porco Rosso": "Es menor donde vas",
        "Princess Mononoke": "Solo con la izquierda",
        "My Neighbor Totoro": "Entiendelo, esta muerta",
        "Howl's Moving Castle": "Top mejores abuelas"
    };
    return mofas[originalTitle] || originalTitle;
}

// --- GESTIÓN DE FAVORITOS ---
function agregarFavorito(id) {
    const peli = todasLasPelis.find(p => p.id === id);
    if (!favoritos.some(f => f.id === id)) {
        favoritos.push(peli);
        localStorage.setItem('ghibli_favs', JSON.stringify(favoritos));
        mostrarFavoritos();
    }
}

function eliminarFavorito(id) {
    favoritos = favoritos.filter(f => f.id !== id);
    localStorage.setItem('ghibli_favs', JSON.stringify(favoritos));
    mostrarFavoritos();
}

function mostrarFavoritos() {
    contenedorFavoritos.innerHTML = "";
    if (favoritos.length === 0) {
        contenedorFavoritos.innerHTML = "<p class='text-muted'>No tienes pelis favoritas guardadas aún.</p>";
        return;
    }
    favoritos.forEach(peli => {
        contenedorFavoritos.innerHTML += generarHTMLTarjerta(peli, true);
    });
}

// --- RENDERIZADO DE TARJETAS ---
function mostrarCatalogo(peliculas) {
    contenedorCatalogo.innerHTML = "";
    peliculas.forEach(peli => {
        contenedorCatalogo.innerHTML += generarHTMLTarjerta(peli, false);
    });
}

function mostrarAleatoria(peliculas) {
    const indice = Math.floor(Math.random() * peliculas.length);
    const peliSuerte = peliculas[indice];
    contenedorAleatorio.innerHTML = generarHTMLTarjerta(peliSuerte, false);
}

// Función unificada para generar HTML (Catálogo y Favoritos)
function generarHTMLTarjerta(peli, esFavorito) {
    const titulo = aplicarNombreMofa(peli.title);
    
    // Botón dinámico: si es favorita muestra "Quitar", si no "Favorita"
    const btnAccion = esFavorito
        ? `<button class="btn btn-danger btn-sm w-100" onclick="eliminarFavorito('${peli.id}')">Quitar</button>`
        : `<button class="btn btn-warning btn-sm w-100 fw-bold" onclick="agregarFavorito('${peli.id}')">⭐ Favorita</button>`;

    // Ajuste de tamaño para la sección de favoritos
    const columnaClass = esFavorito ? "col-md-3" : "col-md-4 d-flex justify-content-center";
    const estiloCard = esFavorito ? "" : "style='width: 18rem;'";

    return `
        <div class="${columnaClass}">
            <div class="card" ${estiloCard}>
                <img src="${peli.image}" class="card-img-top" alt="${titulo}">
                <div class="card-body">
                    <h5 class="card-title text-dark">${titulo}</h5>
                    <p class="card-text text-secondary small text-start">
                        <strong>Director:</strong> ${peli.director}<br>
                        <strong>Año:</strong> ${peli.release_date}<br>
                        <span class="badge bg-warning text-dark mt-2">Rating: ${peli.rt_score}%</span>
                    </p>
                    <div class="mt-3">
                        ${btnAccion}
                    </div>
                </div>
            </div>
        </div>`;
}

// --- LÓGICA DE MÚSICA (Original) ---
function toggleMusica() {
    if (musica.paused) {
        musica.play();
        iconoMusica.innerText = "🔊";
        btnMusica.classList.replace('btn-light', 'btn-warning');
    } else {
        musica.pause();
        iconoMusica.innerText = "🔈";
        btnMusica.classList.replace('btn-warning', 'btn-light');
    }
}

function intentarReproducir() {
    musica.play().catch(() => {
        iconoMusica.innerText = "🔈";
        btnMusica.classList.replace('btn-warning', 'btn-light');
    });
}

btnMusica.addEventListener('click', toggleMusica);

// Iniciar
cargarContenido();
