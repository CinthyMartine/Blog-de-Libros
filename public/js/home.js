async function loadFeaturedBooks() {
    try {
        const response = await fetch('/api/books');
        const books = await response.json();

        const container = document.getElementById('featured-books');

        if (books.length === 0) {
            container.innerHTML = '<p>Todavía no hay libros destacados.</p>';
            return;
        }

        books.forEach(book => {
            const card = document.createElement('div');
            card.className = 'book-card';
            card.innerHTML = `
    <a href="${book.pagina}">
        <img src="${book.portada_url}" alt="imagen del libro ${book.titulo}">
    </a>
    <a class="book-card__button" href="${book.pagina}">${book.titulo}</a>
`;
            container.appendChild(card);
        });

    } catch (error) {
        console.error('Error al cargar los libros destacados:', error);
    }
}

const searchForm = document.getElementById('search-form');

if (searchForm) {
    searchForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const query = document.getElementById('search-input').value.trim();
        if (!query) return;

        try {
            const response = await fetch(`/api/books/search?q=${encodeURIComponent(query)}`);
            const books = await response.json();

            const container = document.getElementById('featured-books');
            container.innerHTML = '';

            if (books.length === 0) {
                container.innerHTML = '<p>No se encontraron libros con esa búsqueda.</p>';
                return;
            }

            books.forEach(book => {
                const card = document.createElement('div');
                card.className = 'book-card';
                card.innerHTML = `
                    <a href="${book.pagina}">
                        <img src="${book.portada_url}" alt="imagen del libro ${book.titulo}">
                    </a>
                    <a class="book-card__button" href="${book.pagina}">${book.titulo}</a>
                `;
                container.appendChild(card);
            });

        } catch (error) {
            console.error('Error al buscar libros:', error);
        }
    });
}

loadFeaturedBooks();
