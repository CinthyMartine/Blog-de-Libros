let opciones = { autores: [], editoriales: [], generos: [] };
let recomendacionSeleccionadaId = null;

async function loadOptions() {
    const response = await fetch('/api/admin/options');
    opciones = await response.json();

    const selectAutor = document.getElementById('approve-autor');
    opciones.autores.forEach(a => {
        selectAutor.innerHTML += `<option value="${a.id}">${a.nombre}</option>`;
    });

    const selectEditorial = document.getElementById('approve-editorial');
    opciones.editoriales.forEach(e => {
        selectEditorial.innerHTML += `<option value="${e.id}">${e.nombre}</option>`;
    });

    const selectGeneros = document.getElementById('approve-generos');
    opciones.generos.forEach(g => {
        selectGeneros.innerHTML += `<option value="${g.id}">${g.nombre}</option>`;
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

        // Conectar los botones "Aprobar" recién creados
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

document.getElementById('approve-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const generosSeleccionados = Array.from(document.getElementById('approve-generos').selectedOptions)
        .map(opt => opt.value);

    const datos = {
        titulo: document.getElementById('approve-titulo').value,
        autor_id: document.getElementById('approve-autor').value,
        editorial_id: document.getElementById('approve-editorial').value,
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
        loadRecommendations(); // recargar la lista sin la que ya se aprobó

    } catch (error) {
        console.error('Error al aprobar:', error);
    }
});

loadOptions();
loadRecommendations();