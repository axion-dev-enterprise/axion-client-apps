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

## 📂 Estrutura Canônica de Diretórios

```text
packages/gramaticalizando/
├── api/                       # Vercel Serverless Function entrypoint (Express runtime)
│   └── index.js
├── data/                      # Persistência de dados JSON desacoplada e modular
│   ├── aulas.json             # Base de aulas cadastradas
│   ├── categorias.json        # Categorias de conteúdo
│   ├── cronogramas.json       # Cronogramas de estudo
│   ├── cursos.json            # Cursos cadastrados
│   ├── exercicios.json        # Questões e simulados com gabaritos
│   ├── materias.json          # Módulos e matérias
│   ├── redacoes.json          # Redações e correções
│   └── usuarios.json          # Usuários (alunos/admins) com senhas em bcrypt
├── docs/                      # Auditorias técnicas e notas de arquitetura
│   └── revisao-geral.txt      # Relatório completo de transição de arquitetura
├── scripts/                   # Utilitários de linha de comando
│   ├── criar-admin.js         # Script interativo para provisionar administradores
│   ├── generate_modules.py    # Gerador canônico dos 7 módulos e 41 aulas
│   └── update_clean_urls.py   # Utilitário de auditoria de links canônicos
├── src/                       # Back-end modular Node.js / Express
│   ├── app.js                 # Configuração do Express, sessões e middlewares
│   ├── server.js              # Inicialização local do servidor HTTP
│   ├── config/                # paths.js (DATA_DIR, PUBLIC_DIR), env.js
│   ├── controllers/           # auth, admin, materias, aulas, exercicios, etc.
│   ├── data/                  # jsonStore.js (operações atômicas com locks)
│   ├── middlewares/           # auth.js, errorHandler.js
│   ├── routes/                # Definição modular de rotas RESTful
│   └── frontend/              # Componentes universais (Toast, Modal, AuthModal)
├── public/                    # Front-end estático compilado pelo Vite
│   ├── assets/                # Design System: css/, js/ (SPA Router, storage), images/
│   ├── pages/                 # Portal do Aluno (Clean URLs: /home, /portugues, etc.)
│   ├── professor/             # Painel do Professor (/professor, /professor/alunos, etc.)
│   ├── legacy/                # Arquivos legados isolados para compatibilidade
│   ├── img/                   # Imagens e marcas visuais
│   ├── favicon.png
│   └── index.html             # Landing page principal
├── .env.example
├── .env.local
├── .gitignore
├── package.json
├── README.md
├── vercel.json                # Configuração de Clean URLs e Serverless na Vercel
└── vite.config.mjs            # Vite multi-página com plugin clean-urls-mirror
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
Para acessar o painel do professor (`/professor`), utilize o script CLI oficial:
```bash
npm run seed:admin
# ou diretamente:
node scripts/criar-admin.js
```
O terminal solicitará:
- **Nome**: Ex: `Professora Wilma`
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
