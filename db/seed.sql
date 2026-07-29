-- AUTORES

INSERT INTO autores (nombre) VALUES
('Antoine de Saint-Exupéry'),
('Emily Brontë'),
('Carlos Ruiz Zafón'),
('John Katzenbach');

-- EDITORIALES

INSERT INTO editoriales (nombre) VALUES
('Salamandra'),
('Alianza Editorial'),
('Editorial Planeta'),
('Ediciones B');

-- GENEROS

INSERT INTO generos (nombre) VALUES
('Clásico'),
('Novela'),
('Misterio'),
('Thriller psicológico'),
('Infantil');

-- LIBROS

INSERT INTO libros (titulo, sinopsis, portada_url, autor_id, editorial_id)
SELECT
    'El principito',
    'Publicada en 1943, la historia de El Principito sigue estando a la orden del día convirtiéndose en un clásico indiscutible. En esta novela corta, Saint-Exupéry habla sobre la idiotez humana y la sabiduría que los niños dejan ir cuando crecen, a través de la historia de un aviador perdido en el desierto que conoce a un pequeño príncipe venido de otro planeta.',
    'Imagenes/El-principito.jpeg',
    (SELECT id FROM autores WHERE nombre = 'Antoine de Saint-Exupéry'),
    (SELECT id FROM editoriales WHERE nombre = 'Salamandra');

INSERT INTO libros (titulo, sinopsis, portada_url, autor_id, editorial_id)
SELECT
    'Cumbres Borrascosas',
    'Catherine y Heathcliff viven un amor intenso que se complica cuando Catherine decide no casarse con él por diferencias de clase social. Heathcliff se casa con otra mujer para vengarse, y desde ahí la historia gira en torno a la venganza y las pasiones. Publicada en 1847, es la única novela que escribió Emily Brontë.',
    'Imagenes/CumbresBorrascosas.jpg',
    (SELECT id FROM autores WHERE nombre = 'Emily Brontë'),
    (SELECT id FROM editoriales WHERE nombre = 'Alianza Editorial');

INSERT INTO libros (titulo, sinopsis, portada_url, autor_id, editorial_id)
SELECT
    'El prisionero del cielo',
    'La amistad entre Daniel y Fermín se revela como el corazón de esta novela, donde poco a poco salen a la luz secretos del pasado que afectan a todos los personajes. Carlos Ruiz Zafón logra que Barcelona sea casi un personaje más, con calles y rincones que dan vida a esta historia de misterio y secretos.',
    'Imagenes/ElPrisionerodelcielo.jpg.webp',
    (SELECT id FROM autores WHERE nombre = 'Carlos Ruiz Zafón'),
    (SELECT id FROM editoriales WHERE nombre = 'Editorial Planeta');

INSERT INTO libros (titulo, sinopsis, portada_url, autor_id, editorial_id)
SELECT
    'El psicoanalista',
    'Un thriller psicológico que combina suspenso con psicología, manteniendo la intriga constante de principio a fin. La narrativa mete de lleno en la mente de los personajes, con capítulos dinámicos que mantienen la tensión sin volverse confusos.',
    'Imagenes/el-psicoanalista.jpg',
    (SELECT id FROM autores WHERE nombre = 'John Katzenbach'),
    (SELECT id FROM editoriales WHERE nombre = 'Ediciones B');

-- LIBROS_GENEROS

-- El principito → Clásico, Infantil
INSERT INTO libros_generos (libro_id, genero_id)
SELECT l.id, g.id FROM libros l, generos g
WHERE l.titulo = 'El principito' AND g.nombre IN ('Clásico', 'Infantil');

-- Cumbres Borrascosas → Clásico, Novela
INSERT INTO libros_generos (libro_id, genero_id)
SELECT l.id, g.id FROM libros l, generos g
WHERE l.titulo = 'Cumbres Borrascosas' AND g.nombre IN ('Clásico', 'Novela');

-- El prisionero del cielo → Misterio, Novela
INSERT INTO libros_generos (libro_id, genero_id)
SELECT l.id, g.id FROM libros l, generos g
WHERE l.titulo = 'El prisionero del cielo' AND g.nombre IN ('Misterio', 'Novela');

-- El psicoanalista → Thriller psicológico, Misterio
INSERT INTO libros_generos (libro_id, genero_id)
SELECT l.id, g.id FROM libros l, generos g
WHERE l.titulo = 'El psicoanalista' AND g.nombre IN ('Thriller psicológico', 'Misterio');