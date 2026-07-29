// Crew Booking Platform Logic Engine

function toggleMobileFilters() {
  const drawer = document.getElementById('mobile-filter-drawer');
  drawer.classList.toggle('hidden');
}

let departmentsData = [];
let specialistsData = [];
let activeLayout = 'grid';
let activeModalSpecialist = null;

// User Interactive Calendar for Specialist Dashboard
let myBusyDates = ["2026-08-01", "2026-08-02", "2026-08-05", "2026-08-15", "2026-08-16"];

document.addEventListener('DOMContentLoaded', async () => {
  await loadData();
  populateDepartmentFilters();
  applyFilters();
  renderInteractiveSpecCalendar();
  lucide.createIcons();
});

async function loadData() {
  try {
    const [deptRes, specRes] = await Promise.all([
      fetch('./data/departments.json'),
      fetch('./data/specialists.json')
    ]);
    departmentsData = await deptRes.json();
    specialistsData = await specRes.json();
  } catch (err) {
    console.error('Error loading JSON data:', err);
  }
}

function populateDepartmentFilters() {
  const deptSelect = document.getElementById('filter-department');
  const customDeptSelect = document.getElementById('custom-dept-select');
  
  if (deptSelect) deptSelect.innerHTML = '<option value="">Все 9 цехов</option>';
  if (customDeptSelect) customDeptSelect.innerHTML = '';

  departmentsData.forEach(dept => {
    if (deptSelect) {
      const opt = document.createElement('option');
      opt.value = dept.name;
      opt.textContent = dept.name;
      deptSelect.appendChild(opt);
    }
    if (customDeptSelect) {
      const optCustom = document.createElement('option');
      optCustom.value = dept.name;
      optCustom.textContent = dept.name;
      customDeptSelect.appendChild(optCustom);
    }
  });
}

function onDepartmentChange() {
  const selectedDeptName = document.getElementById('filter-department').value;
  const profSelect = document.getElementById('filter-profession');
  profSelect.innerHTML = '<option value="">Все профессии</option>';

  if (selectedDeptName) {
    const foundDept = departmentsData.find(d => d.name === selectedDeptName);
    if (foundDept && foundDept.professions) {
      foundDept.professions.forEach(prof => {
        const opt = document.createElement('option');
        opt.value = prof;
        opt.textContent = prof;
        profSelect.appendChild(opt);
      });
    }
  } else {
    departmentsData.forEach(d => {
      d.professions.forEach(prof => {
        const opt = document.createElement('option');
        opt.value = prof;
        opt.textContent = `${prof} (${d.name.split('.')[0]})`;
        profSelect.appendChild(opt);
      });
    });
  }

  applyFilters();
}

function onRateInput(val) {
  document.getElementById('rate-value-display').textContent = `${Number(val).toLocaleString('ru-RU')} ₽`;
  applyFilters();
}

function onExpInput(val) {
  const display = document.getElementById('exp-value-display');
  display.textContent = val > 0 ? `от ${val} лет` : 'Любой';
  applyFilters();
}

function applyFilters() {
  const query = document.getElementById('filter-search').value.toLowerCase().trim();
  const selectedDept = document.getElementById('filter-department').value;
  const selectedProf = document.getElementById('filter-profession').value;
  const maxRate = Number(document.getElementById('filter-max-rate').value);
  const tfpOnly = document.getElementById('filter-tfp').checked;
  const minExp = Number(document.getElementById('filter-exp').value);
  const showreelOnly = document.getElementById('filter-showreel').checked;
  const filterDate = document.getElementById('filter-date').value;

  const filtered = specialistsData.filter(spec => {
    if (query) {
      const matchName = spec.name.toLowerCase().includes(query);
      const matchDept = spec.primaryDepartment.toLowerCase().includes(query);
      const matchSubs = spec.subcategories.some(s => s.toLowerCase().includes(query));
      const matchTags = spec.equipmentTags.some(t => t.toLowerCase().includes(query));
      if (!matchName && !matchDept && !matchSubs && !matchTags) return false;
    }

    if (selectedDept && spec.primaryDepartment !== selectedDept) return false;
    if (selectedProf && !spec.subcategories.includes(selectedProf)) return false;
    if (spec.shiftRate > maxRate) return false;
    if (tfpOnly && !spec.isOpenToCreative) return false;
    if (spec.yearsOfExperience < minExp) return false;
    if (showreelOnly && (!spec.showreelUrl || spec.showreelUrl === '')) return false;
    if (filterDate && spec.busyDates && spec.busyDates.includes(filterDate)) return false;

    return true;
  });

  document.getElementById('results-count').textContent = `${filtered.length} спец.`;

  if (filtered.length === 0) {
    document.getElementById('catalog-grid').classList.add('hidden');
    document.getElementById('catalog-list').classList.add('hidden');
    document.getElementById('empty-state').classList.remove('hidden');
  } else {
    document.getElementById('empty-state').classList.add('hidden');
    renderGridCards(filtered);
    renderTableRows(filtered);

    if (activeLayout === 'grid') {
      document.getElementById('catalog-grid').classList.remove('hidden');
      document.getElementById('catalog-list').classList.add('hidden');
    } else {
      document.getElementById('catalog-grid').classList.add('hidden');
      document.getElementById('catalog-list').classList.remove('hidden');
    }
  }

  lucide.createIcons();
}

function renderGridCards(list) {
  const container = document.getElementById('catalog-grid');
  container.innerHTML = list.map(spec => {
    const mainProf = spec.subcategories[0] || spec.primaryDepartment;
    const tfpBadge = spec.isOpenToCreative 
      ? `<span class="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
           🎨 Готов к TFP
         </span>`
      : '';

    const tagsHtml = spec.equipmentTags.slice(0, 3).map(t => 
      `<span class="text-[9px] sm:text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-zinc-850 text-zinc-300 border border-zinc-700/60 truncate max-w-[120px]">${t}</span>`
    ).join('');

    return `
      <div class="glass-card rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between space-y-3 transition-all min-w-0">
        <div>
          <div class="flex items-start justify-between gap-2.5">
            <div class="flex items-center gap-2.5 min-w-0">
              <img src="${spec.avatar}" alt="${spec.name}" class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-cover border border-zinc-700 shrink-0">
              <div class="min-w-0">
                <h3 class="font-bold text-xs sm:text-sm text-white flex items-center gap-1">
                  <span class="truncate">${spec.name}</span>
                  <span class="text-[10px] font-semibold text-amber-400 shrink-0">★ ${spec.rating}</span>
                </h3>
                <span class="text-[11px] text-zinc-400 font-medium block truncate">${mainProf}</span>
                <span class="text-[9px] text-zinc-500 block truncate">${spec.city} • Опыт ${spec.yearsOfExperience} лет</span>
              </div>
            </div>
          </div>

          <div class="mt-2 flex flex-wrap items-center gap-1">
            ${tfpBadge}
          </div>

          <div class="mt-2 flex flex-wrap gap-1">
            ${tagsHtml}
          </div>
        </div>

        <div class="pt-2.5 border-t border-zinc-800/80 flex items-center justify-between">
          <div>
            <span class="text-[8px] uppercase text-zinc-400 font-mono block">Смена</span>
            <div class="text-xs sm:text-sm font-extrabold text-white font-mono">
              ${spec.shiftRate.toLocaleString('ru-RU')} ₽
            </div>
          </div>

          <button onclick="openSpecialistModal('${spec.id}')" class="px-2.5 py-1.5 bg-zinc-800 hover:bg-cyan-600 hover:text-black text-white font-semibold text-[11px] rounded-xl transition-all border border-zinc-700/80 flex items-center gap-1 touch-bounce">
            Профиль <i data-lucide="chevron-right" class="w-3 h-3"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');
}


function renderTableRows(list) {
  const tbody = document.getElementById('catalog-table-body');
  tbody.innerHTML = list.map(spec => `
    <tr class="hover:bg-zinc-800/40 transition-all">
      <td class="p-3 flex items-center gap-2">
        <img src="${spec.avatar}" class="w-7 h-7 rounded-lg object-cover">
        <div>
          <strong class="text-white font-bold block">${spec.name}</strong>
          <span class="text-[9px] text-zinc-500">${spec.city}</span>
        </div>
      </td>
      <td class="p-3">
        <span class="text-zinc-300">${spec.subcategories[0] || spec.primaryDepartment}</span>
      </td>
      <td class="p-3">
        <div class="flex flex-wrap gap-1 max-w-xs">
          ${spec.equipmentTags.slice(0, 3).map(t => `<span class="text-[9px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">${t}</span>`).join('')}
        </div>
      </td>
      <td class="p-3 font-mono font-bold text-white">${spec.shiftRate.toLocaleString('ru-RU')} ₽</td>
      <td class="p-3 text-right">
        <button onclick="openSpecialistModal('${spec.id}')" class="px-2.5 py-1 bg-zinc-800 hover:bg-cyan-600 hover:text-black rounded-lg text-[11px] font-bold">
          Профиль
        </button>
      </td>
    </tr>
  `).join('');
}

function openSpecialistModal(specId) {
  const spec = specialistsData.find(s => s.id === specId);
  if (!spec) return;

  activeModalSpecialist = spec;

  const headerContainer = document.getElementById('modal-header-banner');
  headerContainer.innerHTML = `
    <img src="${spec.avatar}" class="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-cyan-500 shadow-xl">
    <div class="space-y-0.5">
      <div class="flex items-center gap-2">
        <h2 class="text-base sm:text-xl font-extrabold text-white">${spec.name}</h2>
        <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">★ ${spec.rating}</span>
      </div>
      <p class="text-xs font-medium text-cyan-400">${spec.subcategories.join(' • ')}</p>
      <div class="text-[10px] sm:text-[11px] text-zinc-400 flex items-center gap-3">
        <span>📍 ${spec.city}</span>
        <span>⏱️ Опыт ${spec.yearsOfExperience} лет</span>
      </div>
    </div>
  `;

  document.getElementById('modal-bio').textContent = spec.bio;
  document.getElementById('modal-payment-notes').textContent = spec.paymentNotes;

  const iframe = document.getElementById('modal-showreel-iframe');
  iframe.src = spec.showreelUrl || '';

  const galleryGrid = document.getElementById('modal-gallery-grid');
  galleryGrid.innerHTML = spec.gallery.map(img => `
    <img src="${img}" class="w-full h-20 sm:h-24 object-cover rounded-xl border border-zinc-800">
  `).join('');

  const tagsContainer = document.getElementById('modal-equipment-tags');
  tagsContainer.innerHTML = spec.equipmentTags.map(t => `
    <span class="px-2.5 py-1 bg-zinc-800 border border-zinc-700 text-cyan-300 rounded-lg text-[11px] font-mono font-medium">${t}</span>
  `).join('');

  document.getElementById('modal-education').textContent = spec.education;
  document.getElementById('modal-projects-count').textContent = `${spec.projectsCount} съемок`;

  renderModalCalendar(spec.busyDates || []);
  document.getElementById('modal-footer-rate').textContent = `${spec.shiftRate.toLocaleString('ru-RU')} ₽ / смена`;

  switchModalTab('about');
  document.getElementById('specialist-modal').classList.remove('hidden');
  lucide.createIcons();
}

function closeSpecialistModal() {
  document.getElementById('specialist-modal').classList.add('hidden');
  document.getElementById('modal-showreel-iframe').src = '';
}

function switchModalTab(tab) {
  ['about', 'media', 'skills', 'calendar'].forEach(t => {
    document.getElementById(`modal-tab-${t}`).classList.add('hidden');
    const btn = document.getElementById(`tab-btn-${t}`);
    btn.classList.remove('border-b-2', 'border-cyan-400', 'text-cyan-400', 'font-bold');
    btn.classList.add('text-zinc-400', 'font-medium');
  });

  document.getElementById(`modal-tab-${tab}`).classList.remove('hidden');
  const activeBtn = document.getElementById(`tab-btn-${tab}`);
  activeBtn.classList.add('border-b-2', 'border-cyan-400', 'text-cyan-400', 'font-bold');
  activeBtn.classList.remove('text-zinc-400', 'font-medium');
}

function renderModalCalendar(busyDates) {
  const grid = document.getElementById('modal-calendar-grid');
  grid.innerHTML = '';

  const daysHeader = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  daysHeader.forEach(h => grid.innerHTML += `<div class="text-zinc-500 font-bold py-1 text-[10px]">${h}</div>`);

  for (let i = 0; i < 5; i++) grid.innerHTML += `<div></div>`;

  for (let day = 1; day <= 31; day++) {
    const dayStr = day < 10 ? `0${day}` : `${day}`;
    const dateFormatted = `2026-08-${dayStr}`;
    const isBusy = busyDates.includes(dateFormatted);
    const colorClass = isBusy ? 'bg-rose-500/20 text-rose-400 border-rose-500/40' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    grid.innerHTML += `<div class="p-1.5 rounded-lg border ${colorClass} text-center font-bold text-[11px]">${day}</div>`;
  }
}

// -------------------------------------------------------------
// SPECIALIST INTERACTIVE DASHBOARD CALENDAR
// -------------------------------------------------------------
function renderInteractiveSpecCalendar() {
  const grid = document.getElementById('interactive-spec-calendar');
  if (!grid) return;
  grid.innerHTML = '';

  const daysHeader = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  daysHeader.forEach(h => grid.innerHTML += `<div class="text-zinc-500 font-bold py-1 text-[10px]">${h}</div>`);

  for (let i = 0; i < 5; i++) grid.innerHTML += `<div></div>`;

  for (let day = 1; day <= 31; day++) {
    const dayStr = day < 10 ? `0${day}` : `${day}`;
    const dateFormatted = `2026-08-${dayStr}`;
    const isBusy = myBusyDates.includes(dateFormatted);
    const colorClass = isBusy 
      ? 'bg-rose-500/30 text-rose-300 border-rose-500/50 hover:bg-rose-500/40' 
      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30';

    grid.innerHTML += `
      <div onclick="toggleMyDateAvailability('${dateFormatted}')" class="p-2 rounded-xl border ${colorClass} text-center font-bold cursor-pointer transition-all touch-bounce select-none">
        ${day}
      </div>
    `;
  }
}

function toggleMyDateAvailability(dateStr) {
  if (myBusyDates.includes(dateStr)) {
    myBusyDates = myBusyDates.filter(d => d !== dateStr);
  } else {
    myBusyDates.push(dateStr);
  }
  renderInteractiveSpecCalendar();
  showToast('График занятости обновлен!');
}

function saveSpecialistProfile() {
  showToast('Профиль соискателя успешно сохранен!');
}

function setCatalogLayout(layout) {
  activeLayout = layout;
  const gridBtn = document.getElementById('btn-view-grid');
  const listBtn = document.getElementById('btn-view-list');

  if (layout === 'grid') {
    gridBtn.classList.add('bg-zinc-800', 'text-zinc-200');
    listBtn.classList.remove('bg-zinc-800', 'text-zinc-200');
  } else {
    listBtn.classList.add('bg-zinc-800', 'text-zinc-200');
    gridBtn.classList.remove('bg-zinc-800', 'text-zinc-200');
  }

  applyFilters();
}

function openCustomCategoryModal() {
  document.getElementById('custom-cat-modal').classList.remove('hidden');
}

function closeCustomCategoryModal() {
  document.getElementById('custom-cat-modal').classList.add('hidden');
}

function submitCustomCategory(e) {
  e.preventDefault();
  closeCustomCategoryModal();
  showToast('Заявка на профессию отправлена в админ-панель!');
}

function switchNav(nav) {
  ['catalog', 'dashboard-spec', 'dashboard-prod'].forEach(n => {
    const viewEl = document.getElementById(`view-${n}`);
    if (viewEl) viewEl.classList.add('hidden');
    
    const btn = document.getElementById(`nav-${n}`);
    if (btn) {
      btn.classList.remove('bg-zinc-800', 'text-white');
      btn.classList.add('text-zinc-400');
    }

    const mobBtn = document.getElementById(`mobile-nav-${n}`);
    if (mobBtn) {
      mobBtn.classList.remove('text-cyan-400', 'font-bold');
      mobBtn.classList.add('text-zinc-400', 'font-medium');
    }
  });

  const targetView = document.getElementById(`view-${nav}`);
  if (targetView) targetView.classList.remove('hidden');

  const activeBtn = document.getElementById(`nav-${nav}`);
  if (activeBtn) {
    activeBtn.classList.add('bg-zinc-800', 'text-white');
    activeBtn.classList.remove('text-zinc-400');
  }

  const activeMobBtn = document.getElementById(`mobile-nav-${nav}`);
  if (activeMobBtn) {
    activeMobBtn.classList.add('text-cyan-400', 'font-bold');
    activeMobBtn.classList.remove('text-zinc-400', 'font-medium');
  }
}

function resetFilters() {
  document.getElementById('filter-search').value = '';
  document.getElementById('filter-department').value = '';
  document.getElementById('filter-profession').value = '';
  document.getElementById('filter-max-rate').value = 100000;
  document.getElementById('filter-tfp').checked = false;
  document.getElementById('filter-exp').value = 0;
  document.getElementById('filter-showreel').checked = false;
  document.getElementById('filter-date').value = '';

  document.getElementById('rate-value-display').textContent = '100 000 ₽';
  document.getElementById('exp-value-display').textContent = 'Любой';

  onDepartmentChange();
}

// Selected Roles Multiselect State
let selectedProjectRoles = ["Гафер (Gaffer)", "Фокус-пуллер (1st AC)"];

function openCreateProjectModal() {
  document.getElementById('create-project-modal').classList.remove('hidden');
  renderRolesDropdownTree();
  updateSelectedRolesTriggerUI();
}

function closeCreateProjectModal() {
  document.getElementById('create-project-modal').classList.add('hidden');
  document.getElementById('project-roles-dropdown').classList.add('hidden');
}

function toggleProjectRolesDropdown() {
  const dropdown = document.getElementById('project-roles-dropdown');
  dropdown.classList.toggle('hidden');
}

function renderRolesDropdownTree(searchQuery = '') {
  const container = document.getElementById('roles-checkboxes-container');
  if (!container) return;

  const query = searchQuery.toLowerCase().trim();
  container.innerHTML = '';

  departmentsData.forEach(dept => {
    const matchedProfessions = dept.professions.filter(p => p.toLowerCase().includes(query));
    if (query && matchedProfessions.length === 0) return;

    const deptGroup = document.createElement('div');
    deptGroup.className = 'space-y-1';

    const deptTitle = document.createElement('div');
    deptTitle.className = 'font-bold text-zinc-400 uppercase text-[9px] tracking-wider pt-1 border-b border-zinc-800/60 pb-0.5';
    deptTitle.textContent = dept.name;
    deptGroup.appendChild(deptTitle);

    const profsList = query ? matchedProfessions : dept.professions;
    profsList.forEach(prof => {
      const isChecked = selectedProjectRoles.includes(prof);
      const row = document.createElement('label');
      row.className = 'flex items-center gap-2 py-1 px-1.5 rounded-lg hover:bg-zinc-800/60 cursor-pointer transition-all';
      row.innerHTML = `
        <input type="checkbox" ${isChecked ? 'checked' : ''} onchange="toggleRoleSelection('${prof}')" class="w-3.5 h-3.5 rounded bg-zinc-950 border-zinc-700 text-amber-500 accent-amber-500 shrink-0">
        <span class="text-zinc-200 text-[11px] truncate">${prof}</span>
      `;
      deptGroup.appendChild(row);
    });

    container.appendChild(deptGroup);
  });
}

function filterRolesDropdown() {
  const q = document.getElementById('roles-dropdown-search').value;
  renderRolesDropdownTree(q);
}

function toggleRoleSelection(prof) {
  if (selectedProjectRoles.includes(prof)) {
    selectedProjectRoles = selectedProjectRoles.filter(p => p !== prof);
  } else {
    selectedProjectRoles.push(prof);
  }
  updateSelectedRolesTriggerUI();
}

function updateSelectedRolesTriggerUI() {
  const container = document.getElementById('project-roles-selected-tags');
  if (!container) return;

  if (selectedProjectRoles.length === 0) {
    container.innerHTML = `<span class="text-zinc-500 text-xs">Выберите специальности...</span>`;
  } else {
    container.innerHTML = selectedProjectRoles.map(role => `
      <span class="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
        ${role}
        <i onclick="event.stopPropagation(); toggleRoleSelection('${role}');" data-lucide="x" class="w-3 h-3 hover:text-white cursor-pointer"></i>
      </span>
    `).join('');
    lucide.createIcons();
  }
}

// Close Dropdown when clicking outside
document.addEventListener('click', (e) => {
  const dropdown = document.getElementById('project-roles-dropdown');
  const triggerBtn = e.target.closest('button[onclick*="toggleProjectRolesDropdown"]');
  if (dropdown && !dropdown.contains(e.target) && !triggerBtn) {
    dropdown.classList.add('hidden');
  }
});


function submitNewProject(e) {
  e.preventDefault();
  const name = document.getElementById('project-name-input').value.trim();
  closeCreateProjectModal();
  switchNav('dashboard-prod');
  showToast(`Проект «${name}» опубликован! Вы можете забронировать специалистов.`);
}

function bookingRequestAction() {
  closeSpecialistModal();
  if (activeModalSpecialist) {
    showToast(`Приглашение на съемку отправлено специалисту ${activeModalSpecialist.name}! Заявка отображается в Кабинете Нанимателя.`);
  }
}


function showToast(msg) {
  const toast = document.getElementById('toast');
  document.getElementById('toast-message').textContent = msg;
  toast.classList.remove('hidden');
  setTimeout(() => {
    toast.classList.add('hidden');
  }, 3500);
}
