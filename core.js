/* Estilos Generales */
body {
    font-family: 'Montserrat', sans-serif;
    text-align: center;
    background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('IMG1.jpg');
    background-size: cover;
    background-attachment: fixed;
    background-position: center;
    background-repeat: no-repeat;
    min-height: 100vh;
    color: white;
}

h1, h2, h3, .card-title, .intro-titulo {
    font-family: 'Quicksand', sans-serif;
    font-weight: 700;
}

.text-white.shadow-lg {
    text-shadow: 3px 3px 8px rgba(0,0,0,0.8);
}

/* Buscador Estilizado */
#buscador {
    border-radius: 30px;
    border: 3px solid #ffc107;
    padding: 12px 25px;
}

/* Botón Música */
#btnMusica {
    width: 50px;
    height: 50px;
    font-size: 1.4rem;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Sección de Intro */
.intro-titulo {
    color: #2c3e50;
    border-left: 5px solid #ffc107;
    padding-left: 15px;
}

.intro-texto {
    font-size: 1.1rem;
    color: #333;
    line-height: 1.6;
}

/* SECCIÓN DE FAVORITOS */
#seccion-favoritos {
    border: 3px solid #ffc107;
    background-color: rgba(248, 249, 250, 0.9);
}

/* TARJETAS (Donde está el cambio de la imagen) */
.card {
    margin: 15px;
    border: none;
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 10px 25px rgba(0,0,0,0.4);
    transition: transform 0.3s ease;
    background-color: white;
}

.card:hover {
    transform: translateY(-10px);
}

/* CAMBIO CLAVE: Aquí es donde evitamos que la imagen se corte */
.card-img-top {
    height: 350px;       /* Altura fija para que todas las tarjetas midan igual */
    object-fit: contain; /* CAMBIO: "contain" hace que la imagen se vea ENTERA */
    background-color: #f0f0f0; /* Fondo gris suave por si la imagen es estrecha */
    padding: 10px;       /* Un poco de aire para que no pegue a los bordes */
}

.card-body {
    background-color: #ffffff;
    padding: 1.25rem;
}

/* Botones de las tarjetas */
.btn-warning {
    background-color: #ffc107;
    border: none;
    color: #000;
}

.btn-danger {
    background-color: #dc3545;
    border: none;
}

/* Separador */
hr.border-white {
    opacity: 0.5;
    border-width: 2px;
}
