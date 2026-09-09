# 🎓 Gramaticalizando (plat-jamal)

> Plataforma completa de ensino a distância (EAD / LMS) focada no aprendizado estruturado de Gramática e Língua Portuguesa, com gestão de matérias, editor rico de aulas em estilo documento, construtor de exercícios interativos e painel do aluno com acompanhamento de progresso em tempo real.

---

## 📌 Visão Geral do Sistema

O projeto **Gramaticalizando** foi concebido para entregar uma experiência fluida tanto para estudantes quanto para administradores pedagógicos:

1. **Portal Público (Landing Page)**: Apresentação da metodologia, benefícios, diagnósticos e modais integrados para login e cadastro de alunos.
2. **Ambiente do Aluno**: Dashboard com métricas de estudo (aulas concluídas, exercícios realizados, taxa de acerto, sequência de dias e trilhas ativas), catálogo de matérias e histórico de atividades.
3. **Player de Aulas**: Leitor responsivo com navegação sequencial entre aulas (anterior / próxima), controle de conclusão e acesso imediato aos exercícios vinculados.
4. **Módulo de Exercícios (Quiz Runner)**: Resolução de questões de múltipla escolha com gabarito validado no servidor, cálculo instantâneo de aproveitamento e registro de telemetria nos estudos do aluno.
5. **Painel Administrativo**: Gestão de métricas globais, CRUD de matérias, listagem de alunos cadastrados e monitoramento de desempenho.
6. **Editor de Aulas (Word-Style)**: Interface WYSIWYG com barra de ferramentas rica (formatação, títulos, listas, alinhamentos, desfazer/refazer) e salvamento entre rascunho e publicação.
7. **Editor de Exercícios**: Construtor visual de questionários associados a matérias e aulas específicas, permitindo cadastro dinâmico de alternativas e marcação da resposta correta.

---

## 🛠️ Stack Tecnológica

- **Backend Runtime**: [Node.js](https://nodejs.org/) (CommonJS)
- **Framework Web**: [Express 5.2.1](https://expressjs.com/)
- **Criptografia de Senhas**: [bcryptjs 3.0.3](https://www.npmjs.com/package/bcryptjs) (Hash salt rounds = 10)
- **Sessões HTTP**: [express-session 1.19.0](https://www.npmjs.com/package/express-session) com cookies `httpOnly` e `sameSite: lax`
- **Persistência de Dados**: Arquivos JSON desacoplados com leitura e escrita assíncrona (`fs/promises`)
- **Frontend**: HTML5 Semântico, CSS3 Moderno (CSS Custom Properties, Grid, Flexbox) e Vanilla JavaScript puro (Zero build tooling, Zero dependências externas no cliente)

---

## 📂 Estrutura de Diretórios

```text
plat/
├── aulas.json             # Base de dados de aulas cadastradas
├── categorias.json        # Base de categorias auxiliares
├── cursos.json            # Base de cursos cadastrados
├── exercicios.json        # Base de exercícios com questões e gabaritos
├── materias.json          # Base de matérias cadastradas
├── usuarios.json          # Base de alunos e administradores com senhas em hash
├── criar-admin.js         # Utilitário CLI interativo para criar contas de admin
├── server.js              # Servidor Express, regras de negócio e rotas de API
├── package.json           # Manifesto de dependências e scripts npm
├── package-lock.json      # Trava de versões das dependências
├── .env.example           # Exemplo de variáveis de ambiente
├── .gitignore             # Regras de exclusão do Git
├── public/                # Assets e páginas estáticas servidas pelo Express
│   ├── index.html         # Landing page com modais de login e registro
│   ├── script.js          # Lógica da landing page e autenticação do aluno
│   ├── style.css          # Estilos da landing page
│   ├── aluno.html         # Dashboard principal da área do aluno
│   ├── aluno.js           # Lógica de renderização do dashboard do aluno
│   ├── aluno.css          # Estilos da área do aluno
│   ├── aula.html          # Interface de leitura e estudo de aulas publicadas
│   ├── aula.js            # Lógica de carregamento de conteúdo e conclusão de aula
│   ├── aula.css           # Estilos da página de aula
│   ├── exercicios.html    # Catálogo de listas de exercícios por matéria
│   ├── exercicios.js      # Lógica de filtragem e exibição de exercícios
│   ├── exercicios.css     # Estilos da listagem de exercícios
│   ├── exercicio.html     # Runner interativo de resolução de exercícios
│   ├── exercicio.js       # Lógica do quiz, submissão e feedback de notas
│   ├── exercicio.css      # Estilos do quiz
│   ├── admin-login.html   # Tela de autenticação exclusiva para administradores
│   ├── admin-login.js     # Lógica de login com validação de sessão admin
│   ├── admin-login.css    # Estilos do login administrativo
│   ├── admin.html         # Painel administrativo com abas e estatísticas
│   ├── admin.js           # Lógica operacional do painel administrativo
│   ├── admin.css          # Estilos do painel administrativo
│   ├── editor-aula.html   # Editor WYSIWYG de aulas estilo Word
│   ├── editor-aula.js     # Lógica da barra de ferramentas e salvamento de aula
│   ├── editor-aula.css    # Estilos do editor de aula
│   ├── editor-exercicio.html # Construtor de questionários e gabaritos
│   ├── editor-exercicio.js   # Lógica dinâmica de adicionar/remover alternativas
│   ├── editor-exercicio.css  # Estilos do construtor de exercícios
│   └── img/               # Imagens e banners da aplicação
└── README.md              # Documentação oficial do projeto
```

---

## 🚀 Como Executar Localmente

### Pré-requisitos
- Node.js versão 18 ou superior instalado.

### 1. Instalação das Dependências
```bash
npm install
```

### 2. Criação do Primeiro Administrador
Para acessar as páginas `/admin.html`, `/editor-aula.html` e `/editor-exercicio.html`, é necessário criar um perfil com privilégio administrativo:
```bash
node criar-admin.js
```
O terminal solicitará:
- **Nome**: Ex: `Administradora`
- **E-mail**: Ex: `admin@gramaticalizando.com.br`
- **Senha**: Mínimo 6 caracteres

### 3. Inicialização do Servidor
```bash
npm start
```
O servidor iniciará por padrão em: **`http://localhost:3000`**

---

## 🗺️ Mapa Completo de Rotas e Endpoints

### 🌐 Páginas HTML Protegidas (Sessão Admin Mandatória)
| Rota | Descrição |
|---|---|
| `GET /admin.html` | Painel de controle administrativo |
| `GET /editor-aula.html` | Editor rico de conteúdo de aula |
| `GET /editor-exercicio.html` | Construtor de questionários e exercícios |

### 🔑 Autenticação e Sessão
| Método | Endpoint | Acesso | Descrição |
|---|---|---|---|
| `POST` | `/api/registro` | Público | Cadastro de novo aluno (nome, email, senha com hash) |
| `POST` | `/api/login` | Público | Autenticação do aluno (retorna dados e ID) |
| `POST` | `/api/admin/login` | Público | Autenticação do admin (inicia sessão HTTP) |
| `GET` | `/api/admin/me` | Admin | Verifica se há sessão administrativa ativa |
| `POST` | `/api/admin/logout` | Admin | Destrói a sessão administrativa ativa |

### 📊 Alunos & Estudos
| Método | Endpoint | Acesso | Descrição |
|---|---|---|---|
| `GET` | `/api/dashboard/:id` | Aluno | Retorna métricas, sequência, atividades e aulas |
| `GET` | `/api/aluno/aulas/:id` | Aluno | Abre conteúdo da aula publicada com navegação |
| `POST` | `/api/aluno/aulas/:id/concluir` | Aluno | Marca aula como concluída e incrementa progresso |
| `GET` | `/api/aluno/exercicios` | Aluno | Lista exercícios publicados com filtros |
| `GET` | `/api/aluno/exercicios/:id` | Aluno | Retorna questões do exercício sem vazar gabarito |
| `POST` | `/api/aluno/exercicios/:id/finalizar` | Aluno | Submete respostas, calcula nota e salva histórico |

### 🛠️ Gestão Administrativa
| Método | Endpoint | Acesso | Descrição |
|---|---|---|---|
| `GET` | `/api/admin/dashboard` | Admin | Métricas agregadas (total alunos, matérias, aulas, exercícios) |
| `GET` | `/api/admin/materias` | Admin | Lista todas as matérias cadastradas |
| `POST` | `/api/admin/materias` | Admin | Cadastra nova matéria |
| `PUT` | `/api/admin/materias/:id` | Admin | Atualiza dados da matéria |
| `DELETE` | `/api/admin/materias/:id` | Admin | Remove matéria e seus vínculos |
| `GET` | `/api/admin/materias/:materiaId/aulas` | Admin | Lista aulas de uma matéria específica |
| `GET` | `/api/admin/aulas/:id` | Admin | Obtém dados completos da aula para edição |
| `POST` | `/api/admin/materias/:materiaId/aulas` | Admin | Cria nova aula em uma matéria |
| `PUT` | `/api/admin/aulas/:id` | Admin | Atualiza aula (título, conteúdo HTML, status) |
| `DELETE` | `/api/admin/aulas/:id` | Admin | Remove aula cadastrada |
| `GET` | `/api/admin/exercicios` | Admin | Lista exercícios com contagem de questões |
| `GET` | `/api/admin/exercicios/:id` | Admin | Obtém exercício completo incluindo gabarito |
| `POST` | `/api/admin/exercicios` | Admin | Cria lista de exercícios com gabarito |
| `PUT` | `/api/admin/exercicios/:id` | Admin | Atualiza lista de exercícios e alternativas |
| `DELETE` | `/api/admin/exercicios/:id` | Admin | Remove exercício cadastrado |
| `GET` | `/api/admin/alunos` | Admin | Lista alunos com dados agregados de estudo |

---

## 🔒 Segurança e Melhores Práticas Recomendadas

1. **Isolamento de Credenciais**: O arquivo `usuarios.json` não deve conter senhas em texto puro. O sistema utiliza `bcryptjs` com salt de 10 rounds.
2. **Sessão do Aluno**: Migrar a autenticação do aluno para JWT em cookies `HttpOnly` ou sessão Express gerenciada no servidor, eliminando o envio manual de `usuarioId` pelo frontend (mitigando BOLA/IDOR).
3. **Persistência Relacional**: Migrar a base de JSON para SQLite ou PostgreSQL/Supabase para garantir atomicidade, travas de escrita e prevenção de corrupção concorrente.
