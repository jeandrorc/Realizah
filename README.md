# Realizah

Este é um projeto monorepo baseado em tecnologias 100% open source.

## Tecnologias Open Source

- [Turborepo](https://turbo.build/repo) para gerenciamento de monorepo
- [Medusa.js](https://medusajs.com/) para e-commerce backend (headless)
- [Strapi](https://strapi.io/) como CMS headless 
- [Next.js](https://nextjs.org/) para o frontend
- [PostgreSQL](https://www.postgresql.org/) para banco de dados
- [Redis](https://redis.io/) para cache
- [RabbitMQ](https://www.rabbitmq.com/) para mensageria
- [MinIO](https://min.io/) para armazenamento de objetos compatível com S3

## Como Iniciar

### Pré-requisitos

- Node.js >=18.0.0
- Yarn >=1.22.19
- Docker e Docker Compose (para serviços de infraestrutura)

### Instalação

```bash
# Instalar dependências
yarn install

# Iniciar serviços de infraestrutura
yarn docker:up
```

### Desenvolvimento

```bash
# Iniciar todos os serviços em modo de desenvolvimento
yarn dev
```

### Build

```bash
# Construir todos os pacotes e aplicações
yarn build
```

### Testes

```bash
# Executar testes
yarn test
```

### Linting

```bash
# Executar linting
yarn lint
```

## Estrutura do Projeto

```
.
├── apps/
│   ├── backend/       # Backend Medusa.js
│   ├── cms/          # CMS Strapi
│   └── storefront/   # Frontend Next.js
├── packages/         # Pacotes compartilhados
├── .env.example     # Exemplo de variáveis de ambiente
├── docker-compose.yml # Serviços de infraestrutura
└── turbo.json       # Configuração do Turborepo
```

## Licença

MIT
