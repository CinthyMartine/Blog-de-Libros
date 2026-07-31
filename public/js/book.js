// 1. Leer el "id" del libro desde la URL (ej. book.html?id=1)
const params = new URLSearchParams(window.location.search);
const bookId = params.get('id');

// 2. Pedir los datos del libro a la API
async function loadBook() {
    try {
        const response = await fetch(`/api/books/${bookId}`);

        if (!response.ok) {
            document.getElementById('book-title').textContent = 'Libro no encontrado';
            return;
        }

        const book = await response.json();

        // 3. Rellenar el HTML con los datos recibidos
        document.getElementById('book-title').textContent = book.titulo;
        document.getElementById('book-cover').src = book.portada_url;
        document.getElementById('book-cover').alt = book.titulo;
        document.getElementById('book-synopsis').innerHTML = `<p>${book.sinopsis}</p>`;
        document.getElementById('book-author').textContent = book.autor;
        document.getElementById('book-publisher').textContent = book.editorial;
        document.title = book.titulo;

    } catch (error) {
        console.error('Error al cargar el libro:', error);
    }
}

loadBook();