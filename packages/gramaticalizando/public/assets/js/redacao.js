import { initPage } from './page-base.js';
import { getSession, getEssays, createEssay } from './storage.js';

initPage();

const writeModal = document.querySelector('[data-modal-overlay]');
const correctionModal = document.querySelector('[data-correction-modal]');
const openModalButton = document.getElementById('openWriteModal');
const closeModalButtons = document.querySelectorAll('[data-modal-close]');
const correctionCloseButtons = document.querySelectorAll('[data-correction-close]');
const regenerateThemeButton = document.getElementById('regenerateTheme');
const generatedThemeElement = document.getElementById('generatedTheme');
const essayThemeInput = document.getElementById('essayTheme');
const essayPhotoInput = document.getElementById('essayPhoto');
const photoPreview = document.getElementById('photoPreview');
const correctionMessage = document.getElementById('correctionMessage');
const essayForm = document.getElementById('essayForm');
const essayHistory = document.getElementById('essayHistory');

const themes = [
  'A importância da educação crítica na formação cidadã.',
  'Os desafios do ensino híbrido e a inclusão digital.',
  'Como desenvolver o pensamento crítico no ambiente escolar.',
  'Os impactos da tecnologia na qualidade da aprendizagem.',
  'A leitura como ferramenta de construção de conhecimento.',
  'O papel da escola na promoção da saúde mental dos estudantes.',
  'A influência das redes sociais no comportamento dos jovens.',
  'Educação ambiental: desafios para a escola do século XXI.',
  'A valorização dos professores na sociedade contemporânea.',
  'Como a escrita contribui para a argumentação em debates públicos.',
];

const session = getSession();

const getRandomTheme = () => {
  return themes[Math.floor(Math.random() * themes.length)];
};

const toggleModal = (visible) => {
  writeModal.classList.toggle('hidden', !visible);
  if (visible) {
    generatedThemeElement.textContent = getRandomTheme();
    essayThemeInput.value = generatedThemeElement.textContent;
    essayPhotoInput.value = '';
    photoPreview.innerHTML = '';
  }
};

const openCorrectionModal = (feedback, original) => {
  // feedback can be string or object; original is dataURL of original image
  const imgContainer = document.getElementById('correctionImageContainer');
  const downloadOriginalBtn = document.getElementById('downloadOriginalBtn');
  const downloadCorrectionBtn = document.getElementById('downloadCorrectionBtn');

  // reset
  imgContainer.innerHTML = '';
  downloadOriginalBtn.style.display = 'none';
  downloadCorrectionBtn.style.display = 'none';
  downloadOriginalBtn.href = '#';
  downloadCorrectionBtn.href = '#';

  if (!feedback) {
    correctionMessage.innerHTML = 'Nenhuma correção disponível no momento. Aguarde o professor analisar a redação.';
  } else if (typeof feedback === 'string') {
    correctionMessage.textContent = feedback;
  } else {
    const parts = [];
    if (feedback.nota != null && feedback.nota !== '') parts.push(`<p><strong>Nota:</strong> ${feedback.nota}/10</p>`);
    if (feedback.message) parts.push(`<p>${feedback.message}</p>`);
    correctionMessage.innerHTML = parts.join('');
    if (feedback.foto) {
      imgContainer.innerHTML = `<div class="essay-photo"><img src="${feedback.foto}" alt="Foto da correção"></div>`;
      downloadCorrectionBtn.href = feedback.foto;
      downloadCorrectionBtn.style.display = 'inline-block';
    }
  }

  if (original) {
    downloadOriginalBtn.href = original;
    downloadOriginalBtn.style.display = 'inline-block';
  }

  correctionModal.classList.remove('hidden');
};

const closeCorrectionModal = () => {
  correctionModal.classList.add('hidden');
};

const createThumbnail = (file) => {
  const reader = new FileReader();
  reader.onload = (event) => {
    photoPreview.innerHTML = `<img src="${event.target.result}" alt="Foto da redação">`;
  };
  reader.readAsDataURL(file);
};

essayPhotoInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    createThumbnail(file);
  } else {
    photoPreview.innerHTML = '';
  }
});

openModalButton.addEventListener('click', () => toggleModal(true));
closeModalButtons.forEach((button) => {
  button.addEventListener('click', () => toggleModal(false));
});
correctionCloseButtons.forEach((button) => {
  button.addEventListener('click', () => closeCorrectionModal());
});

regenerateThemeButton.addEventListener('click', () => {
  const theme = getRandomTheme();
  generatedThemeElement.textContent = theme;
  essayThemeInput.value = theme;
});

const renderHistory = () => {
  const essays = getEssays().slice().reverse();

  if (!essays.length) {
    essayHistory.innerHTML = `
      <article class="dashboard-card">
        <h3>Nenhuma redação encontrada</h3>
        <p>Crie uma nova redação clicando em "Criar redação" para começar seu histórico.</p>
      </article>
    `;
    return;
  }

  essayHistory.innerHTML = essays.map((essay) => {
    return `
      <article class="dashboard-card essay-card">
        <div class="essay-card-header">
          <div>
            <h3>${essay.tema_da_redacao || essay.tema_gerado}</h3>
            <p class="status-badge ${essay.status}">${essay.status === 'concluido' ? 'Concluído' : 'Pendente'}</p>
          </div>
          <span>${new Date(essay.criadoEm).toLocaleDateString('pt-BR')}</span>
        </div>
        <p><strong>Tema gerado:</strong> ${essay.tema_gerado}</p>
        <p><strong>Enviado como:</strong> ${essay.tema_da_redacao}</p>
        ${essay.texto ? `<p class="essay-excerpt">${essay.texto.slice(0, 160)}${essay.texto.length > 160 ? '...' : ''}</p>` : '<p class="essay-excerpt">Redação enviada como imagem.</p>'}
        ${essay.foto ? `<div class="essay-photo"><img src="${essay.foto}" alt="Foto da redação"></div>` : ''}
        <div class="essay-actions">
          <button type="button" class="btn btn-secondary" data-view-correction="${essay.id}">Ver correção</button>
        </div>
      </article>
    `;
  }).join('');

  essayHistory.querySelectorAll('[data-view-correction]').forEach((button) => {
    button.addEventListener('click', (event) => {
      const essayId = event.currentTarget.getAttribute('data-view-correction');
      const essay = getEssays().find((item) => item.id === essayId);
      const feedback = essay?.feedback || null;
      const original = essay?.foto || null;
      openCorrectionModal(feedback, original);
    });
  });
};

essayForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const theme = essayThemeInput.value.trim();
  const file = essayPhotoInput.files[0];

  if (!theme || !file) {
    alert('Envie a foto da redação pronta antes de salvar.');
    return;
  }

  const essayItem = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    tema_gerado: generatedThemeElement.textContent,
    tema_da_redacao: theme,
    texto: '',
    foto: '',
    feedback: '',
    status: 'pendente',
    criadoEm: new Date().toISOString(),
    autor: session?.email || 'anônimo',
  };

  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      essayItem.foto = event.target.result;
      createEssay(essayItem);
      renderHistory();
      toggleModal(false);
    };
    reader.readAsDataURL(file);
  } else {
    createEssay(essayItem);
    renderHistory();
    toggleModal(false);
  }
});

renderHistory();
