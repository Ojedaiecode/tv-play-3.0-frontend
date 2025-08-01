# Fluxo de Autenticação

## Processo de Cadastro

1. Usuário entra em contato via WhatsApp
2. Administrador coleta informações:
   - Nome
   - Email
   - Celular
   - Plano desejado
3. Administrador cria conta manualmente
4. Sistema gera credenciais iniciais
5. Credenciais são enviadas ao usuário

## Processo de Login

1. Usuário acessa a página de login
2. Insere email e senha
3. Sistema valida:
   - Credenciais
   - Status da conta (ativo/inativo/bloqueado)
   - Validade da assinatura
   - IP de acesso
4. Se aprovado:
   - Registra IP
   - Registra dispositivo
   - Incrementa contador de acessos
   - Atualiza último acesso
5. Se negado:
   - Registra tentativa falha
   - Exibe mensagem apropriada

## Controle de IPs

1. No primeiro acesso:
   - Registra IP como IP de cadastro
   - Define como último IP

2. Nos acessos subsequentes:
   - Verifica se IP está dentro do limite do plano
   - Se dentro do limite: permite acesso
   - Se fora do limite: bloqueia acesso

## Regras de Segurança

- Bloqueio após X tentativas falhas
- Validação de dispositivo
- Registro de todas as tentativas de acesso
- Monitoramento de múltiplos IPs
- Proteção contra força bruta 