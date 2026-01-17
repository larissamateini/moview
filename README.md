# 🎬 moview

**moview** é uma aplicação web de Programação e Integração de Serviços (PIS) focada na exploração de conteúdos cinematográficos. A plataforma permite pesquisar filmes e séries, gerir listas personalizadas, criar favoritos e partilhar opiniões através de reviews interativas.

---

## 🚀 Funcionalidades Principal

### 🍿 Exploração de Conteúdos
* **Integração com TMDB API:** Consumo de dados em tempo real sobre filmes, séries, elenco e trailers.
* **Pesquisa Avançada:** Filtros por nome e géneros dinâmicos.
* **Página de Detalhes:** Visualização de sinopses, duração, classificação e trailers do YouTube.

### 👤 Área do Utilizador
* **Autenticação:** Sistema de Login e Registo de conta.
* **Favoritos:** Sistema "one-click" para guardar conteúdos (via Fetch API).
* **Gestão de Listas:** Criação e edição de listas personalizadas (ex: "Para ver no fim de semana").
* **Reviews:** Publicação de críticas com notas de 1 a 10 e sistema de "Votos de Utilidade" (Thumbs Up) dinâmico.

### 🛠️ Backoffice (Admin)
* **Gestão de Conteúdos:** Controlo de reviews e utilizadores.
* **Monitorização:** Visualização de dados cacheados na base de dados local.

---

## 🛠️ Tecnologias Utilizadas

* **Backend:** Node.js com Express.
* **Frontend:** Mustache.js (Templating Engine).
* **Estilização:** CSS3 com variáveis customizadas (Design System próprio).
* **Base de Dados:** MySQL 8.0.
* **API Externa:** [The Movie Database (TMDB)](https://www.themoviedb.org/).
* **Comunicação:** Fetch API para interações assíncronas (likes/favoritos).

---

## ⚙️ Configuração do Projeto

### 1. Pré-requisitos
* Node.js instalado.
* Servidor MySQL ativo.
* Uma conta no TMDB para obter uma `API_KEY`.

### 2. Instalação
1. Clone o repositório:
   ```bash
   git clone [https://github.com/teu-utilizador/moview.git](https://github.com/teu-utilizador/moview.git)
