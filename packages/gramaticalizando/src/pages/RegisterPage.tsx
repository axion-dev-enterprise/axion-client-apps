import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  User as UserIcon,
  Mail,
  Lock,
  ArrowRight,
  CheckCircle2,
  Copy,
  Check,
  MessageCircle,
  Sparkles,
  Shield,
  Clock
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../context/AuthContext';
import { PlanoTipo } from '../types/auth';

const PLANOS_INFO = {
  iniciante: {
    numero: 1,
    nome: 'Plano Iniciante',
    preco: 'R$ 29,00/mês',
    descricao: '7 Módulos de Gramática + 500 Questões',
    badge: null
  },
  medio: {
    numero: 2,
    nome: 'Plano Médio',
    preco: 'R$ 47,90/mês',
    descricao: 'Tudo do Iniciante + Redações com Correção + Simulados',
    badge: 'MAIS ESCOLHIDO'
  },
  pro: {
    numero: 3,
    nome: 'Plano Pro (Mentoria VIP)',
    preco: 'R$ 120,00/mês',
    descricao: 'Aulas + Redações Ilimitadas + Mentoria Individual com a Profa. Wilma',
    badge: 'MENTORIA VIP'
  }
};

export const RegisterPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialPlanoParam = searchParams.get('plano') as PlanoTipo;
  const initialPlano: PlanoTipo = (initialPlanoParam && ['iniciante', 'medio', 'pro'].includes(initialPlanoParam))
    ? initialPlanoParam
    : 'medio';

  const [plano, setPlano] = useState<PlanoTipo>(initialPlano);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmSenha, setConfirmSenha] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Estado de Sucesso / Código de Referência
  const [cadastroConcluido, setCadastroConcluido] = useState(false);
  const [dadosSucesso, setDadosSucesso] = useState<{
    codigoReferencia: string;
    plano: PlanoTipo;
    nome: string;
    email: string;
  } | null>(null);
  const [copiado, setCopiado] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !email || !senha) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    if (senha !== confirmSenha) {
      setError('As senhas não coincidem.');
      return;
    }
    if (senha.length < 6) {
      setError('A senha deve conter no mínimo 6 caracteres.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      await register({ nome, email, senha, plano });

      // Recuperar usuário atualizado do storage/context para pegar o código gerado
      const savedUserStr = localStorage.getItem('gramaticalizando_user');
      const savedUser = savedUserStr ? JSON.parse(savedUserStr) : null;
      const refCode = savedUser?.codigoReferencia || `GRAM-${Math.floor(1000 + Math.random() * 9000)}`;

      // Persistir imediatamente no espelho local compartilhado de alunos (Triple-layer storage)
      const novoAlunoLocal = {
        id: savedUser?.id || `local-${Date.now()}`,
        nome,
        email,
        plano,
        statusPlano: 'pendente',
        codigoReferencia: refCode,
        dataSolicitacaoPlano: new Date().toISOString(),
        criadoEm: new Date().toISOString(),
        aulasConcluidas: 0,
        exerciciosConcluidos: 0,
        taxaAcerto: 0
      };

      try {
        const storedStr = localStorage.getItem('gramaticalizando_registered_students');
        const storedList = storedStr ? JSON.parse(storedStr) : [];
        const semDuplicata = storedList.filter((a: any) => a.email.toLowerCase() !== email.toLowerCase());
        semDuplicata.unshift(novoAlunoLocal);
        localStorage.setItem('gramaticalizando_registered_students', JSON.stringify(semDuplicata));

        // Disparar sincronização entre abas
        window.dispatchEvent(new Event('storage'));
        if (typeof BroadcastChannel !== 'undefined') {
          const channel = new BroadcastChannel('gramaticalizando_channel');
          channel.postMessage({ type: 'NOVO_ALUNO', aluno: novoAlunoLocal });
          channel.close();
        }
      } catch {}

      setDadosSucesso({
        codigoReferencia: refCode,
        plano,
        nome,
        email
      });
      setCadastroConcluido(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setError(err.message || 'Falha ao realizar cadastro.');
    } finally {
      setIsLoading(false);
    }
  };

  const copiarCodigo = () => {
    if (dadosSucesso?.codigoReferencia) {
      navigator.clipboard.writeText(dadosSucesso.codigoReferencia);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    }
  };

  const getWhatsappUrl = () => {
    if (!dadosSucesso) return 'https://wa.me/5521992013060';
    const planoInfo = PLANOS_INFO[dadosSucesso.plano];
    const msg = `Olá, Professora Wilma! Acabei de me cadastrar na plataforma Gramaticalizando. Meu Código de Referência é *${dadosSucesso.codigoReferencia}* para ativação do *${planoInfo.nome}* (${planoInfo.preco}). Nome: ${dadosSucesso.nome} | E-mail: ${dadosSucesso.email}. Gostaria de confirmar minha matrícula!`;
    return `https://wa.me/5521992013060?text=${encodeURIComponent(msg)}`;
  };

  // =========================================================
  // ETAPA 2: TELA DE SUCESSO COM CÓDIGO E ENVIO WHATSAPP
  // =========================================================
  if (cadastroConcluido && dadosSucesso) {
    const planoInfo = PLANOS_INFO[dadosSucesso.plano];

    return (
      <Card variant="elevated" padding="lg" style={{ maxWidth: '520px', margin: '0 auto', textAlign: 'center' }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: '#dcfce7',
            color: '#16a34a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem auto'
          }}
        >
          <CheckCircle2 size={36} />
        </div>

        <Badge variant="purple" size="sm" style={{ marginBottom: '0.75rem' }}>
          MATRÍCULA REGISTRADA COM SUCESSO
        </Badge>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
          Código de Referência Gerado
        </h2>

        <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.5, marginBottom: '1.5rem' }}>
          Para liberar o acesso integral ao curso, envie seu código no WhatsApp da Professora Wilma para confirmação e ativação da sua matrícula.
        </p>

        {/* Card de Destaque do Código */}
        <div
          style={{
            backgroundColor: '#faf5ff',
            border: '2px dashed #c084fc',
            borderRadius: '12px',
            padding: '1.25rem',
            marginBottom: '1.5rem',
            position: 'relative'
          }}
        >
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6b21a8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Seu Código de Referência
          </span>
          <div
            style={{
              fontSize: '2rem',
              fontWeight: 800,
              fontFamily: 'monospace',
              letterSpacing: '0.1em',
              color: '#581c87',
              margin: '0.5rem 0'
            }}
          >
            {dadosSucesso.codigoReferencia}
          </div>
          <button
            type="button"
            onClick={copiarCodigo}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#ffffff',
              border: '1px solid #d8b4fe',
              color: '#6b21a8',
              borderRadius: '6px',
              padding: '0.375rem 0.75rem',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {copiado ? <Check size={14} color="#16a34a" /> : <Copy size={14} />}
            {copiado ? 'Código Copiado!' : 'Copiar Código'}
          </button>
        </div>

        {/* Resumo da Matrícula */}
        <div
          style={{
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            padding: '1rem',
            textAlign: 'left',
            fontSize: '0.8125rem',
            marginBottom: '1.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#64748b' }}>Plano Solicitado:</span>
            <strong style={{ color: '#0f172a' }}>{planoInfo.nome} ({planoInfo.preco})</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#64748b' }}>Aluno(a):</span>
            <strong style={{ color: '#0f172a' }}>{dadosSucesso.nome}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#64748b' }}>E-mail:</span>
            <span style={{ color: '#0f172a' }}>{dadosSucesso.email}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '0.5rem' }}>
            <span style={{ color: '#64748b' }}>Status Atual:</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#b45309', fontWeight: 600 }}>
              <Clock size={14} /> Aguardando Liberação Docente
            </span>
          </div>
        </div>

        {/* Ações: WhatsApp e Ir para Dashboard */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <a
            href={getWhatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none' }}
          >
            <Button
              variant="whatsapp"
              size="lg"
              icon={<MessageCircle size={20} />}
              style={{ width: '100%', fontSize: '0.9375rem', fontWeight: 700 }}
            >
              Enviar Mensagem no WhatsApp da Professora
            </Button>
          </a>

          <Button
            variant="outline"
            size="md"
            onClick={() => navigate('/home')}
            style={{ width: '100%' }}
          >
            Acessar Meu Painel de Estudos
            <ArrowRight size={16} style={{ marginLeft: '6px' }} />
          </Button>
        </div>
      </Card>
    );
  }

  // =========================================================
  // ETAPA 1: FORMULÁRIO COM SELEÇÃO DO PLANO
  // =========================================================
  return (
    <Card variant="elevated" padding="lg">
      <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.375rem' }}>
          Criar Nova Conta de Aluno
        </h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Cadastre-se e selecione seu plano para iniciar a preparação
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

        {/* Seletor Visual de Planos (1, 2 ou 3) */}
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            Selecione a Intenção do seu Plano:
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.625rem' }}>
            {(Object.keys(PLANOS_INFO) as PlanoTipo[]).map((key) => {
              const p = PLANOS_INFO[key];
              const selecionado = plano === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setPlano(key)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    padding: '0.75rem 0.5rem',
                    borderRadius: '10px',
                    backgroundColor: selecionado ? '#faf5ff' : '#ffffff',
                    border: selecionado ? '2px solid #6b21a8' : '1px solid #e2e8f0',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    position: 'relative'
                  }}
                >
                  {p.badge && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '-8px',
                        backgroundColor: '#6b21a8',
                        color: '#ffffff',
                        fontSize: '0.5625rem',
                        fontWeight: 800,
                        padding: '1px 5px',
                        borderRadius: '999px',
                        letterSpacing: '0.04em'
                      }}
                    >
                      {p.badge}
                    </span>
                  )}
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: selecionado ? '#6b21a8' : '#64748b' }}>
                    Plano {p.numero}
                  </span>
                  <strong style={{ fontSize: '0.875rem', color: '#0f172a', margin: '2px 0' }}>
                    {key === 'iniciante' ? 'Iniciante' : key === 'medio' ? 'Médio' : 'Pro VIP'}
                  </strong>
                  <span style={{ fontSize: '0.75rem', color: selecionado ? '#581c87' : '#64748b', fontWeight: 600 }}>
                    {p.preco.split('/')[0]}
                  </span>
                </button>
              );
            })}
          </div>
          <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.375rem' }}>
            {PLANOS_INFO[plano].descricao}
          </p>
        </div>

        <Input
          label="Nome Completo"
          type="text"
          placeholder="Seu nome completo"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          icon={<UserIcon size={16} />}
          required
        />

        <Input
          label="E-mail"
          type="email"
          placeholder="seu.email@exemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<Mail size={16} />}
          required
        />

        <Input
          label="Senha"
          type="password"
          placeholder="Mínimo de 6 caracteres"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          icon={<Lock size={16} />}
          required
        />

        <Input
          label="Confirmar Senha"
          type="password"
          placeholder="Repita a senha"
          value={confirmSenha}
          onChange={(e) => setConfirmSenha(e.target.value)}
          icon={<Lock size={16} />}
          required
        />

        {error && (
          <div
            style={{
              padding: '0.75rem',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--danger-bg)',
              border: '1px solid var(--danger-border)',
              color: 'var(--danger)',
              fontSize: '0.8125rem'
            }}
          >
            {error}
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          icon={<ArrowRight size={18} />}
          style={{ width: '100%', marginTop: '0.5rem' }}
        >
          Finalizar Cadastro & Gerar Código
        </Button>
      </form>

      <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
        Já possui cadastro?{' '}
        <Link to="/login" style={{ color: 'var(--accent-hover)', fontWeight: 600 }}>
          Entrar na minha conta
        </Link>
      </div>
    </Card>
  );
};
