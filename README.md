# Segurança de Aplicações - Demonstração de XSS

Este projeto demonstra como os ataques XSS (Cross-Site Scripting) funcionam e como se proteger contra eles, utilizando um sistema com persistência de dados em SQLite.

## Funcionalidades

- Sistema de autenticação de usuários com SQLite
- Cadastro de novos usuários
- Módulo vulnerável a XSS (demonstração de como um ataque pode acontecer)
- Módulo seguro com sanitização contra XSS
- Persistência de dados utilizando SQLite3

## Tecnologias Utilizadas

- Node.js
- Express.js
- EJS (template engine)
- SQLite3 (banco de dados)
- Express-session (gerenciamento de sessões)
- XSS (biblioteca para sanitização de entradas)

## Como Executar

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Execute o aplicativo:
   ```bash
   npm start
   ```
4. Acesse `http://localhost:3000` no navegador

## Estrutura do Banco de Dados

O projeto utiliza SQLite como banco de dados com as seguintes tabelas:

- **users**: Armazena informações de usuários
  - `id` (PK, autoincrement)
  - `username` (unique)
  - `password`
  - `created_at`

- **messages**: Armazena as mensagens dos usuários
  - `id` (PK, autoincrement)
  - `user_id` (FK para users)
  - `content`
  - `created_at`
  - `is_sanitized` (flag para indicar se a mensagem foi sanitizada)

## Credenciais Padrão

- Usuário: admin
- Senha: admin