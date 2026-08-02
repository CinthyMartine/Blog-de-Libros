let opciones = { autores: [], editoriales: [], generos: [] };
let recomendacionSeleccionadaId = null;

async function loadOptions() {
    const response = await fetch('/api/admin/options');
    opciones = await response.json();

    const selects = [
        document.getElementById('new-book-autor'),
        document.getElementById('approve-autor')
    ];
    selects.forEach(select => {
        opciones.autores.forEach(a => {
            select.innerHTML += `<option value="${a.id}">${a.nombre}</option>`;
        });
    });

    const selectsEditorial = [
        document.getElementById('new-book-editorial'),
        document.getElementById('approve-editorial')
    ];
    selectsEditorial.forEach(select => {
        opciones.editoriales.forEach(e => {
            select.innerHTML += `<option value="${e.id}">${e.nombre}</option>`;
        });
    });

    const selectsGeneros = [
        document.getElementById('new-book-generos'),
        document.getElementById('approve-generos')
    ];
    selectsGeneros.forEach(select => {
        opciones.generos.forEach(g => {
            select.innerHTML += `<option value="${g.id}">${g.nombre}</option>`;
        });
    });
}

async function loadRecommendations() {
    try {
        const response = await fetch('/api/admin/recommendations');

        if (response.status === 401 || response.status === 403) {
            alert('No tienes permisos para ver esta página');
            window.location.href = '../index.html';
            return;
        }

        const recommendations = await response.json();
        const container = document.getElementById('recommendations-list');
        container.innerHTML = '';

        if (recommendations.length === 0) {
            container.innerHTML = '<p>No hay recomendaciones pendientes.</p>';
            return;
        }

        recommendations.forEach(rec => {
            const card = document.createElement('div');
            card.className = 'recommendation-admin-card';
            card.innerHTML = `
                <h3>${rec.titulo_libro}</h3>
                <p><strong>Autor sugerido:</strong> ${rec.autor_libro || 'No especificado'}</p>
                <p><strong>Motivo:</strong> ${rec.motivo}</p>
                <p><strong>Recomendado por:</strong> ${rec.recomendado_por}</p>
                <button class="auth-form__submit approve-btn" data-id="${rec.id}" data-titulo="${rec.titulo_libro}">Aprobar</button>
            `;
            container.appendChild(card);
        });

        document.querySelectorAll('.approve-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                recomendacionSeleccionadaId = btn.dataset.id;
                document.getElementById('approve-book-title').textContent = btn.dataset.titulo;
                document.getElementById('approve-titulo').value = btn.dataset.titulo;
                document.getElementById('approve-form-section').style.display = 'block';
                document.getElementById('approve-form-section').scrollIntoView({ behavior: 'smooth' });
            });
        });

    } catch (error) {
        console.error('Error al cargar recomendaciones:', error);
    }
}

// ---- Funciones auxiliares: resolver autor/editorial (seleccionado o nuevo) ----
async function resolverAutor(selectId, nuevoId) {
    const select = document.getElementById(selectId).value;
    const nuevo = document.getElementById(nuevoId).value.trim();

    if (nuevo) {
        const response = await fetch('/api/admin/authors', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre: nuevo })
        });
        const data = await response.json();
        return data.id;
    }

    return select;
}

async function resolverEditorial(selectId, nuevoId) {
    const select = document.getElementById(selectId).value;
    const nuevo = document.getElementById(nuevoId).value.trim();

    if (nuevo) {
        const response = await fetch('/api/admin/publishers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre: nuevo })
        });
        const data = await response.json();
        return data.id;
    }

    return select;
}

// ---- Formulario: aprobar recomendación ----
document.getElementById('approve-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const autorId = await resolverAutor('approve-autor', 'approve-autor-nuevo');
    const editorialId = await resolverEditorial('approve-editorial', 'approve-editorial-nuevo');

    if (!autorId || !editorialId) {
        alert('Debes seleccionar o escribir un autor y una editorial');
        return;
    }

    const generosSeleccionados = Array.from(document.getElementById('approve-generos').selectedOptions)
        .map(opt => opt.value);

    const datos = {
        titulo: document.getElementById('approve-titulo').value,
        autor_id: autorId,
        editorial_id: editorialId,
        generos: generosSeleccionados,
        portada_url: document.getElementById('approve-portada').value,
        pagina: document.getElementById('approve-pagina').value
    };

    try {
        const response = await fetch(`/api/admin/recommendations/${recomendacionSeleccionadaId}/approve`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.error || 'No se pudo aprobar la recomendación');
            return;
        }

        alert('¡Libro creado correctamente!');
        document.getElementById('approve-form-section').style.display = 'none';
        document.getElementById('approve-form').reset();
        loadRecommendations();

    } catch (error) {
        console.error('Error al aprobar:', error);
    }
});

// ---- Formulario: crear libro nuevo directamente ----
document.getElementById('new-book-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const autorId = await resolverAutor('new-book-autor', 'new-book-autor-nuevo');
    const editorialId = await resolverEditorial('new-book-editorial', 'new-book-editorial-nuevo');

    if (!autorId || !editorialId) {
        alert('Debes seleccionar o escribir un autor y una editorial');
        return;
    }

    const generosSeleccionados = Array.from(document.getElementById('new-book-generos').selectedOptions)
        .map(opt => opt.value);

    const datos = {
        titulo: document.getElementById('new-book-titulo').value,
        autor_id: autorId,
        editorial_id: editorialId,
        generos: generosSeleccionados,
        portada_url: document.getElementById('new-book-portada').value,
        pagina: document.getElementById('new-book-pagina').value,
        destacado: document.getElementById('new-book-destacado').checked
    };

    try {
        const response = await fetch('/api/admin/books', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.error || 'No se pudo crear el libro');
            return;
        }

        alert('¡Libro creado correctamente!');
        document.getElementById('new-book-form').reset();

    } catch (error) {
        console.error('Error al crear el libro:', error);
    }
});

loadOptions();
loadRecommendations();