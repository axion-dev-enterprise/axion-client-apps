import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Mail,
  Shield,
  CheckCircle,
  MoreHorizontal,
  Clock,
  Check,
  X,
  Copy,
  Sparkles,
  Award,
  Filter
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { adminApi, AdminAluno } from '../../api/admin';
import { useToast } from '../../context/ToastContext';

export const ProfessorAlunos: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<'todos' | 'pendentes' | 'ativos'>('todos');
  const [alunos, setAlunos] = useState<AdminAluno[]>([]);
  const [loading, setLoading] = useState(true);
  const [processandoId, setProcessandoId] = useState<string | null>(null);
  const [copiadoId, setCopiadoId] = useState<string | null>(null);
  const { showToast } = useToast();

  const loadAlunos = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getAlunos();
      if (res && res.length > 0) {
        setAlunos(res);
      } else {
        // Mock inicial seguro se banco estiver vazio
        setAlunos([
          {
            id: '1',
            nome: 'Ana Beatriz Souza',
            email: 'ana.beatriz@email.com',
            plano: 'pro',
            statusPlano: 'ativo',
            codigoReferencia: 'GRAM-4821',
            criadoEm: new Date().toISOString(),
            aulasConcluidas: 12,
            exerciciosConcluidos: 6,
            taxaAcerto: 85
          },
          {
            id: '2',
            nome: 'Carlos Eduardo Lima',
            email: 'carlos.lima@email.com',
            plano: 'medio',
            statusPlano: 'pendente',
            codigoReferencia: 'GRAM-7924',
            criadoEm: new Date().toISOString(),
            aulasConcluidas: 0,
            exerciciosConcluidos: 0,
            taxaAcerto: 0
          },
          {
            id: '3',
            nome: 'Mariana Santos',
            email: 'mariana.santos@email.com',
            plano: 'iniciante',
            statusPlano: 'pendente',
            codigoReferencia: 'GRAM-3108',
            criadoEm: new Date().toISOString(),
            aulasConcluidas: 2,
            exerciciosConcluidos: 1,
            taxaAcerto: 60
          }
        ]);
      }
    } catch {
      showToast('Erro ao carregar lista de alunos.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlunos();
  }, []);

  const aprovarPlano = async (aluno: AdminAluno) => {
    setProcessandoId(aluno.id);
    try {
      await adminApi.aprovarPlanoAluno(aluno.id, aluno.plano || 'medio');
      showToast(`Matrícula de ${aluno.nome} aprovada com sucesso!`, 'success');
      // Atualização otimista imediata na UI
      setAlunos(prev => prev.map(a => a.id === aluno.id ? { ...a, statusPlano: 'ativo', dataAprovacaoPlano: new Date().toISOString() } : a));
    } catch (err: any) {
      showToast(err.message || 'Erro ao aprovar matrícula.', 'error');
    } finally {
      setProcessandoId(null);
    }
  };

  const alterarStatus = async (aluno: AdminAluno, novoStatus: 'pendente' | 'ativo' | 'recusado') => {
    setProcessandoId(aluno.id);
    try {
      await adminApi.atualizarStatusPlano(aluno.id, novoStatus, aluno.plano);
      showToast(`Status de ${aluno.nome} alterado para ${novoStatus}.`, 'info');
      setAlunos(prev => prev.map(a => a.id === aluno.id ? { ...a, statusPlano: novoStatus } : a));
    } catch (err: any) {
      showToast(err.message || 'Erro ao atualizar status.', 'error');
    } finally {
      setProcessandoId(null);
    }
  };

  const copiarCodigo = (id: string, codigo?: string) => {
    if (codigo) {
      navigator.clipboard.writeText(codigo);
      setCopiadoId(id);
      setTimeout(() => setCopiadoId(null), 2000);
      showToast(`Código ${codigo} copiado!`, 'success');
    }
  };

  const pendentes = alunos.filter(a => a.statusPlano === 'pendente');
  const ativos = alunos.filter(a => a.statusPlano === 'ativo' || !a.statusPlano);

  const filtered = alunos.filter((a) => {
    const matchSearch =
      a.nome.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase()) ||
      (a.codigoReferencia && a.codigoReferencia.toLowerCase().includes(search.toLowerCase()));

    if (!matchSearch) return false;

    if (filtroStatus === 'pendentes') return a.statusPlano === 'pendente';
    if (filtroStatus === 'ativos') return a.statusPlano === 'ativo' || !a.statusPlano;
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Topo do Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
            Gerenciamento de Matrículas & Alunos
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Aprove solicitações de planos, acompanhe códigos de referência e gerencie permissões
          </p>
        </div>

        <div style={{ width: '100%', maxWidth: '340px' }}>
          <Input
            placeholder="Buscar por nome, e-mail ou código (ex: GRAM-1234)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search size={16} />}
          />
        </div>
      </div>

      {/* Banner de Atenção se houver pendentes */}
      {pendentes.length > 0 && (
        <Card
          variant="elevated"
          padding="md"
          style={{
            backgroundColor: '#fffbeb',
            border: '1px solid #fde68a',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: '#fef3c7',
                color: '#d97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <Clock size={20} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#92400e', margin: 0 }}>
                {pendentes.length} {pendentes.length === 1 ? 'matrícula aguardando' : 'matrículas aguardando'} sua aprovação
              </h4>
              <p style={{ fontSize: '0.8125rem', color: '#b45309', margin: 0 }}>
                Os alunos registraram o plano no cadastro e estão aguardando liberação do acesso docente.
              </p>
            </div>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setFiltroStatus('pendentes')}
            style={{ backgroundColor: '#d97706', borderColor: '#d97706', fontWeight: 700 }}
          >
            Ver Solicitações Pendentes ({pendentes.length})
          </Button>
        </Card>
      )}

      {/* Abas de Filtros */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
        <button
          type="button"
          onClick={() => setFiltroStatus('todos')}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            fontSize: '0.875rem',
            fontWeight: filtroStatus === 'todos' ? 700 : 500,
            backgroundColor: filtroStatus === 'todos' ? '#f3e8ff' : 'transparent',
            color: filtroStatus === 'todos' ? '#6b21a8' : 'var(--text-secondary)',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Todos os Alunos ({alunos.length})
        </button>

        <button
          type="button"
          onClick={() => setFiltroStatus('pendentes')}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            fontSize: '0.875rem',
            fontWeight: filtroStatus === 'pendentes' ? 700 : 500,
            backgroundColor: filtroStatus === 'pendentes' ? '#fef3c7' : 'transparent',
            color: filtroStatus === 'pendentes' ? '#b45309' : 'var(--text-secondary)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          Aguardando Aprovação
          {pendentes.length > 0 && (
            <span
              style={{
                backgroundColor: '#d97706',
                color: '#ffffff',
                borderRadius: '999px',
                padding: '1px 6px',
                fontSize: '0.6875rem',
                fontWeight: 800
              }}
            >
              {pendentes.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setFiltroStatus('ativos')}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            fontSize: '0.875rem',
            fontWeight: filtroStatus === 'ativos' ? 700 : 500,
            backgroundColor: filtroStatus === 'ativos' ? '#dcfce7' : 'transparent',
            color: filtroStatus === 'ativos' ? '#15803d' : 'var(--text-secondary)',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Ativos ({ativos.length})
        </button>
      </div>

      {/* Tabela de Alunos e Aprovação */}
      <Card padding="none" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-surface-2)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '1rem 1.25rem', fontWeight: 600 }}>Aluno</th>
                <th style={{ padding: '1rem 1.25rem', fontWeight: 600 }}>Código de Referência</th>
                <th style={{ padding: '1rem 1.25rem', fontWeight: 600 }}>Plano Solicitado</th>
                <th style={{ padding: '1rem 1.25rem', fontWeight: 600 }}>Status do Plano</th>
                <th style={{ padding: '1rem 1.25rem', fontWeight: 600, textAlign: 'right' }}>Ações / Liberação</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    Nenhum aluno encontrado para este filtro.
                  </td>
                </tr>
              ) : (
                filtered.map((aluno) => {
                  const isPendente = aluno.statusPlano === 'pendente';
                  const isProcessando = processandoId === aluno.id;

                  return (
                    <tr
                      key={aluno.id}
                      style={{
                        borderBottom: '1px solid var(--border-subtle)',
                        backgroundColor: isPendente ? '#fffdfa' : 'transparent',
                        transition: 'background-color var(--transition-fast)'
                      }}
                      onMouseEnter={(e) => {
                        if (!isPendente) e.currentTarget.style.backgroundColor = 'var(--bg-surface-2)';
                      }}
                      onMouseLeave={(e) => {
                        if (!isPendente) e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      {/* Coluna Aluno */}
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{aluno.nome}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{aluno.email}</div>
                      </td>

                      {/* Coluna Código de Referência */}
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <span
                            style={{
                              fontFamily: 'monospace',
                              fontWeight: 700,
                              fontSize: '0.8125rem',
                              backgroundColor: '#f1f5f9',
                              padding: '0.2rem 0.5rem',
                              borderRadius: '6px',
                              color: '#334155'
                            }}
                          >
                            {aluno.codigoReferencia || 'GRAM-0000'}
                          </span>
                          <button
                            type="button"
                            onClick={() => copiarCodigo(aluno.id, aluno.codigoReferencia)}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              color: '#64748b',
                              padding: '2px',
                              display: 'flex',
                              alignItems: 'center'
                            }}
                            title="Copiar código de referência"
                          >
                            {copiadoId === aluno.id ? <Check size={14} color="#16a34a" /> : <Copy size={14} />}
                          </button>
                        </div>
                      </td>

                      {/* Coluna Plano */}
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <Badge
                          variant={
                            aluno.plano === 'pro'
                              ? 'purple'
                              : aluno.plano === 'medio'
                              ? 'info'
                              : 'neutral'
                          }
                          size="sm"
                        >
                          {aluno.plano ? `PLANO ${aluno.plano.toUpperCase()}` : 'PLANO MÉDIO'}
                        </Badge>
                      </td>

                      {/* Coluna Status */}
                      <td style={{ padding: '1rem 1.25rem' }}>
                        {isPendente ? (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              backgroundColor: '#fef3c7',
                              color: '#b45309',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              padding: '0.25rem 0.625rem',
                              borderRadius: '999px'
                            }}
                          >
                            <Clock size={12} /> Aguardando Liberação
                          </span>
                        ) : aluno.statusPlano === 'recusado' ? (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              backgroundColor: '#fee2e2',
                              color: '#b91c1c',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              padding: '0.25rem 0.625rem',
                              borderRadius: '999px'
                            }}
                          >
                            <X size={12} /> Recusado
                          </span>
                        ) : (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              backgroundColor: '#dcfce7',
                              color: '#15803d',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              padding: '0.25rem 0.625rem',
                              borderRadius: '999px'
                            }}
                          >
                            <CheckCircle size={12} /> Ativo Liberado
                          </span>
                        )}
                      </td>

                      {/* Coluna Ações / Aprovação */}
                      <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                        {isPendente ? (
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Button
                              variant="primary"
                              size="sm"
                              isLoading={isProcessando}
                              onClick={() => aprovarPlano(aluno)}
                              style={{
                                backgroundColor: '#15803d',
                                borderColor: '#15803d',
                                fontWeight: 700
                              }}
                            >
                              <Check size={14} style={{ marginRight: '4px' }} />
                              Aprovar Matrícula
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={isProcessando}
                              onClick={() => alterarStatus(aluno, 'recusado')}
                              style={{ color: '#dc2626', borderColor: '#fca5a5' }}
                              title="Recusar matrícula"
                            >
                              <X size={14} />
                            </Button>
                          </div>
                        ) : (
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => alterarStatus(aluno, 'pendente')}
                              style={{ fontSize: '0.75rem', color: '#64748b' }}
                            >
                              Suspender Acesso
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
