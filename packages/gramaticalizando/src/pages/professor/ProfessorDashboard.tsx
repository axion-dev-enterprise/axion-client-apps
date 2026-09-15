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
  Plus
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { adminApi } from '../../api/admin';

export const ProfessorDashboard: React.FC = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalAlunos: 5,
    totalMaterias: 7,
    totalAulas: 36,
    totalExercicios: 6,
    taxaAcertoGeral: 78
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [mats, lsns, exs, tms] = await Promise.all([
          adminApi.getMaterias().catch(() => []),
          adminApi.getAulas().catch(() => []),
          adminApi.getExercicios().catch(() => []),
          adminApi.getTemasRedacao().catch(() => [])
        ]);

        setStats({
          totalAlunos: 5,
          totalMaterias: mats.length || 7,
          totalAulas: lsns.length || 36,
          totalExercicios: exs.length || 6,
          taxaAcertoGeral: 82
        });
      } catch {}
    };

    loadStats();
  }, []);

  const statCards = [
    { label: 'Módulos Cadastrados', value: stats.totalMaterias, icon: <BookOpen size={20} color="var(--accent)" />, change: '7 canônicos ativos' },
    { label: 'Aulas na Plataforma', value: stats.totalAulas, icon: <FileCheck size={20} color="var(--success)" />, change: '100% editáveis' },
    { label: 'Banco de Exercícios', value: stats.totalExercicios, icon: <HelpCircle size={20} color="var(--warning)" />, change: 'Bancas FGV/Vunesp' },
    { label: 'Alunos Matriculados', value: stats.totalAlunos, icon: <Users size={20} color="#2563eb" />, change: 'Turma ativa' }
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
    </div>
  );
};
