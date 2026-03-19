// Referencias a los elementos del DOM (Basado en tu recetas.js)
const boton = document.getElementById('nuevaPeli');
const contenedorAleatorio = document.getElementById('peli-destacada');
const contenedorCatalogo = document.getElementById('peliculas-container');
const urlGhibli = 'https://ghibliapi.vercel.app/films';

function cargarContenido() {
    fetch(urlGhibli)
        .then(respuesta => respuesta.json()) // Conversión a JSON
        .then(datos => {
            // Pintar catálogo completo usando forEach (Requisito Rúbrica)
            mostrarCatalogo(datos);
            
            // Pintar una inicial aleatoria
            mostrarAleatoria(datos);

            // Evento para el botón de "Nueva peli"
            boton.addEventListener('click', () => {
                mostrarAleatoria(datos);
            });
        })
        .catch(error => console.error("Error al conectar con la API:", error));
}

// Recorrido de datos (Basado en tu código original)
function mostrarCatalogo(peliculas) {
    contenedorCatalogo.innerHTML = "";
    peliculas.forEach(peli => {
        contenedorCatalogo.innerHTML += generarHTML(peli);
    });
}

// Función para peli aleatoria
function mostrarAleatoria(peliculas) {
    const indice = Math.floor(Math.random() * peliculas.length);
    const peliSuerte = peliculas[indice];
    contenedorAleatorio.innerHTML = generarHTML(peliSuerte);
}

// Creación dinámica del HTML (Estructura de tu tarjeta original)
function generarHTML(peli) {
    return `
        <div class="card" style="width: 18rem;">
            <img src="${peli.image}" class="card-img-top" alt="${peli.title}">
            <div class="card-body">
                <h5 class="card-title text-dark">${peli.title}</h5>
                <p class="card-text text-secondary">
                    <strong>Director:</strong> ${peli.director}<br>
                    <strong>Año:</strong> ${peli.release_date}<br>
                    <span class="badge bg-warning text-dark mt-2">Rating: ${peli.rt_score}%</span>
                </p>
            </div>
        </div>`;
}

// Llamada inicial
cargarContenido();