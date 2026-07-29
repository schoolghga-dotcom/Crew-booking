// Crew Booking Platform Logic Engine

const DEFAULT_DEPARTMENTS_DATA = [
  {
    "id": "camera",
    "name": "1. Операторский цех и Камера",
    "professions": ["Оператор-постановщик (DOP)", "Оператор / Камерамен", "Второй оператор", "Фокус-пуллер (1st AC)", "Камера-механик (2nd AC)", "Стедикамист", "Оператор крана / коптера", "DIT (Digital Imaging Technician)", "Видеоинженер / Плейбэкер"]
  },
  {
    "id": "lighting",
    "name": "2. Цех Света (Светотехника)",
    "professions": ["Художник по свету (Lighting Designer)", "Гафер (Gaffer)", "Оператор светового пульта", "Системный инженер (Art-Net / DMX / Сети)", "Осветитель (Lighting Technician)", "Бестбой (Best Boy Electric)", "Художник превизуализации"]
  },
  {
    "id": "sound",
    "name": "3. Цех Звука",
    "professions": ["Звукорежиссер на площадке / Саунд-дизайнер", "Звукорежиссер FOH (Front of House)", "Мониторный звукорежиссер", "Бум-оператор (Микрофонщик)", "Системный инженер (Звук)", "RF-менеджер (Радиочастоты)", "Техник по звуку"]
  },
  {
    "id": "producing",
    "name": "4. Продюсерский цех",
    "professions": ["Генеральный / Исполнительный продюсер", "Креативный продюсер", "Линейный продюсер", "Шоу-раннер", "Директор картины / площадки (UPM)", "Локейшен-менеджер (Location Manager)", "Администратор площадки"]
  },
  {
    "id": "directing",
    "name": "5. Режиссерский цех",
    "professions": ["Режиссер-постановщик", "Второй режиссер (1st AD - планирование)", "Второй режиссер (2nd AD - площадка)", "Помощник режиссер (Скрипт-супервайзер)", "Кастинг-директор", "Ассистент по актерам", "Бригадир АМС (Массовка)", "Хлопушка"]
  },
  {
    "id": "art",
    "name": "6. Художественный цех (Art Department)",
    "professions": ["Художник-постановщик", "Арт-директор", "Декоратор", "Постановщик", "Художник по реквизиту / Реквизитор", "Бутафор"]
  },
  {
    "id": "costume",
    "name": "7. Костюм и Грим",
    "professions": ["Художник по костюмам", "Ассистент по костюмам / Костюмер", "Художник по гриму / Главный гример", "Гример-визажист", "Мастер по спецэффектам (SFX Makeup)"]
  },
  {
    "id": "grip",
    "name": "8. Сценический комплекс и Механика (Грип / Риггинг)",
    "professions": ["Долли-грип (Кран / Тележка)", "Кей-грип (Key Grip)", "Машинист сцены / Стейджхэнд", "Риггер (Высотные работы / Подвесы)"]
  },
  {
    "id": "post",
    "name": "9. Пост-продакшен (Монтаж и VFX)",
    "professions": ["Режиссер монтажа", "Колорист", "VFX-супервайзер", "CG-Artist / Моушн-дизайнер", "Звукорежиссер пост-продакшена"]
  }
];

const DEFAULT_SPECIALISTS_DATA = [
  {
    "id": "spec-1",
    "name": "Александр Волков",
    "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    "primaryDepartment": "2. Цех Света (Светотехника)",
    "subcategories": ["Художник по свету (Lighting Designer)", "Гафер (Gaffer)", "Оператор светового пульта"],
    "city": "Москва",
    "shiftRate": 45000,
    "isOpenToCreative": true,
    "yearsOfExperience": 8,
    "projectsCount": 64,
    "education": "СПбГИК (Светорежиссура, 2016)",
    "rating": 4.9,
    "reviewsCount": 28,
    "equipmentTags": ["grandMA2", "grandMA3", "Avolites Titan", "Blackout", "Capture 2023"],
    "showreelUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "gallery": [
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80"
    ],
    "bio": "Светодизайнер со стажем работы на стадионных шоу, съёмках музыкальных клипов и кино. В совершенстве владею пультами grandMA2/3, симуляцией в Capture.",
    "paymentNotes": "Оплата ИП / Самозанятый. Предоплата 30% на предвизе.",
    "busyDates": ["2026-08-01", "2026-08-02", "2026-08-05", "2026-08-15"]
  },
  {
    "id": "spec-2",
    "name": "Михаил Соколов",
    "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    "primaryDepartment": "1. Операторский цех и Камера",
    "subcategories": ["Оператор-постановщик (DOP)", "Стедикамист"],
    "city": "Санкт-Петербург",
    "shiftRate": 65000,
    "isOpenToCreative": false,
    "yearsOfExperience": 11,
    "projectsCount": 92,
    "education": "ВГИК (Операторский факультет, 2015)",
    "rating": 5.0,
    "reviewsCount": 42,
    "equipmentTags": ["ARRI Alexa Mini", "RED V-Raptor", "Steadicam Zephyr", "Cooke Anamorphic", "SmallRig"],
    "showreelUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "gallery": [
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80"
    ],
    "bio": "Кинооператор и стедикамист. Рекламные ролики крупных брендов, полнометражные фильмы и клипы.",
    "paymentNotes": "ООО / ИП. Выезд в экспедиции со своим комплектом.",
    "busyDates": ["2026-08-03", "2026-08-04", "2026-08-10", "2026-08-11"]
  },
  {
    "id": "spec-3",
    "name": "Елена Морозова",
    "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
    "primaryDepartment": "3. Цех Звука",
    "subcategories": ["Звукорежиссер FOH (Front of House)", "Системный инженер (Звук)"],
    "city": "Москва",
    "shiftRate": 35000,
    "isOpenToCreative": true,
    "yearsOfExperience": 6,
    "projectsCount": 48,
    "education": "МГК им. Чайковского (Акустика, 2018)",
    "rating": 4.8,
    "reviewsCount": 19,
    "equipmentTags": ["Midas M32", "Behringer SD8", "Sennheiser EW-DX", "RF-Explorer", "Dante Controller"],
    "showreelUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "gallery": [
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80"
    ],
    "bio": "FOH-звукорежиссер и радиочастотный менеджер. Настройка Dante-сетей и радиосистем любой плотности.",
    "paymentNotes": "Наличный / Безналичный расчет. Готова к TFP фестивалям.",
    "busyDates": ["2026-08-08", "2026-08-09", "2026-08-20"]
  },
  {
    "id": "spec-4",
    "name": "Дмитрий Чернов",
    "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
    "primaryDepartment": "1. Операторский цех и Камера",
    "subcategories": ["Фокус-пуллер (1st AC)", "DIT (Digital Imaging Technician)"],
    "city": "Москва",
    "shiftRate": 28000,
    "isOpenToCreative": true,
    "yearsOfExperience": 5,
    "projectsCount": 41,
    "education": "School of Visual Arts (2019)",
    "rating": 4.9,
    "reviewsCount": 23,
    "equipmentTags": ["Tilta Nucleus-M", "Teradek Bolt 4K", "Accsoon CineView", "SmallRig", "Silverstack DIT"],
    "showreelUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "gallery": [
      "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80"
    ],
    "bio": "Первоклассный 1st AC (Фокус-пуллер) и DIT-инженер. Высокая точность фокуса на открытой диафрагме.",
    "paymentNotes": "Самозанятый.",
    "busyDates": ["2026-08-01", "2026-08-07", "2026-08-14"]
  },
  {
    "id": "spec-5",
    "name": "Виктория Белова",
    "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
    "primaryDepartment": "7. Костюм и Грим",
    "subcategories": ["Художник по гриму / Главный гример", "Мастер по спецэффектам (SFX Makeup)"],
    "city": "Казань",
    "shiftRate": 32000,
    "isOpenToCreative": true,
    "yearsOfExperience": 7,
    "projectsCount": 55,
    "education": "Mosmake SFX (2017)",
    "rating": 5.0,
    "reviewsCount": 34,
    "equipmentTags": ["SFX Prosthetics", "Airbrush Temptu", "Silicone Molding", "Stage Blood FX"],
    "showreelUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "gallery": [
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80"
    ],
    "bio": "Пластический грим любой сложности, раны, старение, персонажи для хорроров и исторического кино.",
    "paymentNotes": "Оплата за смену + материалы по чекам.",
    "busyDates": ["2026-08-06", "2026-08-18", "2026-08-19"]
  },
  {
    "id": "spec-6",
    "name": "Игорь Ковалев",
    "avatar": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80",
    "primaryDepartment": "8. Сценический комплекс и Механика (Грип / Риггинг)",
    "subcategories": ["Кей-грип (Key Grip)", "Риггер (Высотные работы / Подвесы)"],
    "city": "Москва",
    "shiftRate": 42000,
    "isOpenToCreative": false,
    "yearsOfExperience": 10,
    "projectsCount": 115,
    "education": "IRATA Level 2 Альпинизм",
    "rating": 4.9,
    "reviewsCount": 41,
    "equipmentTags": ["Prolyte Truss", "CM Lodestar Hoist", "Rigging Hardware", "Safety Harness"],
    "showreelUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "gallery": [
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80"
    ],
    "bio": "Безопасный подвес ферм, световых приборов и экранов на стадионах и кинопавильонах.",
    "paymentNotes": "ИП с НДС / Безнал.",
    "busyDates": ["2026-08-02", "2026-08-13", "2026-08-22"]
  },
  {
    "id": "spec-7",
    "name": "Максим Громов",
    "avatar": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80",
    "primaryDepartment": "4. Продюсерский цех",
    "subcategories": ["Директор картины / площадки (UPM)", "Линейный продюсер"],
    "city": "Москва",
    "shiftRate": 50000,
    "isOpenToCreative": false,
    "yearsOfExperience": 9,
    "projectsCount": 78,
    "education": "ГИК (Продюсирование, 2015)",
    "rating": 4.9,
    "reviewsCount": 36,
    "equipmentTags": ["Movie Magic Scheduling", "Cellsys", "Call Sheet Pro"],
    "showreelUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "gallery": [
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80"
    ],
    "bio": "Директор площадки. Огранизация съемочного процесса до 200 человек в смене без срывов тайминга.",
    "paymentNotes": "ООО / ИП.",
    "busyDates": ["2026-08-05", "2026-08-06", "2026-08-07"]
  },
  {
    "id": "spec-8",
    "name": "Анастасия Крылова",
    "avatar": "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80",
    "primaryDepartment": "6. Художественный цех (Art Department)",
    "subcategories": ["Художник-постановщик", "Декоратор"],
    "city": "Санкт-Петербург",
    "shiftRate": 40000,
    "isOpenToCreative": true,
    "yearsOfExperience": 7,
    "projectsCount": 52,
    "education": "СПбГХПА им. Штиглица (2017)",
    "rating": 5.0,
    "reviewsCount": 27,
    "equipmentTags": ["SketchUp Pro", "Blender 3D", "Set Design Tools", "Prop Sourcing"],
    "showreelUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "gallery": [
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80"
    ],
    "bio": "Художник-постановщик. Разработка эскизов, превизуализация декораций в 3D и постройка сложных павильонов.",
    "paymentNotes": "Самозанятая.",
    "busyDates": ["2026-08-12", "2026-08-13", "2026-08-14"]
  },
  {
    "id": "spec-9",
    "name": "Роман Лебедев",
    "avatar": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80",
    "primaryDepartment": "9. Пост-продакшен (Монтаж и VFX)",
    "subcategories": ["Колорист", "VFX-супервайзер"],
    "city": "Москва",
    "shiftRate": 48000,
    "isOpenToCreative": true,
    "yearsOfExperience": 8,
    "projectsCount": 84,
    "education": "БВШД (Filmmaking, 2016)",
    "rating": 4.9,
    "reviewsCount": 39,
    "equipmentTags": ["DaVinci Resolve Studio", "Tangent Wave2", "Nuke Studio", "ACES Pipeline"],
    "showreelUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "gallery": [
      "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80"
    ],
    "bio": "Сертифицированный колорист DaVinci Resolve. Цветокоррекция полного метра, рекламы и клипов в ACES.",
    "paymentNotes": "ИП / Безнал.",
    "busyDates": ["2026-08-04", "2026-08-11", "2026-08-18"]
  },
  {
    "id": "spec-10",
    "name": "Ольга Васильева",
    "avatar": "https://images.unsplash.com/photo-1534751516642-a171e2614927?auto=format&fit=crop&w=300&q=80",
    "primaryDepartment": "5. Режиссерский цех",
    "subcategories": ["Второй режиссер (1st AD - планирование)", "Второй режиссер (2nd AD - площадка)"],
    "city": "Москва",
    "shiftRate": 38000,
    "isOpenToCreative": false,
    "yearsOfExperience": 6,
    "projectsCount": 45,
    "education": "ВГИК (2018)",
    "rating": 4.8,
    "reviewsCount": 21,
    "equipmentTags": ["Movie Magic Budgeting", "CPTB Scheduler", "Call Sheets"],
    "showreelUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "gallery": [
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80"
    ],
    "bio": "1st AD. Составление КПП (календарно-постановочного плана), вызывных листов и ведение площадки.",
    "paymentNotes": "Самозанятая.",
    "busyDates": ["2026-08-09", "2026-08-10", "2026-08-16"]
  },
  {
    "id": "spec-11",
    "name": "Сергей Медведев",
    "avatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80",
    "primaryDepartment": "1. Операторский цех и Камера",
    "subcategories": ["Оператор крана / коптера", "Оператор / Камерамен"],
    "city": "Екатеринбург",
    "shiftRate": 35000,
    "isOpenToCreative": true,
    "yearsOfExperience": 6,
    "projectsCount": 59,
    "education": "УрФУ (2017)",
    "rating": 4.9,
    "reviewsCount": 30,
    "equipmentTags": ["DJI Inspire 3", "DJI FPV", "FPV Cinema Drone", "Accsoon"],
    "showreelUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "gallery": [
      "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80"
    ],
    "bio": "Пилот дрона и FPV-оператор. Сертификат пилота, динамичные пролеты в павильонах и на натуре.",
    "paymentNotes": "ИП.",
    "busyDates": ["2026-08-15", "2026-08-16", "2026-08-17"]
  },
  {
    "id": "spec-12",
    "name": "Екатерина Полякова",
    "avatar": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80",
    "primaryDepartment": "7. Костюм и Грим",
    "subcategories": ["Художник по костюмам", "Ассистент по костюмам / Костюмер"],
    "city": "Москва",
    "shiftRate": 33000,
    "isOpenToCreative": true,
    "yearsOfExperience": 5,
    "projectsCount": 38,
    "education": "МХПИ (Дизайн костюма, 2019)",
    "rating": 5.0,
    "reviewsCount": 24,
    "equipmentTags": ["Costume Styling", "Period Wardrobe", "Fabric Aging FX"],
    "showreelUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "gallery": [
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80"
    ],
    "bio": "Художник по костюмам. Подбор гардероба под стиль проекта, подгонка и фактуровка ткани.",
    "paymentNotes": "Самозанятая.",
    "busyDates": ["2026-08-03", "2026-08-21"]
  }
];

function toggleMobileFilters() {
  const drawer = document.getElementById('mobile-filter-drawer');
  if (drawer) drawer.classList.toggle('hidden');
}

let departmentsData = DEFAULT_DEPARTMENTS_DATA;
let specialistsData = DEFAULT_SPECIALISTS_DATA;
let activeLayout = 'grid';
let activeModalSpecialist = null;

// User Interactive Calendar for Specialist Dashboard
let myBusyDates = ["2026-08-01", "2026-08-02", "2026-08-05", "2026-08-15", "2026-08-16"];

async function initApp() {
  await loadData();
  populateDepartmentFilters();
  applyFilters();
  renderInteractiveSpecCalendar();
  renderEmployerDashboard();
  if (window.lucide) window.lucide.createIcons();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

async function loadData() {
  try {
    const [deptRes, specRes] = await Promise.all([
      fetch('./data/departments.json'),
      fetch('./data/specialists.json')
    ]);
    if (deptRes.ok && specRes.ok) {
      const depts = await deptRes.json();
      const specs = await specRes.json();
      if (Array.isArray(depts) && depts.length > 0) departmentsData = depts;
      if (Array.isArray(specs) && specs.length > 0) specialistsData = specs;
    }
  } catch (err) {
    console.warn('Loading fallback data due to fetch restriction/network:', err);
  }
}

function populateDepartmentFilters() {
  const deptSelect = document.getElementById('filter-department');
  const customDeptSelect = document.getElementById('custom-dept-select');
  
  if (deptSelect) deptSelect.innerHTML = '<option value="">Все 9 цехов</option>';
  if (customDeptSelect) customDeptSelect.innerHTML = '<option value="">Выберите цех...</option>';

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

  onDepartmentChange();
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
    if (btn) {
      btn.classList.remove('border-b-2', 'border-cyan-400', 'text-cyan-400', 'font-bold');
      btn.classList.add('text-zinc-400', 'font-medium');
    }
  });

  document.getElementById(`modal-tab-${tab}`).classList.remove('hidden');
  const activeBtn = document.getElementById(`tab-btn-${tab}`);
  if (activeBtn) {
    activeBtn.classList.add('border-b-2', 'border-cyan-400', 'text-cyan-400', 'font-bold');
    activeBtn.classList.remove('text-zinc-400', 'font-medium');
  }
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
  const spec = specialistsData.find(s => s.id === 'spec-1') || specialistsData[0];
  if (spec) {
    const nameEl = document.getElementById('my-spec-name');
    const cityEl = document.getElementById('my-spec-city');
    const rateEl = document.getElementById('my-spec-rate');
    const expEl = document.getElementById('my-spec-exp');
    const tfpEl = document.getElementById('my-spec-tfp');
    const tagsEl = document.getElementById('my-spec-tags');
    const showreelEl = document.getElementById('my-spec-showreel');
    const bioEl = document.getElementById('my-spec-bio');

    if (nameEl && nameEl.value) spec.name = nameEl.value.trim();
    if (cityEl && cityEl.value) spec.city = cityEl.value.trim();
    if (rateEl && rateEl.value) spec.shiftRate = Number(rateEl.value) || spec.shiftRate;
    if (expEl && expEl.value) spec.yearsOfExperience = Number(expEl.value) || spec.yearsOfExperience;
    if (tfpEl) spec.isOpenToCreative = tfpEl.checked;
    if (tagsEl && tagsEl.value) spec.equipmentTags = tagsEl.value.split(',').map(t => t.trim()).filter(Boolean);
    if (showreelEl && showreelEl.value) spec.showreelUrl = showreelEl.value.trim();
    if (bioEl && bioEl.value) spec.bio = bioEl.value.trim();
  }
  applyFilters();
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
  const modal = document.getElementById('custom-cat-modal');
  if (modal) modal.classList.remove('hidden');
}

function closeCustomCategoryModal() {
  const modal = document.getElementById('custom-cat-modal');
  if (modal) modal.classList.add('hidden');
}

function submitCustomCategory(e) {
  e.preventDefault();
  const catInput = document.getElementById('custom-subcat-input');
  const catName = catInput ? catInput.value.trim() : '';
  if (catInput) catInput.value = '';
  closeCustomCategoryModal();
  showToast(`Заявка на профессию «${catName || 'Новая'}» отправлена в админ-панель!`);
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
  const searchEl = document.getElementById('filter-search');
  if (searchEl) searchEl.value = '';

  const deptEl = document.getElementById('filter-department');
  if (deptEl) deptEl.value = '';

  const rateEl = document.getElementById('filter-max-rate');
  if (rateEl) {
    rateEl.value = 100000;
    onRateInput(100000);
  }

  const tfpEl = document.getElementById('filter-tfp');
  if (tfpEl) tfpEl.checked = false;

  const expEl = document.getElementById('filter-exp');
  if (expEl) {
    expEl.value = 0;
    onExpInput(0);
  }

  const reelEl = document.getElementById('filter-showreel');
  if (reelEl) reelEl.checked = false;

  const dateEl = document.getElementById('filter-date');
  if (dateEl) dateEl.value = '';

  onDepartmentChange();
}

// Employer Roles Selection Panel Logic & Projects Data
let selectedProjectRoles = ["Гафер (Gaffer)", "Фокус-пуллер (1st AC)"];

let employerProjects = [
  {
    id: 'proj-1',
    title: 'Фильм «Темная глубина»',
    dates: '12.08 - 15.08.2026',
    statusText: 'В работе',
    statusClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    desc: 'Мосфильм. Бюджет смены: 50 000 ₽ / чел.',
    specialistName: 'Александр В.',
    roleName: 'Гафер',
    bookingStatus: 'Подтверждено',
    bookingStatusClass: 'bg-emerald-500/20 text-emerald-400'
  },
  {
    id: 'proj-2',
    title: 'Клип «Skyline Echoes»',
    dates: '20.08.2026',
    statusText: 'Сбор смены',
    statusClass: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    desc: 'Крокус Сити. Нужен FOH (Midas M32).',
    specialistName: 'Елена М.',
    roleName: 'Звукорежиссер',
    bookingStatus: 'В ожидании',
    bookingStatusClass: 'bg-amber-500/20 text-amber-400'
  }
];

function renderEmployerDashboard() {
  const container = document.getElementById('employer-projects-list');
  if (!container) return;

  container.innerHTML = employerProjects.map(proj => `
    <div class="glass-card p-3.5 rounded-2xl space-y-2">
      <div class="flex items-center justify-between text-[11px]">
        <span class="font-mono text-[9px] px-2 py-0.5 rounded ${proj.statusClass} border font-bold">${proj.statusText}</span>
        <span class="text-zinc-400 font-mono text-[10px]">${proj.dates}</span>
      </div>
      <h4 class="font-bold text-white text-xs sm:text-sm">${proj.title}</h4>
      <p class="text-[11px] text-zinc-400 line-clamp-2">${proj.desc}</p>
      <div class="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[10px]">
        <span class="text-zinc-400 truncate">${proj.roleName}: <strong class="text-emerald-400">${proj.specialistName}</strong></span>
        <span class="px-2 py-0.5 rounded ${proj.bookingStatusClass} font-bold shrink-0">${proj.bookingStatus}</span>
      </div>
    </div>
  `).join('');
}

function openCreateProjectModal() {
  document.getElementById('create-project-modal').classList.remove('hidden');
  renderRolesDropdownTree();
  updateSelectedRolesTriggerUI();
}

function closeCreateProjectModal() {
  document.getElementById('create-project-modal').classList.add('hidden');
  const panel = document.getElementById('project-roles-panel');
  if (panel) panel.classList.add('hidden');
}

function toggleRolesListSection() {
  const panel = document.getElementById('project-roles-panel');
  const toggleText = document.getElementById('roles-toggle-text');
  if (!panel) return;

  if (panel.classList.contains('hidden')) {
    renderRolesDropdownTree();
    panel.classList.remove('hidden');
    if (toggleText) toggleText.textContent = '▲ Скрыть список';
  } else {
    panel.classList.add('hidden');
    if (toggleText) toggleText.textContent = '▼ Выбрать профессии';
  }
}

function getActiveDepartmentsList() {
  if (departmentsData && departmentsData.length > 0) return departmentsData;
  return [
    {"name":"1. Операторский цех и Камера","professions":["Оператор-постановщик (DOP)","Оператор / Камерамен","Второй оператор","Фокус-пуллер (1st AC)","Камера-механик (2nd AC)","Стедикамист","Оператор крана / коптера","DIT (Digital Imaging Technician)","Видеоинженер / Плейбэкер"]},
    {"name":"2. Цех Света (Светотехника)","professions":["Художник по свету (Lighting Designer)","Гафер (Gaffer)","Оператор светового пульта","Системный инженер (Art-Net / DMX / Сети)","Осветитель (Lighting Technician)","Бестбой (Best Boy Electric)","Художник превизуализации"]},
    {"name":"3. Цех Звука","professions":["Звукорежиссер на площадке / Саунд-дизайнер","Звукорежиссер FOH (Front of House)","Мониторный звукорежиссер","Бум-оператор (Микрофонщик)","Системный инженер (Звук)","RF-менеджер (Радиочастоты)","Техник по звуку"]},
    {"name":"4. Продюсерский цех","professions":["Генеральный / Исполнительный продюсер","Креативный продюсер","Линейный продюсер","Шоу-раннер","Директор картины / площадки (UPM)","Локейшен-менеджер (Location Manager)","Администратор площадки"]},
    {"name":"5. Режиссерский цех","professions":["Режиссер-постановщик","Второй режиссер (1st AD - планирование)","Второй режиссер (2nd AD - площадка)","Помощник режиссер (Скрипт-супервайзер)","Кастинг-директор","Ассистент по актерам","Бригадир АМС (Массовка)","Хлопушка"]},
    {"name":"6. Художественный цех (Art Department)","professions":["Художник-постановщик","Арт-директор","Декоратор","Постановщик","Художник по реквизиту / Реквизитор","Бутафор"]},
    {"name":"7. Костюм и Грим","professions":["Художник по костюмам","Ассистент по костюмам / Костюмер","Художник по гриму / Главный гример","Гример-визажист","Мастер по спецэффектам (SFX Makeup)"]},
    {"name":"8. Сценический комплекс и Механика (Грип / Риггинг)","professions":["Долли-грип (Кран / Тележка)","Кей-грип (Key Grip)","Машинист сцены / Стейджхэнд","Риггер (Высотные работы / Подвесы)"]},
    {"name":"9. Пост-продакшен (Монтаж и VFX)","professions":["Режиссер монтажа","Колорист","VFX-супервайзер","CG-Artist / Моушн-дизайнер","Звукорежиссер пост-продакшена"]}
  ];
}

function renderRolesDropdownTree(searchQuery = '') {
  const container = document.getElementById('roles-checkboxes-container');
  if (!container) return;

  const query = searchQuery.toLowerCase().trim();
  container.innerHTML = '';
  const list = getActiveDepartmentsList();

  list.forEach(dept => {
    const matchedProfessions = dept.professions.filter(p => p.toLowerCase().includes(query));
    if (query && matchedProfessions.length === 0) return;

    const deptGroup = document.createElement('div');
    deptGroup.className = 'space-y-1';

    const deptTitle = document.createElement('div');
    deptTitle.className = 'font-bold text-cyan-400 uppercase text-[9px] tracking-wider pt-1 border-b border-zinc-800 pb-0.5';
    deptTitle.textContent = dept.name;
    deptGroup.appendChild(deptTitle);

    const profsList = query ? matchedProfessions : dept.professions;
    profsList.forEach(prof => {
      const isChecked = selectedProjectRoles.includes(prof);
      const row = document.createElement('label');
      row.className = 'flex items-center gap-2 py-1 px-1.5 rounded-lg hover:bg-zinc-900 cursor-pointer transition-all';
      
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.checked = isChecked;
      input.className = 'w-3.5 h-3.5 rounded bg-zinc-950 border-zinc-700 text-amber-500 accent-amber-500 shrink-0';
      input.onchange = () => toggleRoleSelection(prof);

      const span = document.createElement('span');
      span.className = 'text-zinc-200 text-[11px] truncate';
      span.textContent = prof;

      row.appendChild(input);
      row.appendChild(span);
      deptGroup.appendChild(row);
    });

    container.appendChild(deptGroup);
  });
}

function filterRolesDropdown() {
  const searchInput = document.getElementById('roles-dropdown-search');
  if (searchInput) {
    renderRolesDropdownTree(searchInput.value);
  }
}

function toggleRoleSelection(prof) {
  if (selectedProjectRoles.includes(prof)) {
    selectedProjectRoles = selectedProjectRoles.filter(p => p !== prof);
  } else {
    selectedProjectRoles.push(prof);
  }
  updateSelectedRolesTriggerUI();
  const panel = document.getElementById('project-roles-panel');
  if (panel && !panel.classList.contains('hidden')) {
    const searchInput = document.getElementById('roles-dropdown-search');
    renderRolesDropdownTree(searchInput ? searchInput.value : '');
  }
}

function removeRoleByIndex(index) {
  selectedProjectRoles.splice(index, 1);
  updateSelectedRolesTriggerUI();
  const panel = document.getElementById('project-roles-panel');
  if (panel && !panel.classList.contains('hidden')) {
    const searchInput = document.getElementById('roles-dropdown-search');
    renderRolesDropdownTree(searchInput ? searchInput.value : '');
  }
}

function updateSelectedRolesTriggerUI() {
  const container = document.getElementById('project-roles-selected-tags');
  if (!container) return;

  if (selectedProjectRoles.length === 0) {
    container.innerHTML = `<span class="text-zinc-500 text-xs">Нажмите, чтобы выбрать специальности...</span>`;
  } else {
    container.innerHTML = selectedProjectRoles.map((role, idx) => `
      <span class="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
        ${role}
        <span onclick="event.stopPropagation(); removeRoleByIndex(${idx});" class="hover:text-white font-bold cursor-pointer ml-0.5">✕</span>
      </span>
    `).join('');
  }
}

function submitNewProject(e) {
  e.preventDefault();
  const nameInput = document.getElementById('project-name-input');
  const budgetInput = document.getElementById('project-budget-input');
  const descInput = document.getElementById('project-desc-input');
  const dateInput = document.getElementById('project-start-date');

  const name = nameInput ? nameInput.value.trim() : 'Съемочный проект';
  const budget = budgetInput ? budgetInput.value : '45000';
  const desc = descInput ? descInput.value.trim() : 'Павильонные съемки';
  const startDate = dateInput && dateInput.value ? dateInput.value.split('-').reverse().join('.') : 'Скоро';

  employerProjects.unshift({
    id: `proj-${Date.now()}`,
    title: name,
    dates: startDate,
    statusText: 'Сбор смены',
    statusClass: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    desc: `${desc || 'Описание не указано'}. Бюджет: ${Number(budget).toLocaleString('ru-RU')} ₽`,
    specialistName: selectedProjectRoles.length > 0 ? selectedProjectRoles[0] : 'Специалист',
    roleName: 'Поиск',
    bookingStatus: 'В ожидании',
    bookingStatusClass: 'bg-amber-500/20 text-amber-400'
  });

  renderEmployerDashboard();
  closeCreateProjectModal();
  switchNav('dashboard-prod');
  showToast(`Проект «${name}» опубликован! Вы можете забронировать специалистов.`);
}

function bookingRequestAction() {
  closeSpecialistModal();
  if (activeModalSpecialist) {
    const mainRole = activeModalSpecialist.subcategories[0] || 'Специалист';
    employerProjects.unshift({
      id: `proj-${Date.now()}`,
      title: `Съемка с ${activeModalSpecialist.name}`,
      dates: 'Август 2026',
      statusText: 'Вызов на съемку',
      statusClass: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      desc: `Приглашение для ${activeModalSpecialist.name} (${mainRole}). Ставка: ${activeModalSpecialist.shiftRate.toLocaleString('ru-RU')} ₽.`,
      specialistName: activeModalSpecialist.name,
      roleName: mainRole,
      bookingStatus: 'В ожидании',
      bookingStatusClass: 'bg-amber-500/20 text-amber-400'
    });
    renderEmployerDashboard();
    showToast(`Приглашение на съемку отправлено специалисту ${activeModalSpecialist.name}! Заявка отображается в Кабинете Нанимателя.`);
  }
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  document.getElementById('toast-message').textContent = msg;
  toast.classList.remove('hidden');
  setTimeout(() => {
    toast.classList.add('hidden');
  }, 3500);
}


