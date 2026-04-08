const boton = document.getElementById('nuevaPeli');
const contenedorAleatorio = document.getElementById('peli-destacada');
const contenedorCatalogo = document.getElementById('peliculas-container');
const contenedorFavoritos = document.getElementById('favoritos-container');
const buscador = document.getElementById('buscador');
const btnMusica = document.getElementById('btnMusica');
const musica = document.getElementById('musicaGhibli');
const iconoMusica = document.getElementById('iconoMusica');

const urlGhibli = 'https://ghibliapi.vercel.app/films';
let todasLasPelis = []; 

// --- LÓGICA DE FAVORITOS (Inspirada en recetas) ---
let favoritos = JSON.parse(localStorage.getItem('ghibli_favs')) || [];

function cargarContenido() {
    fetch(urlGhibli)
        .then(respuesta => respuesta.json())
        .then(datos => {
            todasLasPelis = datos; 
            mostrarCatalogo(todasLasPelis);
            mostrarAleatoria(todasLasPelis);
            mostrarFavoritos();

            boton.addEventListener('click', () => {
                mostrarAleatoria(todasLasPelis);
            });

            // Lógica del BUSCADOR
            buscador.addEventListener('input', (e) => {
                const texto = e.target.value.toLowerCase();
                const filtradas = todasLasPelis.filter(peli => {
                    const nombreMofa = aplicarNombreMofa(peli.title).toLowerCase();
                    const director = peli.director.toLowerCase();
                    return nombreMofa.includes(texto) || director.includes(texto);
                });
                mostrarCatalogo(filtradas);
            });

            intentarReproducir();
        })
        .catch(error => console.error("Error al conectar con la API:", error));
}

// --- TUS NOMBRES "MOFA" ---
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

// --- FUNCIÓN PARA GENERAR EL HTML (SOLUCIÓN PARA QUE NO SE CORTE) ---
function crearCardHTML(peli, esFavorito) {
    const titulo = aplicarNombreMofa(peli.title);
    
    // Botón dinámico
    const btnAccion = esFavorito
        ? `<button class="btn btn-danger btn-sm w-100" onclick="eliminarFavorito('${peli.id}')">Quitar de favoritos</button>`
        : `<button class="btn btn-warning btn-sm w-100 fw-bold" onclick="agregarFavorito('${peli.id}')">⭐ Añadir a favoritos</button>`;

    return `
        <div class="col-md-4 d-flex justify-content-center mb-4">
            <div class="card shadow" style="width: 18rem;">
                <div class="card-img-container" style="background-color: #222; height: 380px; display: flex; align-items: center; justify-content: center; overflow: hidden;">
                    <img src="${peli.image}" class="card-img-top" alt="${titulo}" style="max-width: 100%; max-height: 100%; width: auto; height: auto; object-fit: contain;">
                </div>
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title text-dark">${titulo}</h5>
                    <p class="card-text text-secondary small text-start flex-grow-1">
                        <strong>Director:</strong> ${peli.director}<br>
                        <strong>Año:</strong> ${peli.release_date}
                    </p>
                    <div class="mt-auto">
                        ${btnAccion}
                    </div>
                </div>
            </div>
        </div>`;
}

// --- RENDERIZADO DE SECCIONES ---
function mostrarCatalogo(peliculas) {
    contenedorCatalogo.innerHTML = "";
    peliculas.forEach(peli => {
        contenedorCatalogo.innerHTML += crearCardHTML(peli, false);
    });
}

function mostrarFavoritos() {
    if (!contenedorFavoritos) return;
    contenedorFavoritos.innerHTML = "";
    if (favoritos.length === 0) {
        contenedorFavoritos.innerHTML = "<p class='text-muted'>Aún no tienes películas favoritas.</p>";
        return;
    }
    favoritos.forEach(peli => {
        contenedorFavoritos.innerHTML += crearCardHTML(peli, true);
    });
}

function mostrarAleatoria(peliculas) {
    const indice = Math.floor(Math.random() * peliculas.length);
    const peliSuerte = peliculas[indice];
    contenedorAleatorio.innerHTML = crearCardHTML(peliSuerte, false);
}

// --- ACCIONES FAVORITOS ---
window.agregarFavorito = function(id) {
    const peli = todasLasPelis.find(p => p.id === id);
    if (peli && !favoritos.some(f => f.id === id)) {
        favoritos.push(peli);
        localStorage.setItem('ghibli_favs', JSON.stringify(favoritos));
        mostrarFavoritos();
    }
}

window.eliminarFavorito = function(id) {
    favoritos = favoritos.filter(f => f.id !== id);
    localStorage.setItem('ghibli_favs', JSON.stringify(favoritos));
    mostrarFavoritos();
}

// --- LÓGICA DE MÚSICA ---
function toggleMusica() {
    if (musica.paused) {
        musica.play();
        iconoMusica.innerText = "🔊";
    } else {
        musica.pause();
        iconoMusica.innerText = "🔈";
    }
}

function intentarReproducir() {
    musica.play().catch(() => {
        iconoMusica.innerText = "🔈";
    });
}

btnMusica.addEventListener('click', toggleMusica);

// Iniciar aplicación
cargarContenido();
