import { initProfessorPage } from './base.js';
import { getContents, deleteContent, updateContent } from '../storage.js';

const session = initProfessorPage('portugues');
if (!session) throw new Error('Acesso negado.');

const listEl = document.getElementById('contentList');
const createBtn = document.getElementById('createContentBtn');

const renderContents = () => {
	if (!listEl) return;
	const contents = getContents();
	if (!contents.length) {
		listEl.innerHTML = `<div class="activity-item"><strong>Nenhum conteúdo cadastrado</strong><p>Clique em "Criar conteúdo" para começar.</p></div>`;
		return;
	}

	listEl.innerHTML = contents.map((c) => `
		<article class="card-item">
			<div class="activity-meta">
				<strong>${c.titulo}</strong>
				<span>${c.status || 'rascunho'}</span>
			</div>
			<p><strong>Tema:</strong> ${c.tema || '—'}</p>
			<p><strong>Nível:</strong> ${c.nivel || '—'}</p>
			<p><strong>Blocos:</strong> ${Array.isArray(c.blocos) ? c.blocos.length : 0}</p>
			<div class="action-buttons">
				<button type="button" class="btn btn-secondary" data-edit-content="${c.id}">Editar</button>
				<button type="button" class="btn btn-primary" data-toggle-publish="${c.id}">${c.status === 'publicado' ? 'Despublicar' : 'Publicar'}</button>
				<button type="button" class="btn btn-danger" data-delete-content="${c.id}">Excluir</button>
			</div>
		</article>
	`).join('');
};

listEl?.addEventListener('click', (event) => {
	const editBtn = event.target.closest('[data-edit-content]');
	const delBtn = event.target.closest('[data-delete-content]');
	const toggleBtn = event.target.closest('[data-toggle-publish]');

	if (editBtn) {
		const id = editBtn.dataset.editContent;
		window.location.href = `./portugues-criar.html?id=${encodeURIComponent(id)}`;
		return;
	}

	if (toggleBtn) {
		const id = toggleBtn.dataset.togglePublish;
		const contents = getContents();
		const match = contents.find((c) => c.id === id);
		if (!match) return;
		const nextStatus = match.status === 'publicado' ? 'rascunho' : 'publicado';
		updateContent(id, { status: nextStatus });
		renderContents();
		return;
	}

	if (delBtn) {
		const id = delBtn.dataset.deleteContent;
		if (!window.confirm('Deseja excluir este conteúdo?')) return;
		deleteContent(id);
		renderContents();
	}
});

createBtn?.addEventListener('click', () => {
	window.location.href = './portugues-criar.html';
});

renderContents();
