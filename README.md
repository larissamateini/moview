# 🎬 moview

> **O cinema na palma da sua mão.**

O **moview** é uma aplicação web desenvolvida para a unidade curricular de **Programação e Integração de Serviços (PIS)**. A plataforma permite aos utilizadores explorarem um vasto catálogo de filmes e séries, gerirem listas personalizadas e partilharem opiniões através de um sistema de reviews dinâmico, utilizando dados em tempo real da TMDB API. Além disso, permite que administradores possam gerir os conteúdos da plataforma no backoffice.

<p align="center">
  <a href="#pages">📑 Páginas</a> •
  <a href="#tech">🛠️ Informações Técnicas</a> •
  <a href="#features">🚀 Funcionalidades</a> •
  <a href="#structure">📂 Estrutura</a> •
  <a href="#execute">📥 Importação</a>
</p>

---

## <a id="pages"></a>📑 Páginas
[Mockups - Figma](https://www.figma.com/design/8sLoGJ0VaT3iHy5kyg7wM9/projeto_PIS?node-id=0-1&t=CVtlS7SzM8H0djiw-1)

### **Login e Registo**: Acesso à plataforma e criação de conta

<p align="center">
   <img width="48%" alt="1_signup" src="https://github.com/user-attachments/assets/c989d7f8-5b34-4da8-ac68-465a9d4a4292" />
   <img width="48%" alt="2_login" src="https://github.com/user-attachments/assets/57d7ac3a-bea3-4a8d-a7a1-c5d418775b3d" />
</p>

### 👤 Utilizador Comum - FrontOffice

#### 1. **Homepage** e **Search**: Exploração de tendências e filtros por género

<p align="center">
   <img width="45%" alt="3_homepage" src="https://github.com/user-attachments/assets/c7efe76f-3393-4ad6-8fb5-aaf7fb897eef" />
   <img width="45%" alt="4_homepage_filter" src="https://github.com/user-attachments/assets/048aa37d-9a55-4547-ba0f-6c1845ae9bfd" />
</p>

#### 2. **Details**: Detalhes técnicos, trailers e feedback da comunidade (reviews)

<p align="center">
   <img width="45%" alt="5_details" src="https://github.com/user-attachments/assets/e56c7b67-a54f-47bb-b49e-1d9319e8fbe3" />
   <img width="45" alt="18_reviews" src="https://github.com/user-attachments/assets/b71f92cc-c6bd-4363-a46e-8739ff6e9c95" />
</p>

#### 3. **Favorites** e **Reviews**: Lista pessoal de conteúdos favoritos e criação de avaliações

<p align="center">
   <img width="45%" alt="19_favorites" src="https://github.com/user-attachments/assets/8a4497e0-a0a0-46c4-ae62-655d9d407fc3" />
   <img width="45%" alt="22_post_review" src="https://github.com/user-attachments/assets/e1450cff-6a19-438a-ac1c-c31257038254" />
</p>

#### 4. **Lists**: Organização pessoal de conteúdos

<p align="center">
   <img width="45%" alt="20_lists" src="https://github.com/user-attachments/assets/dd1c8177-e559-41be-973c-cc42519aae1e" />
   <img width="45%" alt="21_lists_details" src="https://github.com/user-attachments/assets/8f6a20b3-7bd2-4fd5-9ed9-fbef9b0b7c2e" />
   <img width="70%" alt="23_create_list" src="https://github.com/user-attachments/assets/96fb91b9-1588-402e-bf67-e79a8a2b66da" />
</p>

#### 5. **Profile**: Perfil pessoal

<p align="center">
   <img width="70%" alt="10_profile_logout" src="https://github.com/user-attachments/assets/ec693e0e-e8fd-4abf-ba24-26345e054bdc" />
   
</p>

### 🛡️ Utilizador Administrador - BackOffice

#### 1. **Contents**: Página de administração da tabela de conteúdos

<p align="center">
   <img width="45%" alt="11_b_conteudos" src="https://github.com/user-attachments/assets/eabf9270-977d-4f37-b741-7498fced3672" />
   <img width="45%" alt="12_b_conteudos-edit" src="https://github.com/user-attachments/assets/11cabe12-0f6c-46dc-aac4-d0204a85f2e8" />
</p>

#### 2. **Users**: Página de administração da tabela de utilizadores

<p align="center">
   <img width="50%" alt="13_b_utilizadores" src="https://github.com/user-attachments/assets/c9ee70e8-8c89-4188-8f62-0838ada8f459" />
</p>

#### 3. **Reviews**: Página de moderação das avaliações

<p align="center">
   <img width="50%" alt="14_b_reviews" src="https://github.com/user-attachments/assets/6a92124d-964e-4422-b2e1-f9c0cc5edf14" />
</p>

#### 4. **Actor & Director**: Página de administração da tabela de atores e diretores

<p align="center">
   <img width="45%" alt="15_b_atores-diretores" src="https://github.com/user-attachments/assets/d196a98e-208a-452f-969d-a01762050564" />
   <img width="48%" alt="16_b_atores-diretores-add" src="https://github.com/user-attachments/assets/58c78c5f-20c4-4512-b54a-4b94ba8b03d6" />
</p>

---

## <a id="tech"></a>🛠️ Informações Técnicas

### Stack Tecnológica
* **Ambiente Runtime:** Node.js
* **Framework Web:** Express.js
* **Motor de Templates:** Mustache.js
* **Base de Dados:** MySQL 8.0
* **Estilização:** CSS3 (Variables, Flexbox & Grid)

### Bibliotecas Externas (Dependencies)
| Biblioteca | Finalidade | Licença |
| :--- | :--- | :--- |
| **mysql2** | Driver de ligação à base de dados MySQL com suporte a Promises. | [MIT](https://opensource.org/licenses/MIT) |
| **dotenv** | Gestão de variáveis de ambiente (API Keys, DB Config). | [MIT](https://opensource.org/licenses/MIT) |
| **express-session** | Gestão de sessões de utilizador e autenticação. | [MIT](https://opensource.org/licenses/MIT) |
| **bcryptjs** | Encriptação de passwords para segurança na base de dados. | [MIT](https://opensource.org/licenses/MIT) |

---

## <a id="features"></a>🚀 Funcionalidades Principais

* **Autenticação Segura:** Sistema de login e registo com encriptação de dados e proteção de rotas.
* **Integração com TMDB API:** Consumo de dados dinâmicos sobre filmes e séries, incluindo posters, trailers e elenco.
* **Sistema de Reviews:** Possibilidade de avaliar conteúdos (1-10) e deixar críticas textuais.
* **Interação Social (Thumbs Up):** Sistema de votos de utilidade em reviews de outros utilizadores via Fetch API.
* **Gestão de Listas:** Criação de coleções personalizadas com adição/remoção dinâmica de itens.
* **Cache Local:** Persistência de metadados de conteúdos na base de dados local para otimização de performance.

---

## <a id="structure"></a>📂 Estrutura do Projeto

O projeto segue o padrão **MVC (Model-View-Controller)** para organização do código:

* `src/models`: Definição das queries SQL e abstração das tabelas da base de dados.
* `src/controllers`: Lógica de negócio e gestão do fluxo das rotas.
* `src/views`: Templates Mustache divididos em páginas e partials reutilizáveis.
* `src/services`: Lógica de integração com a API externa (TMDB).
* `public/`: Ficheiros estáticos incluindo o **Design System** (CSS com variáveis), ícones e scripts de front-end.

---

## <a id="execute"></a>📥 Processo de Importação e Execução

1. Faça o download ou clone o repositório.
2. No terminal, execute `npm install` para instalar as dependências.
3. Configure o ficheiro `.env` (siga o .env.example) com as suas credenciais do MySQL e a sua `TMDB_API_KEY`.
4. Inicie o servidor: `npm start`.
5. Aceda a http://localhost:3000 no seu navegador.
