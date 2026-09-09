import { initPage } from './page-base.js';
import { getContents } from './storage.js';

initPage();

const listEl = document.getElementById('studentContentList');
const countEl = document.getElementById('contentsCount');
const viewer = document.getElementById('contentViewer');

const openViewer = (content) => {
	if (!viewer) return;
	viewer.setAttribute('aria-hidden', 'false');
	const blocksHtml = (content.blocos || []).map((b, idx) => {
		if (b.tipo === 'texto') return `<section class="panel-card"><h4>${b.titulo || ''}</h4><div>${b.conteudo}</div></section>`;
		if (b.tipo === 'pdf') return `<section class="panel-card"><h4>${b.titulo || ''}</h4><p><a href="${b.pdf}" target="_blank">Abrir PDF: ${b.nome}</a></p></section>`;
		if (b.tipo === 'video') return `<section class="panel-card"><h4>${b.titulo || ''}</h4><p><a href="${b.link}" target="_blank">Abrir video</a></p></section>`;
		if (b.tipo === 'link') return `<section class="panel-card"><h4>${b.titulo || ''}</h4><p><a href="${b.link}" target="_blank">Abrir link</a></p></section>`;
		return '';
	}).join('');

	viewer.innerHTML = `
		<div class="modal-overlay" style="display:block; padding:2rem;">
			<div class="modal-card">
				<button type="button" class="modal-close" id="closeViewer">×</button>
				<div class="modal-header">
					<h2>${content.titulo}</h2>
					<p>${content.descricao || ''}</p>
				</div>
				<div class="modal-body">${blocksHtml}</div>
			</div>
		</div>
	`;

	document.getElementById('closeViewer')?.addEventListener('click', () => {
		viewer.innerHTML = '';
		viewer.setAttribute('aria-hidden', 'true');
	});
};

const renderList = () => {
	if (!listEl) return;
	const contents = getContents().filter((c) => c.status === 'publicado');
	countEl.textContent = String(contents.length);
	if (!contents.length) {
		listEl.innerHTML = `<div class="activity-item"><strong>Nenhum conteúdo publicado</strong><p>Aguarde o professor publicar o material.</p></div>`;
		return;
	}

	listEl.innerHTML = contents.map((c) => `
		<article class="video-lesson-card">
			<div class="video-lesson-header">
				<h3>${c.titulo}</h3>
				<span class="video-lesson-badge recorded">${c.tema || ''}</span>
			</div>
			<p>${c.descricao || ''}</p>
			<div class="video-lesson-meta">
				<span>📚 ${c.blocos?.length || 0} blocos</span>
				<span>🎯 ${c.nivel || '—'}</span>
			</div>
			<div class="video-lesson-actions">
				<button class="btn btn-primary" data-open-content="${c.id}">Abrir</button>
			</div>
		</article>
	`).join('');

	listEl.addEventListener('click', (e) => {
		const btn = e.target.closest('[data-open-content]');
		if (!btn) return;
		const id = btn.dataset.openContent;
		const content = getContents().find((x) => x.id === id);
		if (content) openViewer(content);
	});
};

renderList();
