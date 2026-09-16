import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
  BookOpen,
  Sparkles,
  FileCheck,
  PenTool,
  RotateCcw,
  Check
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { cronogramaApi, Cronograma, MetaCronograma } from '../../api/cronograma';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

export const StudentCronograma: React.FC = () => {
  const { user } = useAuth();
  const [cronograma, setCronograma] = useState<Cronograma | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const { showToast } = useToast();

  const getStorageKey = () => `gramaticalizando_cronograma_${user?.id || 'anon'}`;

  const loadLocalMetas = (): Record<string, boolean> => {
    try {
      const raw = localStorage.getItem(getStorageKey());
      if (raw) return JSON.parse(raw);
    } catch {}
    return {};
  };

  const saveLocalMetas = (metas: Record<string, boolean>) => {
    try {
      localStorage.setItem(getStorageKey(), JSON.stringify(metas));
    } catch {}
  };

  const loadCronograma = async () => {
    const localMetas = loadLocalMetas();

    try {
      setLoading(true);
      const data = await cronogramaApi.getMeuCronograma();
      if (data && Array.isArray(data.dias)) {
        // Unifica status de conclusão (Servidor + LocalStorage)
        const diasAtualizados = data.dias.map(d => ({
          ...d,
          concluido: localMetas[d.id] !== undefined ? localMetas[d.id] : !!d.concluido
        }));
        setCronograma({ ...data, dias: diasAtualizados });
      }
    } catch (err: any) {
      showToast('Não foi possível carregar o cronograma atualizado.', 'warning');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCronograma();
  }, [user?.id]);

  const handleToggleMeta = async (diaId: string) => {
    try {
      setUpdatingId(diaId);

      // 1. Atualização otimista imediata no estado e LocalStorage
      setCronograma((prev) => {
        if (!prev) return prev;
        const currentItem = prev.dias.find(d => d.id === diaId);
        const novoStatus = currentItem ? !currentItem.concluido : true;

        const localMetas = loadLocalMetas();
        localMetas[diaId] = novoStatus;
        saveLocalMetas(localMetas);

        return {
          ...prev,
          dias: prev.dias.map((d) => (d.id === diaId ? { ...d, concluido: novoStatus } : d))
        };
      });

      // 2. Sincroniza em segundo plano com a API
      const res = await cronogramaApi.toggleMeta(diaId);
      if (res && res.sucesso) {
        showToast(
          res.concluido ? 'Meta concluída! Excelente disciplina.' : 'Meta desmarcada.',
          res.concluido ? 'success' : 'info'
        );
      }
    } catch (e) {
      showToast('Status salvo localmente.', 'info');
    } finally {
      setUpdatingId(null);
    }
  };

  const dias = cronograma?.dias || [];
  const totalMetas = dias.length;
  const concluidas = dias.filter((d) => d.concluido).length;
  const progresso = totalMetas > 0 ? Math.round((concluidas / totalMetas) * 100) : 0;

  const getTipoIcon = (tipo?: string) => {
    switch (tipo) {
      case 'exercicio':
        return <FileCheck size={18} />;
      case 'redacao':
        return <PenTool size={18} />;
      case 'simulado':
        return <Sparkles size={18} />;
      default:
        return <BookOpen size={18} />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Cabeçalho */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Cronograma Semanal de Estudos
            </h1>
            {cronograma?.plano && (
              <Badge variant="purple" size="sm">
                PLANO {cronograma.plano.toUpperCase()}
              </Badge>
            )}
          </div>
          <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', margin: 0 }}>
            {cronograma?.descricao || 'Mantenha a regularidade com a distribuição diária de tópicos e metas guiadas.'}
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          icon={<RotateCcw size={15} />}
          onClick={loadCronograma}
          isLoading={loading}
        >
          Atualizar
        </Button>
      </div>

      {/* Card de Progresso Semanal */}
      <Card
        variant="elevated"
        padding="lg"
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Progresso da Semana Atual
            </span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0.25rem 0 0 0' }}>
              {concluidas} de {totalMetas} metas cumpridas
            </h3>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '1.75rem', fontWeight: 800, color: progresso === 100 ? 'var(--success)' : 'var(--accent)' }}>
              {progresso}%
            </span>
          </div>
        </div>

        {/* Barra de Progresso Visual */}
        <div
          style={{
            width: '100%',
            height: '10px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: '#f1f5f9',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              width: `${progresso}%`,
              height: '100%',
              backgroundColor: progresso === 100 ? 'var(--success)' : 'var(--accent)',
              borderRadius: 'var(--radius-full)',
              transition: 'width 0.4s ease'
            }}
          />
        </div>
      </Card>

      {/* Lista de Metas do Cronograma */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {loading && dias.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            Carregando cronograma de estudos...
          </div>
        ) : dias.length === 0 ? (
          <Card padding="lg" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
            Nenhuma meta cadastrada no cronograma no momento.
          </Card>
        ) : (
          dias.map((item, index) => {
            const isDone = !!item.concluido;
            const isUpdating = updatingId === item.id;

            return (
              <Card
                key={item.id || index}
                padding="md"
                style={{
                  borderLeft: `4px solid ${isDone ? 'var(--success)' : 'var(--accent)'}`,
                  backgroundColor: isDone ? '#fafdfb' : '#ffffff',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', minWidth: '220px' }}>
                  <div
                    style={{
                      width: '2.75rem',
                      height: '2.75rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: isDone ? 'var(--success-bg)' : 'var(--accent-light)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isDone ? 'var(--success)' : 'var(--accent)',
                      flexShrink: 0
                    }}
                  >
                    {getTipoIcon(item.tipo)}
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      {item.dia}
                    </span>
                    <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                      {item.modulo}
                    </h4>
                  </div>
                </div>

                <div style={{ flex: 1, minWidth: '240px' }}>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>
                    {item.aula}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    <Clock size={12} />
                    <span>Duração estimada: {item.duracao}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <Button
                    variant={isDone ? 'secondary' : 'primary'}
                    size="sm"
                    icon={isDone ? <Check size={16} color="var(--success)" /> : <CheckCircle2 size={16} />}
                    onClick={() => handleToggleMeta(item.id)}
                    isLoading={isUpdating}
                  >
                    {isDone ? 'Concluída' : 'Marcar Conclusão'}
                  </Button>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};
