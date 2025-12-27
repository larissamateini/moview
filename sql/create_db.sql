CREATE DATABASE IF NOT EXISTS moview_db;
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

-- 2. Atores e Diretores
CREATE TABLE IF NOT EXISTS atores_diretores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cargo ENUM('Ator', 'Diretor', 'Ambos') NOT NULL
);

-- 3. Conteúdos (Filmes e Séries)
CREATE TABLE IF NOT EXISTS conteudos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    sinopse TEXT,
    duracao VARCHAR(50),
    ano_lancamento INT,
    poster_path VARCHAR(255),
    tipo ENUM('Filme', 'Série') DEFAULT 'Filme'
);

-- 4. Reviews
CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    utilizador_id INT,
    conteudo_id INT,
    classificacao INT CHECK (classificacao BETWEEN 1 AND 5),
    critica TEXT,
    votos_utilidade INT DEFAULT 0,
    data_review TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (utilizador_id) REFERENCES utilizadores(id) ON DELETE CASCADE,
    FOREIGN KEY (conteudo_id) REFERENCES conteudos(id) ON DELETE CASCADE
);

-- 5. Favoritos 
CREATE TABLE IF NOT EXISTS favoritos (
    utilizador_id INT,
    conteudo_id INT,
    PRIMARY KEY (utilizador_id, conteudo_id),
    FOREIGN KEY (utilizador_id) REFERENCES utilizadores(id) ON DELETE CASCADE,
    FOREIGN KEY (conteudo_id) REFERENCES conteudos(id) ON DELETE CASCADE
);
