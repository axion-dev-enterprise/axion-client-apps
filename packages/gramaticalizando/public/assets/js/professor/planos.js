import { initProfessorPage } from './base.js';
import {
  getPlans,
  createPlan,
  updatePlan,
  deletePlan,
  savePlans,
  assignPlanToStudent,
  getUsers,
  getStudentPermissions,
  canAccess,
} from '../storage.js';

const session = initProfessorPage('planos');
if (!session) throw new Error('Acesso negado.');

const plansGrid = document.getElementById('plansGrid');
const planSearch = document.getElementById('planSearch');
const openCreatePlanBtn = document.getElementById('openCreatePlanBtn');
const summaryTotalPlans = document.getElementById('summaryTotalPlans');
const summaryActivePlans = document.getElementById('summaryActivePlans');
const summaryInactivePlans = document.getElementById('summaryInactivePlans');
const summaryAssignedPlans = document.getElementById('summaryAssignedPlans');
const planModal = document.querySelector('[data-plan-modal]');
const planModalTitle = document.getElementById('planModalTitle');
const planForm = document.getElementById('planForm');
const planName = document.getElementById('planName');
const planPrice = document.getElementById('planPrice');
const planDescription = document.getElementById('planDescription');
const planStatus = document.getElementById('planStatus');
const savePlanBtn = document.getElementById('savePlanBtn');
const filters = document.querySelectorAll('[data-filter]');

let currentFilter = 'all';
let currentSearch = '';
let editingPlanId = null;

const permissionLabels = {
  portugues: 'Português',
  redacao: 'Redação',
  videoaulas: 'Videoaulas',
  simulados: 'Simulados',
  material: 'Material',
  cronograma: 'Cronograma'
};

const normalize = (value = '') => String(value || '').trim().toLowerCase();

const getFilteredPlans = () => {
  const plans = getPlans();

  return plans.filter((plan) => {
    const matchesSearch = !currentSearch || normalize(plan.name).includes(currentSearch) || normalize(plan.description).includes(currentSearch);
    if (!matchesSearch) return false;
    if (currentFilter === 'active') return plan.status === 'active';
    if (currentFilter === 'inactive') return plan.status !== 'active';
    return true;
  });
};

const renderSummary = () => {
  const plans = getPlans();
  const users = getUsers();
  const activeCount = plans.filter((plan) => plan.status === 'active').length;
  const inactiveCount = plans.length - activeCount;
  const assignedCount = users.filter((user) => Boolean(user.plan_id)).length;

  summaryTotalPlans.textContent = plans.length;
  summaryActivePlans.textContent = activeCount;
  summaryInactivePlans.textContent = inactiveCount;
  summaryAssignedPlans.textContent = assignedCount;
};

const closeModal = () => {
  planModal.classList.add('hidden');
  planForm.reset();
  editingPlanId = null;
  planModalTitle.textContent = 'Criar plano';
  savePlanBtn.textContent = 'Salvar plano';
};

const openCreateModal = () => {
  planForm.reset();
  planStatus.value = 'active';
  planModalTitle.textContent = 'Criar plano';
  savePlanBtn.textContent = 'Salvar plano';
  editingPlanId = null;
  planModal.classList.remove('hidden');
};

const renderPlans = () => {
  const plans = getFilteredPlans();

  if (!plans.length) {
    plansGrid.innerHTML = '<div class="activity-item"><strong>Nenhum plano encontrado</strong><p>Crie um novo plano para organizar acessos.</p></div>';
    renderSummary();
    return;
  }

  plansGrid.innerHTML = plans.map((plan) => {
    const assignedStudents = getUsers().filter((user) => user.plan_id === plan.id).length;
    const permissionList = Object.entries(permissionLabels)
      .filter(([key]) => Boolean(plan.permissions?.[key]))
      .map(([, label]) => label)
      .join(', ') || 'Nenhuma permissão';

    const statusText = plan.status === 'active' ? 'Ativo' : 'Inativo';
    const badgeClass = plan.status === 'active' ? 'concluido' : 'pendente';

    return `
      <article class="card-item plan-card">
        <div class="plan-card-header">
          <div>
            <span class="status-chip ${badgeClass}">${statusText}</span>
            <strong>${plan.name || 'Plano sem nome'}</strong>
          </div>
          <div class="action-buttons">
            <button class="btn btn-secondary" type="button" data-edit-plan="${plan.id}">Editar</button>
            <button class="btn btn-secondary" type="button" data-duplicate-plan="${plan.id}">Duplicar</button>
            <button class="btn btn-secondary" type="button" data-toggle-plan="${plan.id}">${plan.status === 'active' ? 'Desativar' : 'Ativar'}</button>
            <button class="btn btn-danger" type="button" data-delete-plan="${plan.id}">Excluir</button>
          </div>
        </div>
        <p>${plan.description || 'Sem descrição.'}</p>
        <div class="plan-meta-grid">
          <div>
            <span class="detail-label">Preço</span>
            <strong>R$ ${Number(plan.price || 0).toFixed(2)}</strong>
          </div>
          <div>
            <span class="detail-label">Alunos</span>
            <strong>${assignedStudents}</strong>
          </div>
        </div>
        <div class="plan-permissions">
          <span class="detail-label">Permissões</span>
          <div class="plan-permissions-list">${permissionList}</div>
        </div>
      </article>
    `;
  }).join('');

  renderSummary();
};

const loadPlanIntoForm = (plan) => {
  editingPlanId = plan.id;
  planName.value = plan.name || '';
  planPrice.value = plan.price || 0;
  planDescription.value = plan.description || '';
  planStatus.value = plan.status === 'inactive' ? 'inactive' : 'active';

  const permissionInputs = document.querySelectorAll('[name="permission"]');
  permissionInputs.forEach((input) => {
    input.checked = Boolean(plan.permissions?.[input.value]);
  });

  planModalTitle.textContent = 'Editar plano';
  savePlanBtn.textContent = 'Atualizar plano';
  planModal.classList.remove('hidden');
};

plansGrid?.addEventListener('click', (event) => {
  const editBtn = event.target.closest('[data-edit-plan]');
  const deleteBtn = event.target.closest('[data-delete-plan]');
  const toggleBtn = event.target.closest('[data-toggle-plan]');
  const duplicateBtn = event.target.closest('[data-duplicate-plan]');

  if (editBtn) {
    const plan = getPlans().find((item) => item.id === editBtn.dataset.editPlan);
    if (plan) loadPlanIntoForm(plan);
    return;
  }

  if (duplicateBtn) {
    const plan = getPlans().find((item) => item.id === duplicateBtn.dataset.duplicatePlan);
    if (!plan) return;

    const duplicated = {
      ...plan,
      id: `plan_${Date.now()}`,
      name: `${plan.name || 'Plano'} (cópia)`,
      status: 'inactive',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    createPlan(duplicated);
    renderPlans();
    return;
  }

  if (toggleBtn) {
    const plan = getPlans().find((item) => item.id === toggleBtn.dataset.togglePlan);
    if (!plan) return;

    updatePlan(plan.id, { status: plan.status === 'active' ? 'inactive' : 'active' });
    renderPlans();
    return;
  }

  if (deleteBtn) {
    const planId = deleteBtn.dataset.deletePlan;
    if (!window.confirm('Deseja excluir este plano?')) return;
    deletePlan(planId);
    renderPlans();
  }
});

openCreatePlanBtn?.addEventListener('click', openCreateModal);

planSearch?.addEventListener('input', (event) => {
  currentSearch = normalize(event.target.value);
  renderPlans();
});

filters.forEach((button) => {
  button.addEventListener('click', () => {
    filters.forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    currentFilter = button.dataset.filter || 'all';
    renderPlans();
  });
});

planForm?.addEventListener('submit', (event) => {
  event.preventDefault();

  const permissions = {};
  document.querySelectorAll('[name="permission"]:checked').forEach((checkbox) => {
    permissions[checkbox.value] = true;
  });

  const payload = {
    name: planName.value.trim(),
    description: planDescription.value.trim(),
    price: Number(planPrice.value || 0),
    status: planStatus.value || 'active',
    permissions,
  };

  if (!payload.name) {
    window.alert('Informe o nome do plano.');
    return;
  }

  if (editingPlanId) {
    updatePlan(editingPlanId, payload);
  } else {
    createPlan(payload);
  }

  closeModal();
  renderPlans();
});

document.querySelectorAll('[data-modal-close]').forEach((button) => {
  button.addEventListener('click', closeModal);
});

renderPlans();
