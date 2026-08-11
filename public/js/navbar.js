async function checkSession() {
    try {
        const response = await fetch('/api/auth/session');
        const data = await response.json();

        const authItem = document.querySelector('.header__nav-item--auth');
        if (!authItem) return;

        if (data.autenticado) {
            const inicial = data.usuario.nombre.charAt(0).toUpperCase();
            const destino = data.usuario.es_admin ? 'admin/dashboard.html' : 'perfil.html';
            const texto = data.usuario.es_admin ? 'Panel admin' : 'Mi perfil';

            authItem.innerHTML = `
                <a href="${destino}" class="navbar-profile">
                    <span class="navbar-profile__avatar">${inicial}</span>
                    <span>${texto}</span>
                </a>
            `;
        }

    } catch (error) {
        console.error('Error al verificar la sesión:', error);
    }
}

checkSession();