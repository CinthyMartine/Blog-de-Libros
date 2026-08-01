async function checkSession() {
    try {
        const response = await fetch('/api/auth/session');
        const data = await response.json();

        const authItem = document.querySelector('.header__nav-item--auth');
        if (!authItem) return;

        if (data.autenticado) {
            const inicial = data.usuario.nombre.charAt(0).toUpperCase();

            authItem.innerHTML = `
                <a href="perfil.html" class="navbar-profile">
                    <span class="navbar-profile__avatar">${inicial}</span>
                    <span>Mi perfil</span>
                </a>
            `;
        }
        // Si no está autenticado, se deja el link "Iniciar sesión" que ya viene en el HTML

    } catch (error) {
        console.error('Error al verificar la sesión:', error);
    }
}

checkSession();