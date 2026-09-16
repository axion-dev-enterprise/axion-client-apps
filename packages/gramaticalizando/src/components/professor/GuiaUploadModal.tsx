import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  HelpCircle,
  FileCheck,
  Download,
  GraduationCap,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface GuiaUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface StepInfo {
  id: string;
  number: number;
  title: string;
  category: string;
  icon: React.ReactNode;
  route: string;
  badge: string;
  summary: string;
  checklist: string[];
  tips: string[];
}

export const GuiaUploadModal: React.FC<GuiaUploadModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [activeStepId, setActiveStepId] = useState<string>('aulas');

  const steps: StepInfo[] = [
    {
      id: 'aulas',
      number: 1,
      title: 'Módulos & Aulas Teóricas',
      category: 'Estrutura Curricular',
      icon: <BookOpen size={20} />,
      route: '/professor/aulas',
      badge: 'Passo 1 (Base)',
      summary: 'Organize o curso por grandes módulos temáticos e cadastre as aulas com resumos conceituais, links de vídeo e PDFs anexos.',
      checklist: [
        'Cadastre primeiro o Módulo (ex: "Sintaxe do Período Composto", "Fonética", "Morfologia").',
        'Crie a Aula vinculada ao módulo informando título, subtítulo e tempo estimado.',
        'Insira o link da videoaula (links do YouTube ou Vimeo são renderizados com player nativo).',
        'Adicione o resumo teórico conceitual no campo de conteúdo.',
        'Opcional: vincule o link do material complementar em PDF da aula.'
      ],
      tips: [
        'No YouTube, você pode usar vídeos públicos ou "Não Listados" (para que apenas seus alunos tenham acesso).',
        'A ordem das aulas pode ser definida numericamente (1, 2, 3...) para criar uma trilha progressiva de aprendizado.'
      ]
    },
    {
      id: 'exercicios',
      number: 2,
      title: 'Banco de Questões & Fixação',
      category: 'Avaliação Contínua',
      icon: <HelpCircle size={20} />,
      route: '/professor/exercicios',
      badge: 'Passo 2',
      summary: 'Adicione questões de múltipla escolha com gabarito oficial e justificativa pedagógica para os alunos treinarem após cada aula.',
      checklist: [
        'Clique em "Novo Exercício" ou crie uma lista de fixação vinculada ao Módulo ou Aula.',
        'Redija o enunciado da questão com clareza.',
        'Adicione as alternativas de múltipla escolha (A, B, C, D, E).',
        'Marque a alternativa correta como gabarito oficial com um clique.',
        'Redija a "Explicação do Gabarito" (comentário da Profª Wilma) para esclarecer as pegadinhas da banca.'
      ],
      tips: [
        'Ao responder, o aluno recebe feedback imediato e visualiza sua explicação gramatical.',
        'Indique a banca examinadora no enunciado ou na descrição (ex: Vunesp, FGV, FCC, Cespe).'
      ]
    },
    {
      id: 'simulados',
      number: 3,
      title: 'Simulados Cronometrados',
      category: 'Treinamento Real de Prova',
      icon: <FileCheck size={20} />,
      route: '/professor/simulados',
      badge: 'Passo 3',
      summary: 'Crie provas completas com cronômetro regressivo e apuração automática de aproveitamento para preparar os alunos para o dia do exame.',
      checklist: [
        'Defina o título do simulado e a banca examinadora (ex: "Simulado Vunesp — Nível Médio").',
        'Defina o tempo limite de prova em minutos (ex: 45 min ou 60 min).',
        'Adicione as questões do simulado com alternativas e gabarito comentado.',
        'Marque o status como "Publicado" para disponibilizar imediatamente aos alunos.'
      ],
      tips: [
        'A plataforma gerencia o cronômetro automaticamente com aviso visual quando faltarem menos de 5 minutos.',
        'Na entrega da prova, o aluno visualiza o relatório de acertos/erros e a nota percentual instantaneamente.'
      ]
    },
    {
      id: 'materiais',
      number: 4,
      title: 'Apostilas & Materiais em PDF',
      category: 'Downloads & Consulta',
      icon: <Download size={20} />,
      route: '/professor/materiais',
      badge: 'Passo 4',
      summary: 'Disponibilize apostilas digitais, cadernos de revisão e mapas mentais. A plataforma oferece leitor inline nativo e download direto.',
      checklist: [
        'Cadastre o material com título atraente e descrição do conteúdo abordado.',
        'Vincule à categoria ou módulo correspondente.',
        'Informe a quantidade de páginas e tamanho aproximado do arquivo.',
        'Insira o link ou URL do PDF gerado ou hospede no sistema.'
      ],
      tips: [
        'Os alunos contam com Leitor de PDF integrado com modo Tela Cheia diretamente na plataforma.',
        'O botão "Baixar Material em PDF" permite download com nome padronizado no navegador.'
      ]
    },
    {
      id: 'vestibular',
      number: 5,
      title: 'Vestibulares & Propostas de Redação',
      category: 'Alta Performance',
      icon: <GraduationCap size={20} />,
      route: '/professor/vestibular',
      badge: 'Passo 5',
      summary: 'Lance propostas de redação no padrão dos maiores vestibulares do país (ENEM, UERJ, FUVEST) e receba os textos para correção individualizada.',
      checklist: [
        'Cadastre uma Proposta Temática com exame (ENEM/UERJ/FUVEST), ano e data limite de envio.',
        'Forneça as instruções da banca e os textos motivadores para reflexão do aluno.',
        'Cadastre videoaulas estratégicas exclusivas de desconstrução de edital e matriz de correção.',
        'Acesse a aba "Correção de Redações" para atribuir notas por critério/competência e parecer pedagógico.'
      ],
      tips: [
        'Os alunos podem submeter a redação digitando no editor online ou enviando PDF com a folha manuscrita.',
        'Ao concluir a correção, o aluno recebe o espelho completo com a nota final e suas anotações.'
      ]
    }
  ];

  const currentStep = steps.find((s) => s.id === activeStepId) || steps[0];

  const handleGoToRoute = (path: string) => {
    onClose();
    navigate(path);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Guia Rápido de Uploads — Como Alimentar sua Plataforma"
      maxWidth="860px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Banner Introdutório */}
        <div
          style={{
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '1rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: 'var(--accent-light)',
                color: 'var(--accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <Sparkles size={20} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Ambiente Pronto para Conteúdos Oficiais da Profª Wilma Barbosa
              </h4>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>
                O banco de dados está limpo e preparado. Siga os 5 passos para publicar seu material didático.
              </p>
            </div>
          </div>
        </div>

        {/* Barra de Seleção de Passos (Stepper) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: '0.5rem',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '0.75rem'
          }}
        >
          {steps.map((step) => {
            const isSelected = step.id === currentStep.id;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => setActiveStepId(step.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.625rem 0.75rem',
                  borderRadius: '8px',
                  border: isSelected ? '1px solid var(--accent)' : '1px solid var(--border-subtle)',
                  backgroundColor: isSelected ? 'var(--accent-light)' : '#ffffff',
                  color: isSelected ? 'var(--accent)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontWeight: isSelected ? 700 : 500,
                  fontSize: '0.8125rem',
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
              >
                <div
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    backgroundColor: isSelected ? 'var(--accent)' : 'var(--bg-surface-2)',
                    color: isSelected ? '#ffffff' : 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    flexShrink: 0
                  }}
                >
                  {step.number}
                </div>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {step.title.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Detalhes do Passo Selecionado */}
        <div
          style={{
            border: '1px solid var(--border-subtle)',
            borderRadius: '12px',
            backgroundColor: '#ffffff',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <Badge variant="purple">{currentStep.badge}</Badge>
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  {currentStep.category}
                </span>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                {currentStep.title}
              </h3>
            </div>

            <Button
              variant="primary"
              size="sm"
              icon={<ArrowRight size={14} />}
              onClick={() => handleGoToRoute(currentStep.route)}
              style={{ fontWeight: 700 }}
            >
              Acessar Painel ({currentStep.title.split('&')[0].trim()})
            </Button>
          </div>

          <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
            {currentStep.summary}
          </p>

          {/* Checklist de Upload */}
          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
              Como Fazer o Cadastro Passo a Passo:
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {currentStep.checklist.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.625rem',
                    fontSize: '0.875rem',
                    color: 'var(--text-primary)',
                    lineHeight: 1.45
                  }}
                >
                  <CheckCircle2 size={16} color="var(--success)" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Dicas Pedagógicas & Formatos */}
          <div
            style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '0.875rem 1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--accent)', fontWeight: 700, fontSize: '0.8125rem' }}>
              <Info size={15} />
              <span>Dicas de Publicação da Equipe Técnica:</span>
            </div>
            {currentStep.tips.map((tip, idx) => (
              <p key={idx} style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.45 }}>
                • {tip}
              </p>
            ))}
          </div>
        </div>

        {/* Footer do Modal */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', paddingTop: '0.5rem' }}>
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            Dúvidas no upload? Você pode consultar este guia a qualquer momento pelo topo do painel.
          </span>
          <Button variant="outline" size="sm" onClick={onClose}>
            Fechar Guia
          </Button>
        </div>
      </div>
    </Modal>
  );
};
