const palabrasProhibidas = [
    'idiota',
    'estupido',
    'estúpido',
    'imbecil',
    'imbécil',
    'mierda',
    'pendejo',
    'puta',
    'puto'
];

function contieneLenguajeInapropiado(texto) {
    const textoMinuscula = texto.toLowerCase();
    return palabrasProhibidas.some(palabra => textoMinuscula.includes(palabra));
}

module.exports = { contieneLenguajeInapropiado };