USE moview_db;

-- 1. Utilizadores (Password é '123456' em hash simulado ou texto simples conforme o teu sistema)
INSERT INTO utilizadores (name, username, email, password, role) VALUES 
('Admin Moview', 'admin', 'admin@moview.com', 'admin123', 'admin'),
('João Silva', 'joaosilva', 'joao@email.com', 'user123', 'user'),
('Maria Santos', 'mariass', 'maria@email.com', 'user123', 'user');

-- 2. Conteúdos (Simulando cache da API TMDB)
INSERT INTO conteudos (tmdb_id, nome, sinopse, duracao, ano_lancamento, poster_path, tipo) VALUES 
(550, 'Fight Club', 'Um trabalhador de escritório insone e um fabricante de sabão desleixado formam um clube de luta underground.', '139', 1999, '/pB8BfsunD1Zid60vBKpYmS0P8YV.jpg', 'movie'),
(157336, 'Interstellar', 'Uma equipa de exploradores viaja através de um buraco de minhoca no espaço para garantir a sobrevivência da humanidade.', '169', 2014, '/gEU2QniE6E77NI6vCU6m7jBPCO.jpg', 'movie'),
(1396, 'Breaking Bad', 'Um professor de química do ensino secundário diagnosticado com cancro do pulmão inoperável vira-se para o fabrico de metanfetaminas.', '45', 2008, '/ggGT0eFp99v99696U79U7U9U.jpg', 'tv');

-- 3. Géneros
INSERT INTO generos (nome) VALUES ('Drama'), ('Ficção Científica'), ('Crime'), ('Ação');

-- 4. Associação Conteúdo-Género
INSERT INTO conteudo_generos (conteudo_id, genero_id) VALUES 
(1, 1), (1, 4), -- Fight Club: Drama, Ação
(2, 2), (2, 1), -- Interstellar: Ficção Científica, Drama
(3, 3), (3, 1); -- Breaking Bad: Crime, Drama

-- 5. Listas de Utilizadores
INSERT INTO listas (nome, descricao, publica, utilizador_id) VALUES 
('Favoritos de Sempre', 'Os filmes que marcaram a minha vida.', TRUE, 2),
('Para ver no Fim de Semana', 'Maratona de séries e ficção.', FALSE, 3);

-- 6. Conteúdos nas Listas
INSERT INTO lista_conteudos (lista_id, conteudo_id) VALUES 
(1, 1), (1, 2), -- João adicionou Fight Club e Interstellar
(2, 3);         -- Maria adicionou Breaking Bad

-- 7. Reviews
INSERT INTO reviews (utilizador_id, conteudo_id, classificacao, critica, votos_utilidade) VALUES 
(2, 1, 10, 'Uma obra-prima absoluta sobre a sociedade de consumo. Brad Pitt está fantástico.', 5),
(3, 2, 9, 'Visualmente deslumbrante e emocionalmente pesado. A banda sonora do Hans Zimmer é 10/10.', 12),
(2, 3, 10, 'A melhor série alguma vez feita. O arco do Walter White é perfeito.', 3);

-- 8. Favoritos
INSERT INTO favoritos (utilizador_id, conteudo_id) VALUES 
(2, 1), (2, 2), (3, 3);

-- 9. Atores e Diretores
INSERT INTO atores_diretores (name, role) VALUES 
('David Fincher', 'Diretor'),
('Christopher Nolan', 'Diretor'),
('Matthew McConaughey', 'Ator'),
('Bryan Cranston', 'Ator'),
('Edward Norton', 'Ator');

-- 10. Elenco e Direção nos Conteúdos
INSERT INTO elenco_conteudo (conteudo_id, ator_diretor_id, role_no_filme) VALUES 
(1, 1, 'Diretor'),
(1, 5, 'The Narrator'),
(2, 2, 'Diretor'),
(2, 3, 'Cooper'),
(3, 4, 'Walter White');