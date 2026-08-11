const commentsSection = document.getElementById('comments-section');
const bookId = commentsSection.dataset.bookId;

async function loadComments() {
    try {
        const response = await fetch(`/api/comments/${bookId}`);
        const comments = await response.json();

        const commentsList = document.getElementById('comments-list');
        const noComments = document.getElementById('no-comments');

        if (comments.length === 0) {
            noComments.style.display = 'block';
            return;
        }

        comments.forEach(comment => {
            const commentDiv = document.createElement('div');
            commentDiv.className = 'comment-item';
            commentDiv.innerHTML = `
                <p class="comment-item__author">${comment.usuario}</p>
                <p class="comment-item__text">${comment.texto}</p>
            `;
            commentsList.appendChild(commentDiv);
        });

    } catch (error) {
        console.error('Error al cargar los comentarios:', error);
    }
}

const commentForm = document.getElementById('comment-form');
commentForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const texto = document.getElementById('message').value;

    try {
        // Verificar que haya sesión iniciada
        const sessionResponse = await fetch('/api/auth/session');
        const sessionData = await sessionResponse.json();

        if (!sessionData.autenticado) {
            alert('Debes iniciar sesión para comentar');
            window.location.href = '../login.html';
            return;
        }

        // Enviar el comentario con el usuario real
        const response = await fetch('/api/comments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                texto: texto,
                libro_id: bookId,
                usuario_id: sessionData.usuario.id
            })
        });

        if (!response.ok) {
    const data = await response.json();
    alert(data.error || 'No se pudo guardar el comentario');
    return;
}

        commentForm.reset();
        location.reload();

    } catch (error) {
        console.error('Error al enviar el comentario:', error);
    }
});

loadComments();