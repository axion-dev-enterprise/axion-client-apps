import React, { useState } from 'react';
import { FileCheck2, Clock, CheckCircle, XCircle, AlertCircle, RotateCcw } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Exercicio } from '../../types/courses';
import { useToast } from '../../context/ToastContext';

export const StudentSimulados: React.FC = () => {
  const [activeQuiz, setActiveQuiz] = useState<boolean>(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const { showToast } = useToast();

  const mockQuestions: Exercicio[] = [
    {
      id: 'sim-1',
      enunciado: 'Assinale a alternativa em que TODAS as palavras são acentuadas pela mesma regra de acentuação gráfica:',
      alternativas: [
        'Árvore, lâmpada, pássaro, pêssego.',
        'Café, cipó, você, táxi.',
        'Saúde, país, baú, ideia.',
        'Fácil, júri, bíceps, alguém.'
      ],
      respostaCorreta: 0,
      explicacao: 'Todas são proparoxítonas e, segundo a regra geral, TODAS as palavras proparoxítonas devem ser acentuadas.'
    },
    {
      id: 'sim-2',
      enunciado: 'Em relação ao Novo Acordo Ortográfico, assinale a oração gramaticalmente correta quanto ao uso do hífen:',
      alternativas: [
        'Ele tomou um remédio antiinflamatório pela manhã.',
        'O condomínio instalou um moderno sistema anti-incêndio.',
        'A empresa comprou um novo micro-ondas.',
        'O aluno tem excelente auto-estima.'
      ],
      respostaCorreta: 2,
      explicacao: 'Prefixos que terminam com a mesma vogal que inicia o segundo elemento recebem hífen obrigatoriamente: micro-ondas e anti-inflamatório. Autoestima junta-se sem hífen.'
    },
    {
      id: 'sim-3',
      enunciado: 'Indique a alternativa em que a regência do verbo e o emprego da crase obedecem à norma culta:',
      alternativas: [
        'Obedecemos às ordens do diretor sem hesitar.',
        'O rapaz assistiu o jogo pela televisão.',
        'Prefiro mais estudar do que trabalhar.',
        'Chegamos à uma hora adiantados.'
      ],
      respostaCorreta: 0,
      explicacao: 'O verbo OBEDECER é transitivo indireto (rege a preposição A). A preposição A + o artigo feminino AS resulta no acento grave indicativo de crase: "às ordens".'
    }
  ];

  const currentQuestion = mockQuestions[currentQuestionIndex];

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
  };

  const handleConfirmAnswer = () => {
    if (selectedOption === null) {
      showToast('Selecione uma alternativa antes de confirmar.', 'warning');
      return;
    }
    setIsAnswered(true);
    if (selectedOption === currentQuestion.respostaCorreta) {
      setScore((prev) => prev + 1);
      showToast('Resposta correta!', 'success');
    } else {
      showToast('Resposta incorreta. Veja a explicação detalhada.', 'error');
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    if (currentQuestionIndex < mockQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      showToast(`Simulado finalizado! Pontuação: ${score + (selectedOption === currentQuestion.respostaCorreta ? 0 : 0)} de ${mockQuestions.length}`, 'info');
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setActiveQuiz(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.25rem' }}>
          Simulados & Treinamento
        </h1>
        <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)' }}>
          Pratique com questões reais de bancas examinadoras e acompanhe sua taxa de acertos
        </p>
      </div>

      {!activeQuiz ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          <Card variant="elevated" padding="lg" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <Badge variant="purple" size="sm">
                  SIMULADO GERAL #01
                </Badge>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
                  <Clock size={14} />
                  <span>30 min</span>
                </div>
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>
                Gramática Geral & Acordo Ortográfico
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '1rem' }}>
                Avaliação com questões comentadas abordando divisão silábica, encontros consonantais, hífen, acentuação e termos da oração.
              </p>

              <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
                <span>• {mockQuestions.length} questões</span>
                <span>• Dificuldade: Média</span>
                <span>• Gabarito comentado</span>
              </div>
            </div>

            <Button
              variant="primary"
              size="md"
              icon={<FileCheck2 size={16} />}
              onClick={handleRestartQuiz}
            >
              Iniciar Simulado
            </Button>
          </Card>
        </div>
      ) : (
        <Card variant="elevated" padding="lg">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
            <Badge variant="purple" size="sm">
              Questão {currentQuestionIndex + 1} de {mockQuestions.length}
            </Badge>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Acertos: {score}
            </span>
          </div>

          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#ffffff', lineHeight: 1.5, marginBottom: '1.5rem' }}>
            {currentQuestion.enunciado}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.75rem' }}>
            {currentQuestion.alternativas.map((alt, index) => {
              const isSelected = selectedOption === index;
              const isCorrect = isAnswered && index === currentQuestion.respostaCorreta;
              const isWrong = isAnswered && isSelected && index !== currentQuestion.respostaCorreta;

              let borderColor = isSelected ? 'var(--accent)' : 'var(--border-subtle)';
              let bgColor = isSelected ? 'rgba(147, 51, 234, 0.1)' : 'var(--bg-surface-2)';

              if (isCorrect) {
                borderColor = 'var(--success)';
                bgColor = 'var(--success-bg)';
              } else if (isWrong) {
                borderColor = 'var(--danger)';
                bgColor = 'var(--danger-bg)';
              }

              return (
                <div
                  key={index}
                  onClick={() => handleSelectOption(index)}
                  style={{
                    padding: '1rem 1.25rem',
                    borderRadius: 'var(--radius-md)',
                    border: `1px solid ${borderColor}`,
                    backgroundColor: bgColor,
                    color: '#ffffff',
                    fontSize: '0.9375rem',
                    cursor: isAnswered ? 'default' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span
                      style={{
                        width: '1.75rem',
                        height: '1.75rem',
                        borderRadius: '50%',
                        backgroundColor: isSelected ? 'var(--accent)' : 'rgba(255, 255, 255, 0.08)',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.8125rem',
                        fontWeight: 700
                      }}
                    >
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span>{alt}</span>
                  </div>

                  {isCorrect && <CheckCircle size={20} color="var(--success)" />}
                  {isWrong && <XCircle size={20} color="var(--danger)" />}
                </div>
              );
            })}
          </div>

          {isAnswered && (
            <div
              style={{
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(147, 51, 234, 0.08)',
                border: '1px solid rgba(168, 85, 247, 0.25)',
                marginBottom: '1.5rem',
                color: 'var(--text-secondary)',
                fontSize: '0.875rem',
                lineHeight: 1.6
              }}
            >
              <h4 style={{ color: '#fff', fontWeight: 600, marginBottom: '0.375rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertCircle size={16} color="var(--accent-hover)" />
                Gabarito Comentado
              </h4>
              <p>{currentQuestion.explicacao}</p>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Button
              variant="ghost"
              size="sm"
              icon={<RotateCcw size={14} />}
              onClick={() => setActiveQuiz(false)}
            >
              Encerrar Simulado
            </Button>

            {!isAnswered ? (
              <Button
                variant="primary"
                size="md"
                onClick={handleConfirmAnswer}
              >
                Confirmar Resposta
              </Button>
            ) : (
              <Button
                variant="primary"
                size="md"
                onClick={handleNextQuestion}
              >
                {currentQuestionIndex < mockQuestions.length - 1 ? 'Próxima Questão →' : 'Finalizar Simulado'}
              </Button>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};
