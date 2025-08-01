# Estrutura do Banco de Dados

## Tabelas de Links

### Links por Tipo de Conteúdo

| Nome da Tabela                  | Descrição                                       | Acesso                |
|--------------------------------|------------------------------------------------|-----------------------|
| links_tv_ao_vivo_gratis        | Links de TV aberta                             | Usuários grátis       |
| links_filmes_gratis            | Links de filmes gratuitos                      | Usuários grátis       |
| links_series_gratis            | Links de séries gratuitas                      | Usuários grátis       |
| links_documentarios_gratis     | Links de documentários e esportes gratuitos    | Usuários grátis       |
| links_tv_ao_vivo_assinantes    | TV para assinantes                            | Usuários pagantes     |
| links_filmes_assinantes        | Filmes para assinantes                        | Usuários pagantes     |
| links_series_assinantes        | Séries para assinantes                        | Usuários pagantes     |
| links_documentarios_assinantes | Documentários e esportes para assinantes      | Usuários pagantes     |
| links_tv_coringa               | Conteúdo VIP e especiais                      | Usuários coringa      |

## Estrutura Comum das Tabelas de Links

Cada tabela de links terá os seguintes campos:

| Campo          | Tipo         | Descrição                                    |
|---------------|--------------|----------------------------------------------|
| id            | UUID         | Identificador único                          |
| titulo        | Texto        | Nome do conteúdo                            |
| descricao     | Texto        | Descrição do conteúdo                       |
| url           | Texto        | Link do conteúdo (m3u8 ou YouTube)          |
| tipo          | Texto        | Tipo do player (hls/youtube)                |
| thumbnail     | Texto        | URL da imagem de preview                    |
| status        | Texto        | ativo / inativo                             |
| data_criacao  | Data/Hora    | Quando o link foi adicionado                |
| ultima_atualizacao | Data/Hora | Última vez que o link foi atualizado      |

## Relacionamentos e Regras

- Cada usuário tem um nível de acesso definido (grátis, básico, família, premium, coringa)
- O acesso aos links é controlado pelo nível do usuário
- Usuários grátis só podem acessar tabelas com sufixo "_gratis"
- Usuários pagantes (básico, família, premium) podem acessar todas as tabelas exceto "links_tv_coringa"
- Usuários coringa têm acesso a todas as tabelas
- O controle de IPs é feito na tabela de usuários 