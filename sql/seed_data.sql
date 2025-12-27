USE moview_db;

-- Criar um Admin e um User (Password em plain text para teste, deves usar hash depois)
INSERT INTO utilizadores (name, username, email, password, role) VALUES 
('Administrador', 'admin', 'admin@moview.com', 'admin123', 'admin'),
('João Silva', 'joaosilva', 'joao@email.com', 'user123', 'user');

-- Staff
INSERT INTO atores_diretores (nome, cargo) VALUES 
('Christopher Nolan', 'Diretor'),
('Cillian Murphy', 'Ator'),
('Greta Gerwig', 'Diretor');

-- Conteúdos
INSERT INTO conteudos (nome, sinopse, duracao, ano_lancamento, tipo) VALUES 
('Oppenheimer', 'A história do físico J. Robert Oppenheimer.', '180 min', 2023, 'Filme'),
('Barbie', 'Barbie vive na Barbieland.', '114 min', 2023, 'Filme'),
('Succession', 'A disputa pelo império de mídia da família Roy.', '60 min por ep', 2018, 'Série');

-- Reviews iniciais
INSERT INTO reviews (utilizador_id, conteudo_id, classificacao, critica, votos_utilidade) VALUES 
(2, 1, 5, 'Obra prima visual!', 12);