import React from 'react';
import { FolderDown, FileText, Download, Bookmark } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useToast } from '../../context/ToastContext';

export const StudentMateriais: React.FC = () => {
  const { showToast } = useToast();

  const materiais = [
    {
      id: 'mat-1',
      titulo: 'Guia Definitivo do Novo Acordo Ortográfico (PDF)',
      categoria: 'Ortografia & Hífen',
      tamanho: '2.4 MB',
      formato: 'PDF',
      descricao: 'Tabela comparativa completa das regras de hífen, queda de acentos diferenciais e regras de paroxítonas.'
    },
    {
      id: 'mat-2',
      titulo: 'Mapa Mental — Sintaxe Oracional & Termos da Oração',
      categoria: 'Análise Sintática',
      tamanho: '1.8 MB',
      formato: 'PDF',
      descricao: 'Esquema visual colorido com macetes para diferenciar Adjunto Adnominal de Complemento Nominal.'
    },
    {
      id: 'mat-3',
      titulo: 'Compêndio de Regência Verbal com 150 Verbos Mais Cobrados',
      categoria: 'Regência & Crase',
      tamanho: '3.1 MB',
      formato: 'PDF',
      descricao: 'Verbos que mudam de sentido conforme a preposição exigida (assistir, aspirar, visar, agradar, implicar).'
    },
    {
      id: 'mat-4',
      titulo: 'Caderno de 100 Conectivos e Operadores Argumentativos',
      categoria: 'Redação Dissertativa',
      tamanho: '1.2 MB',
      formato: 'PDF',
      descricao: 'Lista completa de repertórios e conectivos de coesão interparágrafo para alcançar nota 200 na Competência 4.'
    }
  ];

  const handleDownload = (titulo: string) => {
    showToast(`Iniciando download do material: "${titulo}"`, 'success');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.25rem' }}>
          Materiais de Apoio & Downloads
        </h1>
        <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)' }}>
          Apostilas digitais, resumos esquematizados e mapas mentais para revisão rápida
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {materiais.map((mat) => (
          <Card
            key={mat.id}
            variant="interactive"
            padding="lg"
            style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1.25rem' }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <Badge variant="purple" size="sm">
                  {mat.categoria}
                </Badge>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {mat.tamanho}
                </span>
              </div>

              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#fff', marginBottom: '0.5rem' }}>
                {mat.titulo}
              </h3>

              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {mat.descricao}
              </p>
            </div>

            <Button
              variant="secondary"
              size="md"
              icon={<Download size={16} />}
              onClick={() => handleDownload(mat.titulo)}
              style={{ width: '100%' }}
            >
              Baixar Material em PDF
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};
