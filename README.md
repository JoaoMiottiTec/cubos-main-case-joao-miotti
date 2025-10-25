Cubos Movies

Cubos Movies é um projeto fullstack desenvolvido para fins de entrevista técnica, com o objetivo de demonstrar domínio em arquitetura, boas práticas e tecnologias modernas em Node.js e Next.js.

O sistema permite que usuários se cadastrem, façam login e adicionem filmes por meio de uma API própria — com persistência em banco de dados PostgreSQL e armazenamento de imagens no Cloudflare R2.

Contexto do Projeto

O projeto foi desenvolvido em um formato monorepo, com os diretórios principais apps/api e apps/web, representando respectivamente o backend e o frontend.
Ambos estão totalmente funcionais de forma independente, mas a integração entre eles ainda não foi finalizada.

Essa separação foi intencional, permitindo demonstrar de maneira clara o domínio individual sobre cada stack e arquitetura.
O backend está funcional e testável via Postman, e o frontend possui toda a base visual e de autenticação.

Tech Stack
Backend

Node.js

Fastify

Prisma ORM

PostgreSQL

Cloudflare R2

Docker Compose

Frontend

Next.js

TailwindCSS

TypeScript

Estrutura do Projeto
CUBOS-MAIN-CASE-MOVIES/
├── apps/
│   ├── api/       # Backend (Fastify + Prisma)
│   └── web/       # Frontend (Next.js + Tailwind)
│
├── prisma/        # Esquemas e migrations do banco
│
├── docker-compose.yml   # Configuração dos containers (Postgres etc.)
├── .env                 # Variáveis de ambiente
├── .editorconfig         # Padrões de editor
├── .eslintignore / .prettierignore
├── eslint.config.mjs / prettier.config.cjs
├── LICENSE
├── pnpm-lock.yaml
├── package.json
├── tsconfig.json
└── README.md

Recursos Implementados
Backend

Cadastro e autenticação de usuários

CRUD completo de filmes

Upload de imagens para o Cloudflare R2

Banco versionado via Prisma Migrate

Frontend

Layout e estilização base (login, filmes, etc.)

Integração visual com Tailwind

Conexão com o backend pendente (em desenvolvimento)

Execução do Projeto

O projeto utiliza PNPM como gerenciador de pacotes.

# Instalar dependências
pnpm install

# Aplicar formatação e padrões
pnpm style

# Subir containers (Postgres etc.)
docker compose up -d


Após isso, basta importar o arquivo Postman incluído no repositório para testar as rotas da API.

Arquitetura e Decisões Técnicas

O projeto foi pensado para ser modular, escalável e claro, refletindo boas práticas de engenharia moderna:

Fastify foi escolhido pela performance superior e ecossistema mais moderno em relação ao Express.

Prisma garante tipagem e segurança nas queries, reduzindo erros e aumentando produtividade.

R2 (Cloudflare) foi adotado por oferecer compatibilidade com S3 a baixo custo.

Monorepo (apps/api + apps/web) simplifica o gerenciamento e compartilhamento de configuração.

Docker Compose garante ambiente local replicável e estável.

PNPM otimiza o uso de cache e simplifica dependências no monorepo.

Próximos Passos

Finalizar integração frontend ↔ backend

Implementar autenticação JWT no frontend

Exibir e enviar imagens para o R2 diretamente via client

Adicionar testes automatizados de integração

Configurar deploy (Vercel + Railway / Fly.io)

Autor

Desenvolvido por Tito
LinkedIn • GitHub

Licença

Distribuído sob a licença MIT.
Sinta-se à vontade para estudar, adaptar e aprimorar o projeto.