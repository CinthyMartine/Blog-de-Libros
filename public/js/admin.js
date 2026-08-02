async function loadRecommendations() {
    try {
        const response = await fetch('/api/admin/recommendations');

        if (response.status === 401 || response.status === 403) {
            alert('No tienes permisos para ver esta página');
            window.location.href = '../dashboard.html';
            return;
        }

        const recommendations = await response.json();
        const container = document.getElementById('recommendations-list');

        if (recommendations.length === 0) {
            container.innerHTML = '<p>No hay recomendaciones pendientes.</p>';
            return;
        }

        recommendations.forEach(rec => {
            const card = document.createElement('div');
            card.className = 'recommendation-admin-card';
            card.innerHTML = `
                <h3>${rec.titulo_libro}</h3>
                <p><strong>Autor:</strong> ${rec.autor_libro || 'No especificado'}</p>
                <p><strong>Motivo:</strong> ${rec.motivo}</p>
                <p><strong>Recomendado por:</strong> ${rec.recomendado_por}</p>
            `;
            container.appendChild(card);
        });

    } catch (error) {
        console.error('Error al cargar recomendaciones:', error);
    }
}

loadRecommendations();