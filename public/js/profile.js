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