const boton = document.getElementById('nuevaPeli');
const contenedorAleatorio = document.getElementById('peli-destacada');
const contenedorCatalogo = document.getElementById('peliculas-container');
const contenedorFavoritos = document.getElementById('favoritos-container');
const buscador = document.getElementById('buscador');

const urlGhibli = 'https://ghibliapi.vercel.app/films';
let todasLasPelis = []; 

// LÓGICA DE FAVORITOS (Inspirada en recetas 2)
let favoritos = JSON.parse(localStorage.getItem('ghibli_favs')) || [];

function cargarContenido() {
    fetch(urlGhibli)
        .then(respuesta => respuesta.json())
        .then(datos => {
            todasLasPelis = datos; 
            mostrarCatalogo(todasLasPelis);
            mostrarAleatoria(todasLasPelis);
            mostrarFavoritos(); // Cargar favoritos al iniciar
        });
}

// Función para nombres "mofa"
function obtenerTituloMofa(originalTitle) {
    const nombres = {
        "Castle in the Sky": "Laputa",
        "The Wind Rises": "Soy él, si hubiese escogido aviación",
        "Grave of the Fireflies": "Llore mucho :(",
        "Spirited Away": "Mis padres son unos cerdos y el negro es el malo",
        "Porco Rosso": "Es menor donde vas",
        "Princess Mononoke": "Solo con la izquierda",
        "My Neighbor Totoro": "Entiendelo, esta muerta",
        "Howl's Moving Castle": "Top mejores abuelas"
    };
    return nombres[originalTitle] || originalTitle;
}

function mostrarCatalogo(lista) {
    contenedorCatalogo.innerHTML = "";
    lista.forEach(peli => {
        contenedorCatalogo.innerHTML += generarHTML(peli, false);
    });
}

function generarHTML(peli, esFavorito) {
    const titulo = obtenerTituloMofa(peli.title);
    const btnAccion = esFavorito 
        ? `<button class="btn btn-danger btn-sm w-100" onclick="eliminarFavorito('${peli.id}')">Quitar de favoritos</button>`
        : `<button class="btn btn-warning btn-sm w-100 fw-bold" onclick="agregarFavorito('${peli.id}')">⭐ Favorita</button>`;

    return `
        <div class="col-md-4 d-flex justify-content-center">
            <div class="card shadow" style="width: 18rem; margin-bottom: 20px;">
                <img src="${peli.image}" class="card-img-top" alt="${titulo}">
                <div class="card-body">
                    <h5 class="card-title text-dark">${titulo}</h5>
                    <p class="card-text text-dark small">
                        Director: ${peli.director}<br>
                        Año: ${peli.release_date}<br>
                        Score: ⭐ ${peli.rt_score}
                    </p>
                    ${btnAccion}
                </div>
            </div>
        </div>
    `;
}

// Funciones de Favoritos
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
        contenedorFavoritos.innerHTML = "<p class='text-muted'>No tienes pelis favoritas aún.</p>";
        return;
    }
    favoritos.forEach(peli => {
        contenedorFavoritos.innerHTML += generarHTML(peli, true);
    });
}

// Buscador
buscador.addEventListener('input', (e) => {
    const texto = e.target.value.toLowerCase();
    const filtradas = todasLasPelis.filter(p => 
        p.title.toLowerCase().includes(texto) || p.director.toLowerCase().includes(texto)
    );
    mostrarCatalogo(filtradas);
});

// Aleatorio
function mostrarAleatoria(lista) {
    const peli = lista[Math.floor(Math.random() * lista.length)];
    const titulo = obtenerTituloMofa(peli.title);
    contenedorAleatorio.innerHTML = `
        <div class="card shadow-lg bg-dark text-white" style="width: 22rem;">
            <img src="${peli.movie_banner}" class="card-img" alt="...">
            <div class="card-img-overlay d-flex flex-column justify-content-end bg-dark bg-opacity-50">
                <h5 class="card-title">${titulo}</h5>
                <button class="btn btn-sm btn-outline-warning" onclick="agregarFavorito('${peli.id}')">Añadir a favoritas</button>
            </div>
        </div>
    `;
}

// Música
const musica = document.getElementById('musicaGhibli');
const btnMusica = document.getElementById('btnMusica');
btnMusica.addEventListener('click', () => {
    if (musica.paused) {
        musica.play();
        document.getElementById('iconoMusica').innerText = "🔊";
    } else {
        musica.pause();
        document.getElementById('iconoMusica').innerText = "muted";
    }
});

boton.addEventListener('click', () => mostrarAleatoria(todasLasPelis));

cargarContenido();
