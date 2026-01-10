DROP DATABASE IF EXISTS moview_db;
CREATE DATABASE moview_db;
USE moview_db;

-- 1. Utilizadores
CREATE TABLE IF NOT EXISTS utilizadores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Conteúdos (Filmes e Séries - Cache Local)
CREATE TABLE IF NOT EXISTS conteudos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tmdb_id INT UNIQUE NOT NULL, -- ID original da API (TMDB)
    nome VARCHAR(150) NOT NULL,
    sinopse TEXT,
    duracao VARCHAR(50),
    ano_lancamento INT,
    poster_path VARCHAR(255),
    backdrop_path VARCHAR(255),
    tipo ENUM('movie', 'tv') DEFAULT 'movie',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Listas
CREATE TABLE IF NOT EXISTS listas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    publica BOOLEAN DEFAULT TRUE,
    utilizador_id INT NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (utilizador_id) REFERENCES utilizadores(id) ON DELETE CASCADE
);

-- 4. Conteúdos nas Listas
CREATE TABLE IF NOT EXISTS lista_conteudos (
    lista_id INT NOT NULL,
    conteudo_id INT NOT NULL,
    adicionado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (lista_id, conteudo_id),
    FOREIGN KEY (lista_id) REFERENCES listas(id) ON DELETE CASCADE,
    FOREIGN KEY (conteudo_id) REFERENCES conteudos(id) ON DELETE CASCADE
);

-- 5. Favoritos
CREATE TABLE IF NOT EXISTS favoritos (
    utilizador_id INT NOT NULL,
    conteudo_id INT NOT NULL,
    adicionado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (utilizador_id, conteudo_id),
    FOREIGN KEY (utilizador_id) REFERENCES utilizadores(id) ON DELETE CASCADE,
    FOREIGN KEY (conteudo_id) REFERENCES conteudos(id) ON DELETE CASCADE
);

-- 6. Reviews
CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    utilizador_id INT NOT NULL,
    conteudo_id INT NOT NULL,
    classificacao INT CHECK (classificacao BETWEEN 1 AND 10),
    critica TEXT,
    votos_utilidade INT DEFAULT 0,
    data_review TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (utilizador_id) REFERENCES utilizadores(id) ON DELETE CASCADE,
    FOREIGN KEY (conteudo_id) REFERENCES conteudos(id) ON DELETE CASCADE,
    UNIQUE KEY unique_review (utilizador_id, conteudo_id)
);

-- 7. Géneros
CREATE TABLE IF NOT EXISTS generos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS conteudo_generos (
    conteudo_id INT NOT NULL,
    genero_id INT NOT NULL,
    PRIMARY KEY (conteudo_id, genero_id),
    FOREIGN KEY (conteudo_id) REFERENCES conteudos(id) ON DELETE CASCADE,
    FOREIGN KEY (genero_id) REFERENCES generos(id) ON DELETE CASCADE
);

-- 8. Atores e Diretores
CREATE TABLE IF NOT EXISTS atores_diretores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    role ENUM('Ator', 'Diretor') NOT NULL
);

CREATE TABLE IF NOT EXISTS elenco_conteudo (
    conteudo_id INT NOT NULL,
    ator_diretor_id INT NOT NULL,
    role_no_filme VARCHAR(100), -- Ex: "Personagem X" ou "Diretor"
    PRIMARY KEY (conteudo_id, ator_diretor_id),
    FOREIGN KEY (conteudo_id) REFERENCES conteudos(id) ON DELETE CASCADE,
    FOREIGN KEY (ator_diretor_id) REFERENCES atores_diretores(id) ON DELETE CASCADE
);
