const boton = document.getElementById('nuevaPeli');
const contenedorAleatorio = document.getElementById('peli-destacada');
const contenedorCatalogo = document.getElementById('peliculas-container');
const contenedorFavoritos = document.getElementById('favoritos-container');
const buscador = document.getElementById('buscador');

const urlGhibli = 'https://ghibliapi.vercel.app/films';
let todasLasPelis = []; 

// --- LÓGICA DE FAVORITOS (COMO EN RECETAS) ---
let favoritos = JSON.parse(localStorage.getItem('ghibli_favoritos')) || [];

function cargarContenido() {
    fetch(urlGhibli)
        .then(res => res.json())
        .then(datos => {
            todasLasPelis = datos; 
            mostrarCatalogo(todasLasPelis);
            mostrarAleatoria(todasLasPelis);
            mostrarFavoritos(); 
        });
}

// Función para tus nombres "Mofas"
function obtenerNombreMofa(originalTitle) {
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

// Añadir a favoritos
function agregarFavorito(id) {
    const peli = todasLasPelis.find(p => p.id === id);
    if (!favoritos.some(f => f.id === id)) {
        favoritos.push(peli);
        localStorage.setItem('ghibli_favoritos', JSON.stringify(favoritos));
        mostrarFavoritos();
    }
}

// Quitar de favoritos
function eliminarFavorito(id) {
    favoritos = favoritos.filter(f => f.id !== id);
    localStorage.setItem('ghibli_favoritos', JSON.stringify(favoritos));
    mostrarFavoritos();
}

// Pintar la sección de favoritos
function mostrarFavoritos() {
    contenedorFavoritos.innerHTML = "";
    if (favoritos.length === 0) {
        contenedorFavoritos.innerHTML = "<p class='text-muted'>No tienes pelis favoritas aún.</p>";
        return;
    }
    favoritos.forEach(peli => {
        const titulo = obtenerNombreMofa(peli.title);
        contenedorFavoritos.innerHTML += `
            <div class="col-md-3">
                <div class="card shadow-sm border-warning">
                    <img src="${peli.image}" class="card-img-top" style="height: 150px; object-fit: cover;">
                    <div class="card-body p-2">
                        <h6 class="fw-bold text-dark small">${titulo}</h6>
                        <button class="btn btn-danger btn-sm w-100" onclick="eliminarFavorito('${peli.id}')">Quitar</button>
                    </div>
                </div>
            </div>`;
    });
}

// Catálogo general
function mostrarCatalogo(lista) {
    contenedorCatalogo.innerHTML = "";
    lista.forEach(peli => {
        const titulo = obtenerNombreMofa(peli.title);
        contenedorCatalogo.innerHTML += `
            <div class="col-md-4 d-flex justify-content-center">
                <div class="card shadow" style="width: 18rem; margin-bottom: 20px;">
                    <img src="${peli.image}" class="card-img-top" alt="${titulo}">
                    <div class="card-body">
                        <h5 class="card-title text-dark">${titulo}</h5>
                        <p class="card-text text-dark small">Director: ${peli.director}<br>Año: ${peli.release_date}</p>
                        <button class="btn btn-warning w-100 fw-bold" onclick="agregarFavorito('${peli.id}')">⭐ Favorita</button>
                    </div>
                </div>
            </div>`;
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
    contenedorAleatorio.innerHTML = `
        <div class="card shadow" style="width: 20rem;">
            <img src="${peli.movie_banner}" class="card-img-top">
            <div class="card-body">
                <h6>${obtenerNombreMofa(peli.title)}</h6>
                <button class="btn btn-sm btn-outline-warning" onclick="agregarFavorito('${peli.id}')">Añadir a favs</button>
            </div>
        </div>`;
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
