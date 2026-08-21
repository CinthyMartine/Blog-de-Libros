//  Mostrar la lista de géneros (categorías)
async function loadGenreList() {
    const container = document.getElementById('genre-list');
    if (!container) return;

    try {
        const response = await fetch('/api/genres');
        const genres = await response.json();

        genres.forEach(genre => {
            const card = document.createElement('div');
            card.className = 'book-card';
            card.innerHTML = `
                <a href="#" class="book-card__button genre-link" data-id="${genre.id}" data-nombre="${genre.nombre}">${genre.nombre}</a>
            `;
            container.appendChild(card);
        });

        document.querySelectorAll('.genre-link').forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                showGenreBooks(link.dataset.id, link.dataset.nombre);
            });
        });

    } catch (error) {
        console.error('Error al cargar géneros:', error);
    }
}

// Mostrar los libros de un género específico
async function showGenreBooks(genreId, genreName) {
    try {
        const response = await fetch(`/api/books/by-genre/${genreId}`);
        const books = await response.json();

        document.getElementById('genre-results-title').textContent = `Libros de género: ${genreName}`;

        const container = document.getElementById('genre-books-list');
        container.innerHTML = '';

        if (books.length === 0) {
            container.innerHTML = '<p>Todavía no hay libros en esta categoría.</p>';
        } else {
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
        }

        document.getElementById('genre-results').style.display = 'block';
        document.getElementById('genre-results').scrollIntoView({ behavior: 'smooth' });

    } catch (error) {
        console.error('Error al cargar libros del género:', error);
    }
}

// Editoriales
async function loadPublisherList() {
    const container = document.getElementById('publisher-list');
    if (!container) return;

    try {
        const response = await fetch('/api/publishers');
        const publishers = await response.json();

        publishers.forEach(publisher => {
            const card = document.createElement('div');
            card.className = 'book-card';
            card.innerHTML = `
                <a href="#" class="book-card__button publisher-link" data-id="${publisher.id}" data-nombre="${publisher.nombre}">${publisher.nombre}</a>
            `;
            container.appendChild(card);
        });

        document.querySelectorAll('.publisher-link').forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                showPublisherBooks(link.dataset.id, link.dataset.nombre);
            });
        });

    } catch (error) {
        console.error('Error al cargar editoriales:', error);
    }
}

async function showPublisherBooks(publisherId, publisherName) {
    try {
        const response = await fetch(`/api/books/by-publisher/${publisherId}`);
        const books = await response.json();

        document.getElementById('publisher-results-title').textContent = `Libros de editorial: ${publisherName}`;

        const container = document.getElementById('publisher-books-list');
        container.innerHTML = '';

        if (books.length === 0) {
            container.innerHTML = '<p>Todavía no hay libros de esta editorial.</p>';
        } else {
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
        }

        document.getElementById('publisher-results').style.display = 'block';
        document.getElementById('publisher-results').scrollIntoView({ behavior: 'smooth' });

    } catch (error) {
        console.error('Error al cargar libros de la editorial:', error);
    }
}

// Autores
async function loadAuthorList() {
    const container = document.getElementById('author-list');
    if (!container) return;

    try {
        const response = await fetch('/api/authors');
        const authors = await response.json();

        authors.forEach(author => {
            const card = document.createElement('div');
            card.className = 'book-card';
            card.innerHTML = `
                <a href="#" class="book-card__button author-link" data-id="${author.id}" data-nombre="${author.nombre}">${author.nombre}</a>
            `;
            container.appendChild(card);
        });

        document.querySelectorAll('.author-link').forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                showAuthorBooks(link.dataset.id, link.dataset.nombre);
            });
        });

    } catch (error) {
        console.error('Error al cargar autores:', error);
    }
}

async function showAuthorBooks(authorId, authorName) {
    try {
        const response = await fetch(`/api/books/by-author/${authorId}`);
        const books = await response.json();

        document.getElementById('author-results-title').textContent = `Libros de: ${authorName}`;

        const container = document.getElementById('author-books-list');
        container.innerHTML = '';

        if (books.length === 0) {
            container.innerHTML = '<p>Todavía no hay libros de este autor.</p>';
        } else {
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
        }

        document.getElementById('author-results').style.display = 'block';
        document.getElementById('author-results').scrollIntoView({ behavior: 'smooth' });

    } catch (error) {
        console.error('Error al cargar libros del autor:', error);
    }
}

// Si la URL trae un id (ej. editorial.html?id=1), mostrar esos libros automáticamente
const params = new URLSearchParams(window.location.search);
const idDesdeUrl = params.get('id');

if (idDesdeUrl) {
    if (document.getElementById('publisher-list')) {
        fetch('/api/publishers')
            .then(res => res.json())
            .then(publishers => {
                const publisher = publishers.find(p => p.id == idDesdeUrl);
                if (publisher) {
                    showPublisherBooks(publisher.id, publisher.nombre);
                }
            });
    }

    if (document.getElementById('author-list')) {
        fetch('/api/authors')
            .then(res => res.json())
            .then(authors => {
                const author = authors.find(a => a.id == idDesdeUrl);
                if (author) {
                    showAuthorBooks(author.id, author.nombre);
                }
            });
    }
}

loadGenreList();
loadPublisherList();
loadAuthorList();