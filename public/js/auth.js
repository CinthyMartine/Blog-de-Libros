const registerForm = document.getElementById('register-form');

if (registerForm) {
    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const nombre = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre, email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.error || 'No se pudo completar el registro');
                return;
            }

            // Mostrar el modal de éxito
            document.getElementById('success-modal').style.display = 'flex';

        } catch (error) {
            console.error('Error al registrarse:', error);
        }
    });
}

// Cerrar el modal y redirigir al hacer clic en "Continuar"
const modalCloseBtn = document.getElementById('modal-close-btn');
if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', () => {
        window.location.href = 'perfil.html';
    });
}

const loginForm = document.getElementById('login-form');

if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.error || 'No se pudo iniciar sesión');
                return;
            }

            if (data.es_admin) {
                window.location.href = 'admin/dashboard.html';
            } else {
                window.location.href = 'perfil.html';
            }

        } catch (error) {
            console.error('Error al iniciar sesión:', error);
        }
    });
}