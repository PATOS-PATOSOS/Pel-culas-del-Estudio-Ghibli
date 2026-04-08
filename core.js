const boton = document.getElementById('nuevaPeli');
const contenedorAleatorio = document.getElementById('peli-destacada');
const contenedorCatalogo = document.getElementById('peliculas-container');
const contenedorFavoritos = document.getElementById('favoritos-container');
const buscador = document.getElementById('buscador');
const btnMusica = document.getElementById('btnMusica');
const musica = document.getElementById('musicaGhibli');

const urlGhibli = 'https://ghibliapi.vercel.app/films';
let todasLasPelis = []; 

// LÓGICA FAVORITOS
let favoritos = JSON.parse(localStorage.getItem('ghibli_favs')) || [];

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

function aplicarNombreMofa(title) {
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
    return mofas[title] || title;
}

// Función UNIFICADA para que la foto nunca cambie de estilo
function crearCard(peli, esFavorito) {
    const titulo = aplicarNombreMofa(peli.title);
    const btn = esFavorito 
        ? `<button class="btn btn-danger w-100" onclick="eliminarFavorito('${peli.id}')">Quitar</button>`
        : `<button class="btn btn-warning w-100 fw-bold" onclick="agregarFavorito('${peli.id}')">⭐ Favorita</button>`;

    return `
        <div class="col-md-4 d-flex justify-content-center mb-4">
            <div class="card shadow" style="width: 18rem;">
                <img src="${peli.image}" class="card-img-top" alt="Portada">
                <div class="card-body">
                    <h5 class="card-title">${titulo}</h5>
                    <p class="card-text small text-secondary">${peli.director} (${peli.release_date})</p>
                    ${btn}
                </div>
            </div>
        </div>`;
}

function mostrarCatalogo(lista) {
    contenedorCatalogo.innerHTML = "";
    lista.forEach(peli => contenedorCatalogo.innerHTML += crearCard(peli, false));
}

function mostrarFavoritos() {
    contenedorFavoritos.innerHTML = "";
    if (favoritos.length === 0) {
        contenedorFavoritos.innerHTML = "<p>No tienes favoritas guardadas.</p>";
        return;
    }
    favoritos.forEach(peli => contenedorFavoritos.innerHTML += crearCard(peli, true));
}

function mostrarAleatoria(lista) {
    const peli = lista[Math.floor(Math.random() * lista.length)];
    // AQUÍ: Usamos crearCard para que use la misma foto de portada (peli.image)
    contenedorAleatorio.innerHTML = crearCard(peli, false);
}

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

// Buscador e Interfaz
buscador.addEventListener('input', (e) => {
    const texto = e.target.value.toLowerCase();
    const filtradas = todasLasPelis.filter(p => 
        p.title.toLowerCase().includes(texto) || p.director.toLowerCase().includes(texto)
    );
    mostrarCatalogo(filtradas);
});

btnMusica.addEventListener('click', () => {
    if (musica.paused) { musica.play(); } else { musica.pause(); }
});

boton.addEventListener('click', () => mostrarAleatoria(todasLasPelis));

cargarContenido();
