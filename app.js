// Crew Booking Platform Logic Engine

let departmentsData = [];
let specialistsData = [];
let customSubcategoriesData = [
  {
    id: "custom-1",
    departmentName: "1. Операторский цех и Камера",
    suggestedName: "Оператор оптического трекинга (Mo-Sys)",
    userName: "Дмитрий Чернов",
    isApproved: false
  }
];

let activeLayout = 'grid'; // 'grid' | 'list'
let activeModalSpecialist = null;

// Initialize App
document.addEventListener('DOMContentLoaded', async () => {
  await loadData();
  populateDepartmentFilters();
  applyFilters();
  renderAdminTable();
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

// 6.1. Populate Tree Select Filters
function populateDepartmentFilters() {
  const deptSelect = document.getElementById('filter-department');
  const customDeptSelect = document.getElementById('custom-dept-select');
  
  deptSelect.innerHTML = '<option value="">Все цехи (Все 9 направлений)</option>';
  customDeptSelect.innerHTML = '';

  departmentsData.forEach(dept => {
    const opt = document.createElement('option');
    opt.value = dept.name;
    opt.textContent = dept.name;
    deptSelect.appendChild(opt);

    const optCustom = document.createElement('option');
    optCustom.value = dept.name;
    optCustom.textContent = dept.name;
    customDeptSelect.appendChild(optCustom);
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
    // Collect all professions if no department selected
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

// Main Dynamic Filtering System
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
    // Search query match (Name, primary department, subcategories, tags)
    if (query) {
      const matchName = spec.name.toLowerCase().includes(query);
      const matchDept = spec.primaryDepartment.toLowerCase().includes(query);
      const matchSubs = spec.subcategories.some(s => s.toLowerCase().includes(query));
      const matchTags = spec.equipmentTags.some(t => t.toLowerCase().includes(query));
      if (!matchName && !matchDept && !matchSubs && !matchTags) return false;
    }

    // Department match
    if (selectedDept && spec.primaryDepartment !== selectedDept) return false;

    // Profession match
    if (selectedProf && !spec.subcategories.includes(selectedProf)) return false;

    // Max Rate match
    if (spec.shiftRate > maxRate) return false;

    // TFP / Creative match
    if (tfpOnly && !spec.isOpenToCreative) return false;

    // Minimum Experience match
    if (spec.yearsOfExperience < minExp) return false;

    // Showreel presence match
    if (showreelOnly && (!spec.showreelUrl || spec.showreelUrl === '')) return false;

    // Date availability match (must NOT be in busyDates)
    if (filterDate && spec.busyDates && spec.busyDates.includes(filterDate)) return false;

    return true;
  });

  document.getElementById('results-count').textContent = `${filtered.length} специалистов`;

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

// 6.2. Render Specialist Grid Cards
function renderGridCards(list) {
  const container = document.getElementById('catalog-grid');
  container.innerHTML = list.map(spec => {
    const mainProf = spec.subcategories[0] || spec.primaryDepartment;
    const tfpBadge = spec.isOpenToCreative 
      ? `<span class="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
           🎨 Готов к творчеству
         </span>`
      : '';

    const tagsHtml = spec.equipmentTags.slice(0, 4).map(t => 
      `<span class="text-[10px] font-mono px-2 py-0.5 rounded-md bg-zinc-850 text-zinc-300 border border-zinc-700/60">${t}</span>`
    ).join('');

    return `
      <div class="glass-card rounded-2xl p-5 flex flex-col justify-between space-y-4 transition-all hover:scale-[1.01] hover:shadow-xl hover:shadow-cyan-950/20">
        <div>
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-center gap-3">
              <img src="${spec.avatar}" alt="${spec.name}" class="w-12 h-12 rounded-xl object-cover border border-zinc-700">
              <div>
                <h3 class="font-bold text-sm text-white flex items-center gap-1.5">
                  ${spec.name}
                  <span class="flex items-center text-[11px] font-semibold text-amber-400">
                    ★ ${spec.rating}
                  </span>
                </h3>
                <span class="text-xs text-zinc-400 font-medium block">${mainProf}</span>
                <span class="text-[10px] text-zinc-500 block">${spec.city} • Опыт ${spec.yearsOfExperience} лет</span>
              </div>
            </div>
          </div>

          <div class="mt-3 flex flex-wrap items-center gap-1.5">
            ${tfpBadge}
          </div>

          <div class="mt-3 flex flex-wrap gap-1">
            ${tagsHtml}
          </div>
        </div>

        <div class="pt-3 border-t border-zinc-800/80 flex items-center justify-between">
          <div>
            <span class="text-[10px] uppercase text-zinc-400 font-mono">Смена</span>
            <div class="text-sm font-extrabold text-white font-mono">
              ${spec.shiftRate.toLocaleString('ru-RU')} ₽
            </div>
          </div>

          <button onclick="openSpecialistModal('${spec.id}')" class="px-3.5 py-1.5 bg-zinc-800 hover:bg-cyan-600 hover:text-zinc-950 text-white font-semibold text-xs rounded-xl transition-all border border-zinc-700/80 flex items-center gap-1">
            Профиль <i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// Render Compact Table View
function renderTableRows(list) {
  const tbody = document.getElementById('catalog-table-body');
  tbody.innerHTML = list.map(spec => `
    <tr class="hover:bg-zinc-800/40 transition-all">
      <td class="p-3.5 flex items-center gap-2.5">
        <img src="${spec.avatar}" class="w-8 h-8 rounded-lg object-cover">
        <div>
          <strong class="text-white font-bold block">${spec.name}</strong>
          <span class="text-[10px] text-zinc-500">${spec.city}</span>
        </div>
      </td>
      <td class="p-3.5">
        <span class="text-zinc-300">${spec.subcategories[0] || spec.primaryDepartment}</span>
      </td>
      <td class="p-3.5">
        <div class="flex flex-wrap gap-1 max-w-xs">
          ${spec.equipmentTags.slice(0, 3).map(t => `<span class="text-[9px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">${t}</span>`).join('')}
        </div>
      </td>
      <td class="p-3.5 font-mono font-bold text-white">${spec.shiftRate.toLocaleString('ru-RU')} ₽</td>
      <td class="p-3.5 text-amber-400 font-bold">★ ${spec.rating}</td>
      <td class="p-3.5 text-right">
        <button onclick="openSpecialistModal('${spec.id}')" class="px-2.5 py-1 bg-zinc-800 hover:bg-cyan-600 hover:text-black rounded-lg text-[11px] font-bold transition-all">
          Профиль
        </button>
      </td>
    </tr>
  `).join('');
}

// 6.3. Open Full Specialist Modal Window
function openSpecialistModal(specId) {
  const spec = specialistsData.find(s => s.id === specId);
  if (!spec) return;

  activeModalSpecialist = spec;

  // Header Banner
  const headerContainer = document.getElementById('modal-header-banner');
  headerContainer.innerHTML = `
    <img src="${spec.avatar}" class="w-20 h-20 rounded-2xl object-cover border-2 border-cyan-500 shadow-xl">
    <div class="space-y-1">
      <div class="flex items-center gap-2">
        <h2 class="text-xl font-extrabold text-white">${spec.name}</h2>
        <span class="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">★ ${spec.rating} (${spec.reviewsCount} отзывов)</span>
      </div>
      <p class="text-xs font-medium text-cyan-400">${spec.subcategories.join(' • ')}</p>
      <div class="text-[11px] text-zinc-400 flex items-center gap-3">
        <span>📍 ${spec.city}</span>
        <span>⏱️ Опыт ${spec.yearsOfExperience} лет</span>
        <span>🎬 ${spec.projectsCount} проектов</span>
      </div>
    </div>
  `;

  // Bio & Payment
  document.getElementById('modal-bio').textContent = spec.bio;
  document.getElementById('modal-payment-notes').textContent = spec.paymentNotes;

  // Media
  const iframe = document.getElementById('modal-showreel-iframe');
  iframe.src = spec.showreelUrl || '';

  const galleryGrid = document.getElementById('modal-gallery-grid');
  galleryGrid.innerHTML = spec.gallery.map(img => `
    <img src="${img}" class="w-full h-24 object-cover rounded-xl border border-zinc-800 hover:scale-105 transition-all cursor-pointer">
  `).join('');

  // Skills
  const tagsContainer = document.getElementById('modal-equipment-tags');
  tagsContainer.innerHTML = spec.equipmentTags.map(t => `
    <span class="px-3 py-1 bg-zinc-800 border border-zinc-700 text-cyan-300 rounded-xl text-xs font-mono font-medium">${t}</span>
  `).join('');

  document.getElementById('modal-education').textContent = spec.education;
  document.getElementById('modal-projects-count').textContent = `${spec.projectsCount} съемок`;

  // Calendar render (August 2026)
  renderModalCalendar(spec.busyDates || []);

  // Footer Rate
  document.getElementById('modal-footer-rate').textContent = `${spec.shiftRate.toLocaleString('ru-RU')} ₽ / смена`;

  // Reset to Tab 1
  switchModalTab('about');

  document.getElementById('specialist-modal').classList.remove('hidden');
  lucide.createIcons();
}

function closeSpecialistModal() {
  document.getElementById('specialist-modal').classList.add('hidden');
  document.getElementById('modal-showreel-iframe').src = '';
}

function switchModalTab(tab) {
  const tabs = ['about', 'media', 'skills', 'calendar'];
  tabs.forEach(t => {
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

// Render Calendar Month Grid
function renderModalCalendar(busyDates) {
  const grid = document.getElementById('modal-calendar-grid');
  grid.innerHTML = '';

  const daysHeader = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  daysHeader.forEach(h => {
    grid.innerHTML += `<div class="text-zinc-500 font-bold py-1">${h}</div>`;
  });

  // August 2026 starts on Saturday (5 empty slots)
  for (let i = 0; i < 5; i++) {
    grid.innerHTML += `<div></div>`;
  }

  for (let day = 1; day <= 31; day++) {
    const dayStr = day < 10 ? `0${day}` : `${day}`;
    const dateFormatted = `2026-08-${dayStr}`;
    const isBusy = busyDates.includes(dateFormatted);

    const colorClass = isBusy 
      ? 'bg-rose-500/20 text-rose-400 border-rose-500/40' 
      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';

    grid.innerHTML += `
      <div class="p-2 rounded-lg border ${colorClass} text-center font-bold">
        ${day}
      </div>
    `;
  }
}

// Layout Switcher
function setCatalogLayout(layout) {
  activeLayout = layout;
  const gridBtn = document.getElementById('btn-view-grid');
  const listBtn = document.getElementById('btn-view-list');

  if (layout === 'grid') {
    gridBtn.classList.add('bg-zinc-800', 'text-zinc-200');
    listBtn.classList.remove('bg-zinc-800', 'text-zinc-200');
    listBtn.classList.add('text-zinc-400');
  } else {
    listBtn.classList.add('bg-zinc-800', 'text-zinc-200');
    gridBtn.classList.remove('bg-zinc-800', 'text-zinc-200');
    gridBtn.classList.add('text-zinc-400');
  }

  applyFilters();
}

// Custom Category Modal (Section 5 TZ)
function openCustomCategoryModal() {
  document.getElementById('custom-cat-modal').classList.remove('hidden');
}

function closeCustomCategoryModal() {
  document.getElementById('custom-cat-modal').classList.add('hidden');
}

function submitCustomCategory(e) {
  e.preventDefault();
  const dept = document.getElementById('custom-dept-select').value;
  const name = document.getElementById('custom-name-input').value.trim();

  if (name) {
    customSubcategoriesData.push({
      id: `custom-${Date.now()}`,
      departmentName: dept,
      suggestedName: name,
      userName: "Вы (Специалист)",
      isApproved: false
    });

    closeCustomCategoryModal();
    renderAdminTable();
    showToast('Заявка на новую специальность отправлена администратору!');
  }
}

// Admin Moderation Table
function renderAdminTable() {
  const tbody = document.getElementById('admin-custom-table');
  document.getElementById('pending-count-badge').textContent = customSubcategoriesData.filter(c => !c.isApproved).length;

  tbody.innerHTML = customSubcategoriesData.map(item => `
    <tr class="hover:bg-zinc-900 transition-all">
      <td class="p-3.5 font-bold text-white">${item.suggestedName}</td>
      <td class="p-3.5 text-zinc-400">${item.departmentName}</td>
      <td class="p-3.5 text-zinc-400">${item.userName}</td>
      <td class="p-3.5">
        ${item.isApproved 
          ? `<span class="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">Утверждено</span>`
          : `<span class="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold">На модерации</span>`
        }
      </td>
      <td class="p-3.5 text-right space-x-2">
        ${!item.isApproved ? `
          <button onclick="approveCustomCat('${item.id}')" class="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-black font-bold rounded-lg text-[11px] transition-all">
            Утвердить
          </button>
          <button onclick="deleteCustomCat('${item.id}')" class="px-2.5 py-1 bg-rose-600/30 hover:bg-rose-600 text-rose-200 font-bold rounded-lg text-[11px] transition-all">
            Удалить
          </button>
        ` : `<span class="text-zinc-500 text-[11px]">В каталоге</span>`}
      </td>
    </tr>
  `).join('');
}

function approveCustomCat(id) {
  const item = customSubcategoriesData.find(c => c.id === id);
  if (item) {
    item.isApproved = true;
    renderAdminTable();
    showToast(`Специальность "${item.suggestedName}" утверждена и добавлена в каталог!`);
  }
}

function deleteCustomCat(id) {
  customSubcategoriesData = customSubcategoriesData.filter(c => c.id !== id);
  renderAdminTable();
  showToast('Заявка отклонена');
}

// Navigation Switcher
function switchNav(nav) {
  ['catalog', 'projects', 'admin'].forEach(n => {
    document.getElementById(`view-${n}`).classList.add('hidden');
    const btn = document.getElementById(`nav-${n}`);
    btn.classList.remove('bg-zinc-800', 'text-white');
    btn.classList.add('text-zinc-400');
  });

  document.getElementById(`view-${nav}`).classList.remove('hidden');
  const activeBtn = document.getElementById(`nav-${nav}`);
  activeBtn.classList.add('bg-zinc-800', 'text-white');
  activeBtn.classList.remove('text-zinc-400');
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

function bookingRequestAction() {
  closeSpecialistModal();
  showToast(`Запрос бронирования отправлен специалисту ${activeModalSpecialist ? activeModalSpecialist.name : ''}!`);
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  document.getElementById('toast-message').textContent = msg;
  toast.classList.remove('hidden');
  setTimeout(() => {
    toast.classList.add('hidden');
  }, 4000);
}
