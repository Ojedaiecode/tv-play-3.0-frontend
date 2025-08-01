# Tipos de Usuários

## Estrutura Base de Usuário

Campos comuns a todos os tipos de usuário:

| Campo             | Tipo         | Descrição                           |
|------------------|--------------|-------------------------------------|
| id               | UUID         | Identificador único (chave primária) |
| nome             | Texto        | Nome do usuário                     |
| email            | Texto (único)| E-mail (único, obrigatório)        |
| celular          | Texto        | Número de celular                   |
| senha            | Texto hash   | Senha criptografada                 |
| status           | Texto        | ativo / inativo / bloqueado        |
| data_cadastro    | Data/Hora    | Quando foi criado                  |
| validade         | Data/Hora    | Até quando ele pode acessar        |
| ip_cadastro      | Texto        | IP usado no cadastro               |
| ultimo_ip        | Texto        | Último IP usado                    |
| dispositivo      | Texto        | Info do dispositivo                |
| quantidade_acessos| Número      | Quantidade de acessos feitos       |
| ultimo_acesso    | Data/Hora    | Quando foi o último acesso         |
| localizacao      | Texto        | Cidade/Estado                      |

## Níveis de Usuário

### 1. Usuário Grátis
- Acesso apenas ao conteúdo gratuito
- Limitado a 1 IP
- Sem custo
- Acesso a:
  - TV aberta gratuita
  - Filmes gratuitos
  - Séries gratuitas
  - Documentários gratuitos

### 2. Usuário Básico
- Acesso completo ao conteúdo
- Limitado a 1 IP
- Custo: R$ 19,90
- Acesso a todo conteúdo premium

### 3. Usuário Família
- Acesso completo ao conteúdo
- Limitado a 2 IPs simultâneos
- Custo: R$ 28,90
- Acesso a todo conteúdo premium

### 4. Usuário Premium
- Acesso completo ao conteúdo
- Limitado a 4 IPs simultâneos
- Custo: R$ 35,90
- Acesso a todo conteúdo premium

### 5. Usuário Coringa (Especial)
- Acesso promocional completo
- Limitado a 1 IP
- Usado para promoções relâmpago
- Acesso a conteúdo VIP e especiais






