import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  PenTool,
  BookOpen,
  TrendingUp,
  FileCheck,
  Sparkles,
  Download,
  HelpCircle,
  ArrowRight,
  Plus,
  Clock,
  GraduationCap
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { adminApi } from '../../api/admin';
import { GuiaUploadModal } from '../../components/professor/GuiaUploadModal';

export const ProfessorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [guiaAberto, setGuiaAberto] = useState(false);

  const [stats, setStats] = useState({
    totalAlunos: 0,
    totalMaterias: 0,
    totalAulas: 0,
    totalExercicios: 0,
    taxaAcertoGeral: 100
  });
  const [pendentesCount, setPendentesCount] = useState(0);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [mats, lsns, exs, tms, alns] = await Promise.all([
          adminApi.getMaterias().catch(() => []),
          adminApi.getAulas().catch(() => []),
          adminApi.getExercicios().catch(() => []),
          adminApi.getTemasRedacao().catch(() => []),
          adminApi.getAlunos().catch(() => [])
        ]);

        const pendentes = (alns || []).filter(a => a.statusPlano === 'pendente');
        setPendentesCount(pendentes.length);

        setStats({
          totalAlunos: Array.isArray(alns) ? alns.length : 0,
          totalMaterias: Array.isArray(mats) ? mats.length : 0,
          totalAulas: Array.isArray(lsns) ? lsns.length : 0,
          totalExercicios: Array.isArray(exs) ? exs.length : 0,
          taxaAcertoGeral: 100
        });
      } catch {}
    };

    loadStats();
  }, []);

  const statCards = [
    {
      label: 'Módulos Cadastrados',
      value: stats.totalMaterias,
      icon: <BookOpen size={20} color="var(--accent)" />,
      change: stats.totalMaterias > 0 ? `${stats.totalMaterias} ativos` : 'Nenhum módulo cadastrado'
    },
    {
      label: 'Aulas na Plataforma',
      value: stats.totalAulas,
      icon: <FileCheck size={20} color="var(--success)" />,
      change: stats.totalAulas > 0 ? `${stats.totalAulas} aulas disponíveis` : 'Pronto para novos uploads'
    },
    {
      label: 'Banco de Exercícios',
      value: stats.totalExercicios,
      icon: <HelpCircle size={20} color="var(--warning)" />,
      change: stats.totalExercicios > 0 ? `${stats.totalExercicios} listas criadas` : 'Cadastre suas primeiras questões'
    },
    {
      label: 'Alunos Matriculados',
      value: stats.totalAlunos,
      icon: <Users size={20} color="#2563eb" />,
      change: pendentesCount > 0 ? `${pendentesCount} aguardando liberação` : (stats.totalAlunos > 0 ? 'Turma ativa' : 'Nenhum aluno registrado')
    }
  ];

  const quickActions = [
    {
      title: 'Módulos & Aulas',
      description: 'Adicionar novas aulas, editar títulos, vídeos, PDFs e resumos teóricos.',
      icon: <BookOpen size={22} style={{ color: 'var(--accent)' }} />,
      path: '/professor/aulas',
      btnLabel: 'Gerenciar Aulas'
    },
    {
      title: 'Banco de Questões',
      description: 'Criar e editar questões com alternativas A-E, bancas e gabarito comentado.',
      icon: <HelpCircle size={22} style={{ color: 'var(--warning)' }} />,
      path: '/professor/exercicios',
      btnLabel: 'Gerenciar Questões'
    },
    {
      title: 'Simulados & Provas',
      description: 'Configurar provas cronometradas, tempo limite e correção automática.',
      icon: <FileCheck size={22} style={{ color: 'var(--success)' }} />,
      path: '/professor/simulados',
      btnLabel: 'Gerenciar Simulados'
    },
    {
      title: 'Diagnóstico & Nivelamento',
      description: 'Editar o teste inicial de nivelamento que define a trilha personalizada dos alunos.',
      icon: <Sparkles size={22} style={{ color: 'var(--accent)' }} />,
      path: '/professor/diagnostico',
      btnLabel: 'Configurar Teste'
    },
    {
      title: 'Correção de Redações',
      description: 'Avaliar redações dos alunos e cadastrar novas propostas temáticas dissertativas.',
      icon: <PenTool size={22} style={{ color: '#2563eb' }} />,
      path: '/professor/redacoes',
      btnLabel: 'Avaliar Redações'
    },
    {
      title: 'Materiais de Apoio',
      description: 'Cadastrar apostilas em PDF, mapas mentais e cadernos de estudo para download.',
      icon: <Download size={22} style={{ color: 'var(--text-primary)' }} />,
      path: '/professor/materiais',
      btnLabel: 'Gerenciar PDFs'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Alerta de Matrículas Pendentes */}
      {pendentesCount > 0 && (
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
                width: '38px',
                height: '38px',
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
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#92400e', margin: 0 }}>
                {pendentesCount} {pendentesCount === 1 ? 'Matrícula Pendente' : 'Matrículas Pendentes'} de Aprovação
              </h4>
              <p style={{ fontSize: '0.8125rem', color: '#b45309', margin: 0 }}>
                Novos alunos cadastrados aguardando confirmação do plano docente.
              </p>
            </div>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/professor/alunos')}
            style={{ backgroundColor: '#d97706', borderColor: '#d97706', fontWeight: 700 }}
          >
            Aprovar Matrículas no Painel
            <ArrowRight size={14} style={{ marginLeft: '4px' }} />
          </Button>
        </Card>
      )}

      {/* Banner Highlight: Guia Rápido de Uploads */}
      <Card
        variant="elevated"
        padding="lg"
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid var(--accent)',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(124, 58, 237, 0.08)',
          background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.03) 0%, rgba(255, 255, 255, 1) 100%)'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--accent)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)'
                }}
              >
                <Sparkles size={24} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                    Guia Rápido de Uploads — Como Alimentar sua Plataforma
                  </h3>
                  <Badge variant="purple" size="sm">Profª Wilma Barbosa</Badge>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                  Banco de dados limpo e preparado para estrear. Siga o fluxo abaixo para cadastrar suas primeiras aulas, simulados e apostilas.
                </p>
              </div>
            </div>

            <Button
              variant="primary"
              size="sm"
              icon={<Sparkles size={15} />}
              onClick={() => setGuiaAberto(true)}
              style={{ fontWeight: 700, backgroundColor: 'var(--accent)', borderColor: 'var(--accent)' }}
            >
              Abrir Guia Passo a Passo Completo
            </Button>
          </div>

          {/* Atalhos Rápidos dos 5 Passos de Upload */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
            <div
              onClick={() => navigate('/professor/aulas')}
              style={{
                padding: '0.875rem 1rem',
                borderRadius: '10px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: '#ffffff',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '0.5rem'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent)' }}>PASSO 1</span>
                <BookOpen size={16} color="var(--accent)" />
              </div>
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Módulos & Aulas</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0' }}>Cadastrar módulos, vídeos do YouTube e resumos</p>
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent)' }}>Subir Aulas →</span>
            </div>

            <div
              onClick={() => navigate('/professor/exercicios')}
              style={{
                padding: '0.875rem 1rem',
                borderRadius: '10px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: '#ffffff',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '0.5rem'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--warning)')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--warning)' }}>PASSO 2</span>
                <HelpCircle size={16} color="var(--warning)" />
              </div>
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Banco de Questões</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0' }}>Criar alternativas A-E e gabarito comentado</p>
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--warning)' }}>Criar Questões →</span>
            </div>

            <div
              onClick={() => navigate('/professor/simulados')}
              style={{
                padding: '0.875rem 1rem',
                borderRadius: '10px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: '#ffffff',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '0.5rem'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--success)')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--success)' }}>PASSO 3</span>
                <FileCheck size={16} color="var(--success)" />
              </div>
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Simulados Reais</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0' }}>Definir banca, tempo de prova e pontuação</p>
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--success)' }}>Publicar Provas →</span>
            </div>

            <div
              onClick={() => navigate('/professor/materiais')}
              style={{
                padding: '0.875rem 1rem',
                borderRadius: '10px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: '#ffffff',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '0.5rem'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#2563eb')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563eb' }}>PASSO 4</span>
                <Download size={16} color="#2563eb" />
              </div>
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Apostilas em PDF</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0' }}>Cadernos de apoio, leitor inline e download</p>
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#2563eb' }}>Subir PDFs →</span>
            </div>

            <div
              onClick={() => navigate('/professor/vestibular')}
              style={{
                padding: '0.875rem 1rem',
                borderRadius: '10px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: '#ffffff',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '0.5rem'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#7c3aed')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#7c3aed' }}>PASSO 5</span>
                <GraduationCap size={16} color="#7c3aed" />
              </div>
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Temas & Redações</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0' }}>Propor temas ENEM/FUVEST e corrigir textos</p>
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#7c3aed' }}>Lançar Temas →</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        {statCards.map((s, idx) => (
          <Card key={idx} padding="md">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                {s.label}
              </span>
              <div style={{ padding: '6px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-surface-2)' }}>
                {s.icon}
              </div>
            </div>
            <div style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
              {s.value}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              {s.change}
            </span>
          </Card>
        ))}
      </div>

      {/* Central de Modificação da Plataforma */}
      <div>
        <div style={{ marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Central de Modificação & Gestão da Plataforma
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Acesso direto para cadastrar, editar e excluir qualquer entidade e conteúdo pedagógico
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {quickActions.map((action, i) => (
            <Card key={i} padding="lg" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div style={{ padding: '8px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-surface-2)' }}>
                    {action.icon}
                  </div>
                  <h4 style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {action.title}
                  </h4>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                  {action.description}
                </p>
              </div>

              <Button
                variant="secondary"
                size="sm"
                icon={<ArrowRight size={14} />}
                onClick={() => navigate(action.path)}
                style={{ alignSelf: 'flex-start' }}
              >
                {action.btnLabel}
              </Button>
            </Card>
          ))}
        </div>
      </div>

      {/* Modal Interativo do Guia de Uploads */}
      <GuiaUploadModal isOpen={guiaAberto} onClose={() => setGuiaAberto(false)} />
    </div>
  );
};
