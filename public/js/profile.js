async function loadProfile() {
    try {
        const response = await fetch('/api/auth/session');
        const data = await response.json();

        if (!data.autenticado) {
            // Si no hay sesión, no puede ver su perfil
            window.location.href = 'login.html';
            return;
        }

        document.getElementById('profile-name').textContent = data.usuario.nombre;
        document.getElementById('profile-email').textContent = data.usuario.email;

    } catch (error) {
        console.error('Error al cargar el perfil:', error);
    }
}

loadProfile();

const logoutButton = document.getElementById('logout-button');

if (logoutButton) {
    logoutButton.addEventListener('click', async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            window.location.href = 'login.html';
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    });
}

const recommendForm = document.getElementById('recommend-form');

if (recommendForm) {
    recommendForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const titulo_libro = document.getElementById('book-title').value;
        const autor_libro = document.getElementById('book-author').value;
        const motivo = document.getElementById('recommend-reason').value;

        try {
            const response = await fetch('/api/recommendations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ titulo_libro, autor_libro, motivo })
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.error || 'No se pudo enviar la recomendación');
                return;
            }

            alert('¡Gracias! Tu recomendación fue enviada y será revisada.');
            recommendForm.reset();

        } catch (error) {
            console.error('Error al enviar la recomendación:', error);
        }
    });
}