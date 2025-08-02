# Tarefas de Ajustes - Sistema de Coleta de Dados

## Estrutura do Documento
1. **Ajustes Necessários**
   - Lista organizada dos ajustes solicitados pelo Coronel
   - Cada item com sua justificativa e objetivo

2. **Arquivos Relacionados**
   - Mapeamento dos arquivos existentes que serão afetados
   - Identificação da necessidade de novos arquivos

3. **Plano de Implementação**
   - Ordem de execução das tarefas
   - Pontos de atenção e cuidados necessários

4. **Observações Importantes**
   - Login atual deve permanecer intacto
   - Coleta de dados deve ser automática após login
   - Dados devem ser enviados ao Supabase nos campos correspondentes

## Análise dos Campos e Responsabilidades

### 1. Campos Gerenciados Manualmente (Coronel)
- ✅ nome (texto)
- ✅ email (texto)
- ✅ celular (texto)
- ✅ senha (texto)
- ✅ data_cadastro (timestamp) - Controle de início
- ✅ validade (timestamp) - Controle de mensalidade

### 2. Campos Gerenciados pelo Sistema
#### Identificação
- ✅ id (UUID) - Gerado pelo Supabase
- ⚠️ status (texto) - Converter para automático (online/offline)

#### Dados de Acesso (Coleta Automática)
- ⚠️ ip_cadastro (texto)
  - Capturar ao acessar home
  - Vincular ao email correspondente
- ⚠️ ultimo_ip (texto)
  - Atualizar a cada acesso
  - Manter após logout
- ⚠️ dispositivo (jsonb)
  - Tipo: iOS/Android/Computador/TV
  - Navegador utilizado
  - Detalhes técnicos relevantes
- ⚠️ quantidade_acessos (número)
  - Incrementar a cada login
- ⚠️ localizacao (texto)
  - Capturar baseado no IP
- ⚠️ tentativas_falhas (número)
  - Gerenciar durante tentativas de login

#### Comportamento Temporal
- ⚠️ ultimo_acesso (timestamp)
  - Limpar ao novo login
  - Registrar ao logout
  - Manter último registro

## Regras de Controle de Acesso
1. Usuário Grátis:
   - Permitir apenas um IP logado por vez
   - Bloquear tentativas de login simultâneo
   - Mensagem para login bloqueado: "Este usuário está logado. Se precisa de um novo login, chame no WhatsApp"
   - Verificar IP atual contra último IP registrado

## Regras de Negócio Importantes

### Limpeza de Dados
1. No Logout:
   - Manter: último IP
   - Registrar: último acesso
   - Limpar: status online

2. No Login:
   - Limpar: último acesso anterior
   - Atualizar: IP atual, dispositivo, localização
   - Incrementar: quantidade de acessos
   - Atualizar: status para online

### Observações Técnicas
1. Criar novo arquivo para gerenciamento automático de dados
2. Não modificar lógica atual de login
3. Implementar sistema de detecção de dispositivo/navegador
4. Implementar sistema de geolocalização por IP

## Checklist de Implementação

### 1. Preparação do Ambiente [ ]
- [ ] Instalar biblioteca ua-parser-js para detecção de dispositivo
- [ ] Instalar biblioteca para geolocalização por IP
- [ ] Verificar dependências necessárias no package.json

### 2. Criação de Hooks e Utilitários [ ]
- [ ] Criar hook useUserTracking
- [ ] Criar utilitário para detecção de dispositivo/navegador
- [ ] Criar utilitário para geolocalização
- [ ] Criar funções de atualização no Supabase

### 3. Implementação do Controle de IP [ ]
- [ ] Criar sistema de verificação de IP único
- [ ] Implementar bloqueio de múltiplos acessos
- [ ] Adicionar mensagens de feedback
- [ ] Criar função de validação de IP no login

### 4. Coleta Automática de Dados [ ]
- [ ] Implementar coleta de IP atual
- [ ] Implementar detecção de dispositivo
- [ ] Implementar geolocalização
- [ ] Implementar contador de acessos
- [ ] Implementar registro de último acesso

### 5. Sistema de Status Online/Offline [ ]
- [ ] Implementar detecção de status
- [ ] Criar sistema de atualização automática
- [ ] Implementar limpeza no logout
- [ ] Implementar atualização no login

### 6. Testes e Validação [ ]
- [ ] Testar coleta de dados
- [ ] Testar controle de IP único
- [ ] Testar mensagens de feedback
- [ ] Testar status online/offline
- [ ] Validar todos os campos no Supabase

### 7. Documentação [ ]
- [ ] Atualizar documentação com novas funcionalidades
- [ ] Documentar funções e hooks criados
- [ ] Atualizar arquivo de progresso

---
*Este documento será atualizado conforme o progresso da implementação.*