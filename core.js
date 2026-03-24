const boton = document.getElementById('nuevaPeli');
const contenedorAleatorio = document.getElementById('peli-destacada');
const contenedorCatalogo = document.getElementById('peliculas-container');
const buscador = document.getElementById('buscador');
const btnMusica = document.getElementById('btnMusica');
const musica = document.getElementById('musicaGhibli');
const iconoMusica = document.getElementById('iconoMusica');

const urlGhibli = 'https://ghibliapi.vercel.app/films';
let todasLasPelis = []; 

function cargarContenido() {
    fetch(urlGhibli)
        .then(respuesta => respuesta.json())
        .then(datos => {
            todasLasPelis = datos; 
            mostrarCatalogo(todasLasPelis);
            mostrarAleatoria(todasLasPelis);

            boton.addEventListener('click', () => {
                mostrarAleatoria(todasLasPelis);
            });

            // Lógica del BUSCADOR
            buscador.addEventListener('input', (e) => {
                const texto = e.target.value.toLowerCase();
                const filtradas = todasLasPelis.filter(peli => 
                    peli.title.toLowerCase().includes(texto) || 
                    peli.director.toLowerCase().includes(texto)
                );
                mostrarCatalogo(filtradas);
            });

            intentarReproducir();
        })
        .catch(error => console.error("Error al conectar con la API:", error));
}

// Lógica de MÚSICA
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
        // Si el navegador bloquea el autoplay, ajustamos el botón visualmente
        iconoMusica.innerText = "🔈";
        btnMusica.classList.replace('btn-warning', 'btn-light');
    });
}

btnMusica.addEventListener('click', toggleMusica);

function mostrarCatalogo(peliculas) {
    contenedorCatalogo.innerHTML = "";
    peliculas.forEach(peli => {
        contenedorCatalogo.innerHTML += generarHTML(peli);
    });
}

function mostrarAleatoria(peliculas) {
    const indice = Math.floor(Math.random() * peliculas.length);
    const peliSuerte = peliculas[indice];
    contenedorAleatorio.innerHTML = generarHTML(peliSuerte);
}

function generarHTML(peli) {
    // Mofa para Castle in the Sky según tu README
    let titulo = peli.title;
    if(titulo === "Castle in the Sky") {
        titulo = "Laputa";
    }
    if(titulo === "The Wind Rises") {
        titulo = "Soy él, si ubiese escogido aviación";
    }
    
    if(titulo === "Grave of the Fireflies") {
        titulo = "Llore mucho :(";
    }
    if(titulo === "Spirited Away") {
        titulo = "Mis padres son unos cerdos y el negro es el malo";
    }
    if(titulo === "Porco Rosso") {
        titulo = "Es menor donde vas";
    }
     if(titulo === "Princess Mononoke") {
        titulo = "Solo con la izquierda";
    }
     if(titulo === "My Neighbor Totoro") {
        titulo = "Entiendelo, esta muerta";
    }
    if(titulo === "Howl's Moving Castle") {
        titulo = "Top mejores abuelas";
    }

    return `
        <div class="card" style="width: 18rem;">
            <img src="${peli.image}" class="card-img-top" alt="${titulo}">
            <div class="card-body">
                <h5 class="card-title text-dark">${titulo}</h5>
                <p class="card-text text-secondary">
                    <strong>Director:</strong> ${peli.director}<br>
                    <strong>Año:</strong> ${peli.release_date}<br>
                    <span class="badge bg-warning text-dark mt-2">Rating: ${peli.rt_score}%</span>
                </p>
            </div>
        </div>`;
}

cargarContenido();
