import { initPage } from './page-base.js';
import { getStudyPlan, toggleStudyStage } from './storage.js';

initPage();
const list = document.getElementById('scheduleList');
const escapeHtml = (value = '') => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
const formatDate = (value) => { if (!value) return 'Data não definida'; return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(`${value}T00:00:00`)); };
const resourceButton = (stage) => {
  const link = String(stage.recursoLink || '').trim();
  const type = stage.recursoTipo === 'Questão' ? 'PDF' : (stage.recursoTipo || 'Recurso');
  const name = stage.recursoNome || type;
  if (!link) return `<span class="schedule-resource-missing">${escapeHtml(type)} sem endereço</span>`;
  if (type === 'Imagem' && /^(data:image\/|https?:\/\/)/i.test(link)) return `<a class="schedule-resource-button" href="${escapeHtml(link)}" target="_blank" rel="noopener noreferrer">Ver imagem</a>`;
  if (!/^https?:\/\//i.test(link) && !/^data:application\/pdf/i.test(link)) return `<span class="schedule-resource-missing">Endereço inválido</span>`;
  const labels = { PDF: 'Abrir PDF', Link: 'Abrir link', Videoaula: 'Assistir videoaula' };
  return `<a class="schedule-resource-button" href="${escapeHtml(link)}" target="_blank" rel="noopener noreferrer">${labels[type] || `Abrir ${escapeHtml(name)}`}</a>`;
};

const questionMarkup = (stage) => {
  if (stage.recursoTipo !== 'Questão' || !stage.questao?.enunciado) return '';
  return `<div class="schedule-question"><strong>Questão</strong><p>${escapeHtml(stage.questao.enunciado)}</p><ol>${(stage.questao.alternativas || []).map((option) => `<li>${escapeHtml(option)}</li>`).join('')}</ol></div>`;
};

const render = () => {
  const plan = getStudyPlan();
  const stages = Array.isArray(plan.etapas) ? plan.etapas : [];
  const completed = stages.filter((stage) => stage.concluido).length;
  document.getElementById('planTitle').textContent = plan.nome || 'Meu plano de estudos';
  document.getElementById('planObjective').textContent = plan.objetivo || 'Acompanhe suas etapas e marque cada estudo concluído.';
  document.getElementById('planPeriod').textContent = plan.inicio && plan.fim ? `${formatDate(plan.inicio)} até ${formatDate(plan.fim)}` : 'Não definido';
  document.getElementById('planProgressText').textContent = `${completed} de ${stages.length} etapas concluídas`;
  document.getElementById('stageCount').textContent = String(stages.length);
  document.getElementById('planProgressBar').style.width = `${stages.length ? Math.round((completed / stages.length) * 100) : 0}%`;
  if (!stages.length) { list.innerHTML = '<div class="schedule-empty"><strong>Nenhum cronograma publicado ainda.</strong><p>Quando o professor criar um plano, suas etapas aparecerão aqui.</p></div>'; return; }
  list.innerHTML = stages.map((stage, index) => `<article class="schedule-stage ${stage.concluido ? 'is-complete' : ''}"><label class="schedule-stage-check"><input type="checkbox" data-stage-id="${escapeHtml(stage.id)}" ${stage.concluido ? 'checked' : ''}><span aria-hidden="true"></span></label><div class="schedule-stage-body"><div class="schedule-stage-top"><span class="schedule-stage-number">Etapa ${index + 1}</span><span class="schedule-stage-matter">${escapeHtml(stage.materia || 'Estudo')}</span>${stage.data ? `<time datetime="${escapeHtml(stage.data)}">${formatDate(stage.data)}</time>` : ''}</div><h3>${escapeHtml(stage.titulo || 'Etapa de estudo')}</h3>${stage.descricao ? `<p>${escapeHtml(stage.descricao)}</p>` : ''}${questionMarkup(stage)}<div class="schedule-stage-meta">${stage.recursoTipo && stage.recursoTipo !== 'Questão' ? `<span>📎 ${escapeHtml(stage.recursoTipo)}${stage.recursoNome ? `: ${escapeHtml(stage.recursoNome)}` : ''}</span>` : ''}${stage.recursoTipo !== 'Questão' ? resourceButton(stage) : ''}</div></div><strong class="schedule-stage-status">${stage.concluido ? 'Feito' : 'Marcar como feito'}</strong></article>`).join('');
};

list.addEventListener('change', (event) => { const checkbox = event.target.closest('[data-stage-id]'); if (!checkbox) return; toggleStudyStage(checkbox.dataset.stageId); render(); });
render();
