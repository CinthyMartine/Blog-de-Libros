-- USUARIOS

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AUTORES

CREATE TABLE autores (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL
);

-- EDITORIALES

CREATE TABLE editoriales (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL
);

-- GENEROS

CREATE TABLE generos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

-- LIBROS

CREATE TABLE libros (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    sinopsis TEXT NOT NULL,
    portada_url VARCHAR(255),
    autor_id INTEGER REFERENCES autores(id),
    editorial_id INTEGER REFERENCES editoriales(id),
    recomendado_por INTEGER REFERENCES usuarios(id),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- LIBROS_GENEROS 

CREATE TABLE libros_generos (
    libro_id INTEGER REFERENCES libros(id),
    genero_id INTEGER REFERENCES generos(id),
    PRIMARY KEY (libro_id, genero_id)
);

-- COMENTARIOS

CREATE TABLE comentarios (
    id SERIAL PRIMARY KEY,
    texto TEXT NOT NULL,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id),
    libro_id INTEGER NOT NULL REFERENCES libros(id),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- RECOMENDACIONES

CREATE TABLE recomendaciones (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id),
    titulo_libro VARCHAR(200) NOT NULL,
    autor_libro VARCHAR(150),
    motivo TEXT NOT NULL,
    estado VARCHAR(20) DEFAULT 'pendiente',
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);