# Analytics e Interfaces Administrativas

## Painel Administrativo do Supabase

### Interface de Gerenciamento de Links
- Edição direta de links via interface visual
- Atualização em tempo real sem necessidade de deploy
- Controles de ativo/inativo para cada link
- Histórico de alterações
- Filtros e busca de conteúdo

### Analytics em Tempo Real

#### Métricas de Usuários
| Métrica | Descrição |
|---------|-----------|
| Usuários Online | Total de usuários ativos no momento |
| Por Tipo | Distribuição entre tipos de usuário (grátis/básico/família/premium) |
| Por Região | Distribuição geográfica dos acessos |
| Dispositivos | Distribuição entre mobile/desktop |

#### Métricas de Conteúdo
| Métrica | Descrição |
|---------|-----------|
| Views Totais | Total de visualizações do conteúdo |
| Views Atuais | Número de pessoas assistindo agora |
| Tempo Médio | Tempo médio de permanência |
| Horário Pico | Horário com maior audiência |
| Engagement | Taxa de interação com o conteúdo |

## Estrutura de Tabelas de Analytics

### Tabela: analytics_sessoes
```sql
CREATE TABLE analytics_sessoes (
  id UUID PRIMARY KEY,
  usuario_id UUID REFERENCES usuarios(id),
  inicio_sessao TIMESTAMP,
  ultimo_ping TIMESTAMP,
  tipo_usuario TEXT,
  dispositivo TEXT,
  localizacao TEXT
);
```

### Tabela: analytics_conteudo
```sql
CREATE TABLE analytics_conteudo (
  id UUID PRIMARY KEY,
  conteudo_id UUID,
  views_totais INTEGER,
  views_atual INTEGER,
  tempo_medio FLOAT,
  horario_pico TIMESTAMP,
  dispositivos JSONB,
  ultima_atualizacao TIMESTAMP
);
```

### Tabela: analytics_historico
```sql
CREATE TABLE analytics_historico (
  id UUID PRIMARY KEY,
  conteudo_id UUID,
  data DATE,
  metricas JSONB,
  picos_audiencia JSONB
);
```

## Dashboard para Anunciantes

### Relatórios Disponíveis
1. **Relatório de Audiência**
   - Gráficos de audiência por período
   - Picos de audiência
   - Perfil dos espectadores

2. **Relatório de Engajamento**
   - Tempo médio de visualização
   - Taxa de retenção
   - Horários mais populares

3. **Relatório Demográfico**
   - Distribuição geográfica
   - Tipos de dispositivos
   - Perfil dos usuários

### Precificação Dinâmica
- Preços baseados em métricas reais
- Diferentes faixas de horário
- Bônus por pico de audiência
- Pacotes personalizados

## Implementação Técnica

### Frontend
```typescript
// Hook para tracking de visualização
const useViewTracking = (conteudoId: string) => {
  useEffect(() => {
    // Inicia tracking
    supabase.rpc('iniciar_visualizacao', { conteudo_id: conteudoId });

    return () => {
      // Finaliza tracking
      supabase.rpc('finalizar_visualizacao', { conteudo_id: conteudoId });
    };
  }, [conteudoId]);
};

// Componente de métricas em tempo real
const MetricasLive = () => {
  const [metricas, setMetricas] = useState<Metricas>();

  useEffect(() => {
    const subscription = supabase
      .channel('metricas')
      .on('*', (update) => {
        setMetricas(update.new);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return <MetricasDisplay data={metricas} />;
};
```

### Supabase Functions
```typescript
// Função para atualizar métricas
CREATE FUNCTION atualizar_metricas()
RETURNS trigger AS $$
BEGIN
  -- Atualiza contadores
  -- Calcula médias
  -- Atualiza picos
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

// Trigger para tracking em tempo real
CREATE TRIGGER tracking_realtime
AFTER INSERT OR UPDATE ON analytics_sessoes
FOR EACH ROW
EXECUTE FUNCTION atualizar_metricas();
```

## Próximos Passos

1. Implementar tracking básico de visualizações
2. Criar dashboard inicial com métricas principais
3. Implementar tracking detalhado por conteúdo
4. Desenvolver relatórios para anunciantes
5. Implementar precificação dinâmica
6. Criar interface de exportação de relatórios 