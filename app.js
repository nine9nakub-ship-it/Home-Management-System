/**
 * ระบบจัดการการบ้าน Multi-Room โรงเรียนบรรหารแจ่มใสวิทยา 3
 * Application Logic & LocalStorage Management (v2)
 */

const STORAGE_KEY = 'banharn_homework_tracker_v2';

// ข้อมูลเริ่มต้น (Default Template)
const DEFAULT_ROOM_ID = 'room-default-m410';
const DEFAULT_DATA = {
  version: 2,
  rooms: {
    [DEFAULT_ROOM_ID]: {
      id: DEFAULT_ROOM_ID,
      name: 'ม.4/10',
      pin: '1234', // รหัสผ่านเริ่มต้น
      announcement: {
        text: 'งานกีฬาสีสัปดาห์หน้า งดสั่งการบ้านวิชาพลศึกษาและศิลปะ!',
        active: true
      },
      students: ['นาย สมชาย รักเรียน', 'นางสาว สมหญิง ใจดี', 'นาย สมศักดิ์ ขยัน'],
      groups: ['กลุ่ม 1 (โครงงาน)', 'กลุ่ม 2 (โครงงาน)']
    }
  },
  tasks: [
    {
      id: 'task-1',
      roomId: DEFAULT_ROOM_ID,
      subjectCode: 'ค31201',
      subjectName: 'คณิตศาสตร์เพิ่มเติม',
      teacher: 'ครูสมชาย ใจดี',
      title: 'แบบฝึกหัด 1.1 เรื่องเซต (หน้า 15)',
      isGroup: false,
      assignedDate: '2024-05-12',
      dueDate: '2024-05-15',
      completions: ['นาย สมชาย รักเรียน', 'นางสาว สมหญิง ใจดี'], // ชื่อคนที่ส่งแล้ว
      notes: 'ส่งในคาบเรียน',
      color: 'blue'
    },
    {
      id: 'task-2',
      roomId: DEFAULT_ROOM_ID,
      subjectCode: 'ค31201',
      subjectName: 'คณิตศาสตร์เพิ่มเติม',
      teacher: 'ครูสมชาย ใจดี',
      title: 'โครงงานคณิตศาสตร์ (งานกลุ่ม)',
      isGroup: true,
      assignedDate: '2024-05-20',
      dueDate: '2024-06-30',
      completions: ['กลุ่ม 1 (โครงงาน)'],
      notes: 'กลุ่มละ 5 คน ทำรูปเล่ม',
      color: 'blue'
    }
  ]
};

// Application State
let appData = null;
let currentRoomId = null; // null = อยู่หน้าเลือกห้อง

let currentFilters = {
  subject: 'all',
  status: 'all', // 'all', 'pending', 'completed', 'group'
  search: '',
  sortBy: 'due-asc',
  viewMode: 'card' // 'card' or 'table'
};

// เดือนภาษาไทย
const THAI_MONTHS_SHORT = [
  'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
  'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
];

/* ==========================================================================
   Utility Functions
   ========================================================================== */

function formatThaiDate(dateStr) {
  if (!dateStr) return '-';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  
  if (isNaN(year) || isNaN(month) || isNaN(day)) return dateStr;
  
  const thaiYearShort = (year + 543) % 100;
  return `${day} ${THAI_MONTHS_SHORT[month]} ${thaiYearShort.toString().padStart(2, '0')}`;
}

function getDueStatus(dueDateStr, progressPercent) {
  if (progressPercent === 100) {
    return { text: 'ส่งครบทุกคน', colorClass: 'bg-emerald-100 text-emerald-800 border-emerald-300', type: 'completed' };
  }
  
  if (!dueDateStr) {
    return { text: 'ไม่ระบุวันส่ง', colorClass: 'bg-slate-100 text-slate-700 border-slate-300', type: 'none' };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDateStr);
  due.setHours(0, 0, 0, 0);

  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { text: `เลยกำหนด ${Math.abs(diffDays)} วัน`, colorClass: 'bg-rose-100 text-rose-800 border-rose-300 font-semibold', type: 'overdue' };
  } else if (diffDays === 0) {
    return { text: 'ส่งวันนี้!', colorClass: 'bg-amber-500 text-white font-bold urgent-badge', type: 'today' };
  } else if (diffDays === 1) {
    return { text: 'ส่งพรุ่งนี้', colorClass: 'bg-amber-100 text-amber-800 border-amber-300 font-medium', type: 'tomorrow' };
  } else if (diffDays <= 3) {
    return { text: `เหลืออีก ${diffDays} วัน`, colorClass: 'bg-orange-100 text-orange-800 border-orange-300', type: 'near' };
  } else {
    return { text: `เหลืออีก ${diffDays} วัน`, colorClass: 'bg-blue-50 text-blue-700 border-blue-200', type: 'normal' };
  }
}

function getSubjectColorClass(color) {
  const map = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', badge: 'bg-blue-100 text-blue-800' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', badge: 'bg-emerald-100 text-emerald-800' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', badge: 'bg-purple-100 text-purple-800' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', badge: 'bg-amber-100 text-amber-800' },
    rose: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', badge: 'bg-rose-100 text-rose-800' },
    cyan: { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200', badge: 'bg-cyan-100 text-cyan-800' },
    indigo: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', badge: 'bg-indigo-100 text-indigo-800' },
    orange: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', badge: 'bg-orange-100 text-orange-800' }
  };
  return map[color] || map.blue;
}

function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  const bg = type === 'success' ? 'bg-slate-900 text-white' : (type === 'error' ? 'bg-rose-600 text-white' : 'bg-blue-600 text-white');
  toast.className = `flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-lg ${bg} text-sm transition-all duration-300 transform translate-y-2 opacity-0`;
  toast.innerHTML = `<span>${type === 'success' ? '✓' : (type === 'error' ? '✕' : 'ℹ')}</span><span>${message}</span>`;
  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.remove('translate-y-2', 'opacity-0'));
  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => toast.remove(), 300);
  }, 2600);
}

function triggerConfetti() {
  if (typeof confetti === 'function') confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
}

/* ==========================================================================
   Storage & Initialization
   ========================================================================== */

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      appData = JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error reading localStorage:', e);
  }
  
  if (!appData || appData.version !== 2) {
    // Migration or initialization
    appData = JSON.parse(JSON.stringify(DEFAULT_DATA));
    saveData();
  }
}

function saveData() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
  } catch (e) {
    console.error('Error saving to localStorage:', e);
    showToast('เกิดข้อผิดพลาดในการบันทึกข้อมูล', 'error');
  }
}

function initApp() {
  loadData();
  renderRoomSelection();
  
  // See if there's a stored session (optional), for now always start at login
  showScreen('login-screen');
}

function showScreen(screenId) {
  document.getElementById('login-screen').classList.add('hidden');
  document.getElementById('main-dashboard').classList.add('hidden');
  document.getElementById(screenId).classList.remove('hidden');
}

/* ==========================================================================
   Room Management & Login
   ========================================================================== */

function renderRoomSelection() {
  const container = document.getElementById('room-list-container');
  if (!container) return;
  
  const rooms = Object.values(appData.rooms);
  if (rooms.length === 0) {
    container.innerHTML = `<p class="text-slate-500 text-sm text-center py-4">ยังไม่มีห้องเรียน กรุณาสร้างห้องใหม่</p>`;
    return;
  }

  let html = '';
  rooms.forEach(room => {
    html += `
      <button onclick="promptRoomPin('${room.id}')" class="w-full text-left p-4 rounded-2xl border border-slate-200 bg-white hover:border-blue-500 hover:shadow-md transition-all flex items-center justify-between group">
        <div>
          <h3 class="text-lg font-bold text-slate-800">${room.name}</h3>
          <p class="text-xs text-slate-500 mt-1"><i data-lucide="users" class="w-3 h-3 inline"></i> นักเรียน ${room.students.length} คน | <i data-lucide="layers" class="w-3 h-3 inline"></i> กลุ่ม ${room.groups.length} กลุ่ม</p>
        </div>
        <div class="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
          <i data-lucide="chevron-right" class="w-5 h-5"></i>
        </div>
      </button>
    `;
  });
  container.innerHTML = html;
  if (window.lucide) lucide.createIcons();
}

let pendingLoginRoomId = null;

function promptRoomPin(roomId) {
  const room = appData.rooms[roomId];
  if (!room) return;
  pendingLoginRoomId = roomId;
  document.getElementById('login-room-name').textContent = room.name;
  document.getElementById('pin-input').value = '';
  
  document.getElementById('pin-modal').classList.remove('hidden');
  document.getElementById('pin-modal').classList.add('flex');
  setTimeout(() => document.getElementById('pin-input').focus(), 100);
}

function closePinModal() {
  document.getElementById('pin-modal').classList.add('hidden');
  document.getElementById('pin-modal').classList.remove('flex');
  pendingLoginRoomId = null;
}

function handlePinSubmit(e) {
  e.preventDefault();
  const inputPin = document.getElementById('pin-input').value;
  const room = appData.rooms[pendingLoginRoomId];
  
  if (room.pin === inputPin) {
    closePinModal();
    enterRoom(room.id);
  } else {
    showToast('รหัสผ่านไม่ถูกต้อง', 'error');
  }
}

function enterRoom(roomId) {
  currentRoomId = roomId;
  const room = appData.rooms[roomId];
  document.getElementById('room-name-display').textContent = room.name;
  
  // Reset filters
  currentFilters = { subject: 'all', status: 'all', search: '', sortBy: 'due-asc', viewMode: 'card' };
  
  showScreen('main-dashboard');
  refreshDashboard();
  showToast(`เข้าสู่ห้อง ${room.name} เรียบร้อยแล้ว`);
}

function leaveRoom() {
  currentRoomId = null;
  showScreen('login-screen');
  renderRoomSelection();
}

// Create Room
function openCreateRoomModal() {
  document.getElementById('create-room-form').reset();
  document.getElementById('create-room-modal').classList.remove('hidden');
  document.getElementById('create-room-modal').classList.add('flex');
}

function closeCreateRoomModal() {
  document.getElementById('create-room-modal').classList.add('hidden');
  document.getElementById('create-room-modal').classList.remove('flex');
}

function handleCreateRoomSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('new-room-name').value.trim();
  const pin = document.getElementById('new-room-pin').value.trim();
  
  if (!name || !pin) return;
  
  const newRoomId = 'room-' + Date.now();
  appData.rooms[newRoomId] = {
    id: newRoomId,
    name: name,
    pin: pin,
    announcement: { text: 'ยินดีต้อนรับสู่ห้องใหม่!', active: true },
    students: [],
    groups: []
  };
  
  saveData();
  closeCreateRoomModal();
  renderRoomSelection();
  showToast('สร้างห้องเรียนสำเร็จ');
}

/* ==========================================================================
   Dashboard & Render Data
   ========================================================================== */

function refreshDashboard() {
  if (!currentRoomId) return;
  renderAnnouncement();
  updateDashboardStats();
  renderSubjectFilters();
  renderTasks();
}

function renderAnnouncement() {
  const room = appData.rooms[currentRoomId];
  const banner = document.getElementById('announcement-banner');
  const textEl = document.getElementById('announcement-text');
  
  if (room.announcement && room.announcement.active && room.announcement.text) {
    textEl.textContent = room.announcement.text;
    banner.classList.remove('hidden');
  } else {
    banner.classList.add('hidden');
  }
}

function toggleAnnouncement() {
  const room = appData.rooms[currentRoomId];
  room.announcement.active = !room.announcement.active;
  saveData();
  renderAnnouncement();
}

function editAnnouncement() {
  const room = appData.rooms[currentRoomId];
  const updated = prompt('พิมพ์ข้อความประกาศห้องใหม่:', room.announcement.text);
  if (updated !== null && updated.trim()) {
    room.announcement.text = updated.trim();
    room.announcement.active = true;
    saveData();
    renderAnnouncement();
    showToast('อัปเดตประกาศห้องแล้ว');
  }
}

function getTaskProgress(task) {
  const room = appData.rooms[currentRoomId];
  const totalCount = task.isGroup ? room.groups.length : room.students.length;
  const completedCount = Array.isArray(task.completions) ? task.completions.length : 0;
  
  if (totalCount === 0) return { percent: 0, text: 'ยังไม่มีสมาชิก', completed: 0, total: 0 };
  
  const percent = Math.round((completedCount / totalCount) * 100);
  return { percent, text: `${completedCount}/${totalCount}`, completed: completedCount, total: totalCount };
}

function updateDashboardStats() {
  const roomTasks = appData.tasks.filter(t => t.roomId === currentRoomId);
  const total = roomTasks.length;
  
  let fullyCompletedTasks = 0;
  let urgentCount = 0;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let totalPossibleSubmissions = 0;
  let totalActualSubmissions = 0;
  
  roomTasks.forEach(t => {
    const prog = getTaskProgress(t);
    totalPossibleSubmissions += prog.total;
    totalActualSubmissions += prog.completed;
    
    if (prog.total > 0 && prog.completed === prog.total) {
      fullyCompletedTasks++;
    } else {
      // Check urgent (pending and due within 3 days or overdue)
      if (t.dueDate) {
        const due = new Date(t.dueDate);
        due.setHours(0, 0, 0, 0);
        const diffDays = Math.round((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays <= 3) urgentCount++;
      }
    }
  });

  const pending = total - fullyCompletedTasks;
  const overallPercent = totalPossibleSubmissions > 0 ? Math.round((totalActualSubmissions / totalPossibleSubmissions) * 100) : 0;

  document.getElementById('stat-total').textContent = total;
  document.getElementById('stat-completed').textContent = fullyCompletedTasks;
  document.getElementById('stat-pending').textContent = pending;
  document.getElementById('stat-urgent').textContent = urgentCount;
  
  const progressBar = document.getElementById('stat-progress-bar');
  if (progressBar) progressBar.style.width = `${overallPercent}%`;
  const progressText = document.getElementById('stat-progress-text');
  if (progressText) progressText.textContent = `${overallPercent}%`;
}

// Subject Filters
function renderSubjectFilters() {
  const roomTasks = appData.tasks.filter(t => t.roomId === currentRoomId);
  const subjectMap = new Map();

  roomTasks.forEach(t => {
    if (!subjectMap.has(t.subjectName)) {
      subjectMap.set(t.subjectName, 1);
    } else {
      subjectMap.set(t.subjectName, subjectMap.get(t.subjectName) + 1);
    }
  });

  const container = document.getElementById('subject-filter-container');
  if (!container) return;

  let html = `
    <button onclick="setSubjectFilter('all')" 
      class="px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${currentFilters.subject === 'all' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}">
      ทุกวิชา (${roomTasks.length})
    </button>
  `;

  subjectMap.forEach((count, name) => {
    const isSelected = currentFilters.subject === name;
    html += `
      <button onclick="setSubjectFilter('${name.replace(/'/g, "\\'")}')" 
        class="px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${isSelected ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}">
        ${name} (${count})
      </button>
    `;
  });
  container.innerHTML = html;
}

function setSubjectFilter(subName) { currentFilters.subject = subName; renderSubjectFilters(); renderTasks(); }
function setStatusFilter(status) {
  currentFilters.status = status;
  document.querySelectorAll('.status-filter-btn').forEach(btn => {
    btn.className = (btn.dataset.status === status) 
      ? 'status-filter-btn px-4 py-1.5 rounded-lg text-xs font-semibold bg-white text-blue-600 shadow-xs transition-all'
      : 'status-filter-btn px-4 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 transition-all';
  });
  renderTasks();
}
function setViewMode(mode) {
  currentFilters.viewMode = mode;
  document.getElementById('view-mode-card').className = `p-1.5 rounded-lg transition-all ${mode === 'card' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`;
  document.getElementById('view-mode-table').className = `p-1.5 rounded-lg transition-all ${mode === 'table' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`;
  renderTasks();
}

function getFilteredTasks() {
  let tasks = appData.tasks.filter(t => t.roomId === currentRoomId);

  if (currentFilters.subject !== 'all') tasks = tasks.filter(t => t.subjectName === currentFilters.subject);
  
  if (currentFilters.status === 'pending') {
    tasks = tasks.filter(t => getTaskProgress(t).percent < 100);
  } else if (currentFilters.status === 'completed') {
    tasks = tasks.filter(t => getTaskProgress(t).percent === 100 && getTaskProgress(t).total > 0);
  } else if (currentFilters.status === 'group') {
    tasks = tasks.filter(t => t.isGroup);
  }

  if (currentFilters.search.trim()) {
    const q = currentFilters.search.trim().toLowerCase();
    tasks = tasks.filter(t => t.title.toLowerCase().includes(q) || t.subjectName.toLowerCase().includes(q) || (t.teacher && t.teacher.toLowerCase().includes(q)));
  }

  tasks.sort((a, b) => {
    if (currentFilters.sortBy === 'due-asc') return (a.dueDate || '9999') > (b.dueDate || '9999') ? 1 : -1;
    if (currentFilters.sortBy === 'due-desc') return (a.dueDate || '') < (b.dueDate || '') ? 1 : -1;
    if (currentFilters.sortBy === 'assigned-desc') return (a.assignedDate || '') < (b.assignedDate || '') ? 1 : -1;
    if (currentFilters.sortBy === 'subject') return a.subjectName.localeCompare(b.subjectName, 'th');
    return 0;
  });

  return tasks;
}

function renderTasks() {
  const container = document.getElementById('tasks-container');
  if (!container) return;
  const tasks = getFilteredTasks();

  if (tasks.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-16 text-center bg-white rounded-2xl border border-dashed border-slate-200 p-8">
        <div class="w-16 h-16 mx-auto mb-4 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center"><i data-lucide="inbox" class="w-8 h-8"></i></div>
        <h4 class="text-base font-medium text-slate-700 mb-1">ไม่พบรายการการบ้าน</h4>
        <button onclick="openAddTaskModal()" class="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-all shadow-sm">
          <i data-lucide="plus" class="w-4 h-4"></i> เพิ่มการบ้าน
        </button>
      </div>`;
    if (window.lucide) lucide.createIcons();
    return;
  }

  if (currentFilters.viewMode === 'table') renderTableView(tasks, container);
  else renderCardView(tasks, container);

  if (window.lucide) lucide.createIcons();
}

function renderCardView(tasks, container) {
  let html = `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">`;
  tasks.forEach(task => {
    const prog = getTaskProgress(task);
    const dueStatus = getDueStatus(task.dueDate, prog.percent);
    const colorTheme = getSubjectColorClass(task.color);
    const isFull = prog.percent === 100 && prog.total > 0;

    html += `
      <div class="group bg-white rounded-2xl p-5 border ${isFull ? 'border-emerald-200 bg-emerald-50/20' : 'border-slate-200/80 shadow-sm hover:shadow-md'} transition-all-custom flex flex-col justify-between">
        <div>
          <div class="flex items-start justify-between gap-2 mb-3">
            <div class="flex items-center gap-1.5 flex-wrap">
              <span class="px-2.5 py-1 rounded-lg text-xs font-medium ${colorTheme.badge}">${task.subjectCode ? `${task.subjectCode} ` : ''}${task.subjectName}</span>
              ${task.isGroup ? `<span class="px-2 py-0.5 rounded-lg text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1"><i data-lucide="users" class="w-3 h-3"></i> งานกลุ่ม</span>` : ''}
            </div>
            <span class="px-2.5 py-1 rounded-full text-[10px] sm:text-xs border ${dueStatus.colorClass}">${dueStatus.text}</span>
          </div>

          <h3 class="text-base font-semibold leading-snug text-slate-800 mb-1">${task.title}</h3>
          ${task.teacher ? `<p class="text-xs text-slate-500 mb-3 flex items-center gap-1"><i data-lucide="user" class="w-3 h-3 text-slate-400"></i> ${task.teacher}</p>` : ''}
          
          <div class="mb-4">
            <div class="flex justify-between items-center text-xs mb-1">
              <span class="text-slate-500 font-medium">ส่งแล้ว ${prog.text}</span>
              <span class="font-bold ${isFull ? 'text-emerald-600' : 'text-blue-600'}">${prog.percent}%</span>
            </div>
            <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div class="h-full ${isFull ? 'bg-emerald-500' : 'bg-blue-500'} transition-all" style="width: ${prog.percent}%"></div>
            </div>
          </div>
          
          <button onclick="openChecklistModal('${task.id}')" class="w-full py-2 mb-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-blue-300 text-sm font-medium text-slate-700 transition-colors flex items-center justify-center gap-2">
            <i data-lucide="check-square" class="w-4 h-4 text-blue-500"></i> เช็คชื่อส่งงาน
          </button>
        </div>
        <div class="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div class="flex flex-col">
            <span>สั่ง: ${formatThaiDate(task.assignedDate)}</span>
            <span class="font-medium text-slate-700">กำหนด: ${formatThaiDate(task.dueDate)}</span>
          </div>
          <div class="flex items-center gap-1 opacity-100 sm:opacity-80 group-hover:opacity-100 transition-opacity">
            <button onclick="editTask('${task.id}')" class="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-blue-600" title="แก้ไข"><i data-lucide="pencil" class="w-4 h-4"></i></button>
            <button onclick="deleteTask('${task.id}')" class="p-1.5 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600" title="ลบ"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
          </div>
        </div>
      </div>
    `;
  });
  html += `</div>`;
  container.innerHTML = html;
}

function renderTableView(tasks, container) {
  let html = `
    <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm text-slate-600">
          <thead class="bg-slate-50 text-xs uppercase text-slate-500 border-b border-slate-200">
            <tr>
              <th scope="col" class="px-4 py-3.5">วิชา / ครูผู้สอน</th>
              <th scope="col" class="px-4 py-3.5">ชื่องาน</th>
              <th scope="col" class="px-4 py-3.5 text-center">ส่งแล้ว</th>
              <th scope="col" class="px-4 py-3.5 text-center">กำหนดส่ง</th>
              <th scope="col" class="px-4 py-3.5 text-center">จัดการ</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
  `;
  tasks.forEach(task => {
    const prog = getTaskProgress(task);
    const dueStatus = getDueStatus(task.dueDate, prog.percent);
    const colorTheme = getSubjectColorClass(task.color);

    html += `
      <tr class="hover:bg-slate-50/70 transition-colors">
        <td class="px-4 py-3">
          <span class="inline-block px-2 py-0.5 rounded text-xs font-medium ${colorTheme.badge} mb-0.5">${task.subjectName}</span>
          ${task.teacher ? `<div class="text-[11px] text-slate-400">${task.teacher}</div>` : ''}
        </td>
        <td class="px-4 py-3">
          <div class="font-medium text-slate-800">${task.title}</div>
          ${task.isGroup ? `<span class="inline-flex items-center gap-1 text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded mt-1"><i data-lucide="users" class="w-3 h-3"></i> งานกลุ่ม</span>` : ''}
        </td>
        <td class="px-4 py-3 text-center">
          <div class="flex items-center justify-center gap-2">
            <span class="text-xs font-medium">${prog.text}</span>
            <button onclick="openChecklistModal('${task.id}')" class="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded text-xs font-medium transition-colors">เช็ค</button>
          </div>
        </td>
        <td class="px-4 py-3 text-center whitespace-nowrap">
          <div class="text-xs font-medium text-slate-700">${formatThaiDate(task.dueDate)}</div>
          <span class="inline-block px-2 py-0.5 text-[10px] rounded-full border mt-1 ${dueStatus.colorClass}">${dueStatus.text}</span>
        </td>
        <td class="px-4 py-3 text-center whitespace-nowrap">
          <button onclick="editTask('${task.id}')" class="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-blue-600"><i data-lucide="pencil" class="w-4 h-4"></i></button>
          <button onclick="deleteTask('${task.id}')" class="p-1 hover:bg-rose-50 rounded text-slate-400 hover:text-rose-600"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
        </td>
      </tr>
    `;
  });
  html += `</tbody></table></div></div>`;
  container.innerHTML = html;
}

/* ==========================================================================
   Task Form (Add / Edit)
   ========================================================================== */

function openAddTaskModal() {
  document.getElementById('modal-task-title-header').textContent = 'เพิ่มการบ้านใหม่';
  document.getElementById('task-id-input').value = '';
  document.getElementById('task-form').reset();
  document.getElementById('task-assigned-date').value = new Date().toISOString().split('T')[0];
  populateSubjectSuggestions();
  document.getElementById('task-modal').classList.remove('hidden');
  document.getElementById('task-modal').classList.add('flex');
}

function editTask(taskId) {
  const task = appData.tasks.find(t => t.id === taskId);
  if (!task) return;
  document.getElementById('modal-task-title-header').textContent = 'แก้ไขการบ้าน';
  document.getElementById('task-id-input').value = task.id;
  document.getElementById('task-subject-name').value = task.subjectName || '';
  document.getElementById('task-subject-code').value = task.subjectCode || '';
  document.getElementById('task-teacher').value = task.teacher || '';
  document.getElementById('task-title').value = task.title || '';
  document.getElementById('task-is-group').checked = !!task.isGroup;
  document.getElementById('task-assigned-date').value = task.assignedDate || '';
  document.getElementById('task-due-date').value = task.dueDate || '';
  document.getElementById('task-notes').value = task.notes || '';
  document.getElementById('task-color').value = task.color || 'blue';
  
  populateSubjectSuggestions();
  document.getElementById('task-modal').classList.remove('hidden');
  document.getElementById('task-modal').classList.add('flex');
}

function closeTaskModal() {
  document.getElementById('task-modal').classList.add('hidden');
  document.getElementById('task-modal').classList.remove('flex');
}

function populateSubjectSuggestions() {
  const roomTasks = appData.tasks.filter(t => t.roomId === currentRoomId);
  const subjects = [...new Set(roomTasks.map(t => t.subjectName))];
  const teachers = [...new Set(roomTasks.map(t => t.teacher).filter(Boolean))];
  document.getElementById('existing-subjects-list').innerHTML = subjects.map(s => `<option value="${s}">`).join('');
  document.getElementById('existing-teachers-list').innerHTML = teachers.map(t => `<option value="${t}">`).join('');
}

function handleTaskFormSubmit(e) {
  e.preventDefault();
  const id = document.getElementById('task-id-input').value;
  const taskData = {
    subjectName: document.getElementById('task-subject-name').value.trim(),
    subjectCode: document.getElementById('task-subject-code').value.trim(),
    teacher: document.getElementById('task-teacher').value.trim(),
    title: document.getElementById('task-title').value.trim(),
    isGroup: document.getElementById('task-is-group').checked,
    assignedDate: document.getElementById('task-assigned-date').value,
    dueDate: document.getElementById('task-due-date').value,
    notes: document.getElementById('task-notes').value.trim(),
    color: document.getElementById('task-color').value || 'blue'
  };

  if (!taskData.subjectName || !taskData.title) { showToast('กรุณากรอกชื่อวิชาและชื่องาน', 'error'); return; }

  if (id) {
    const index = appData.tasks.findIndex(t => t.id === id);
    if (index !== -1) {
      appData.tasks[index] = { ...appData.tasks[index], ...taskData };
      // if type changed (e.g. single -> group), we might want to clear completions, but let's keep it simple
      showToast('แก้ไขข้อมูลการบ้านเรียบร้อย');
    }
  } else {
    appData.tasks.unshift({
      id: 'task-' + Date.now(),
      roomId: currentRoomId,
      completions: [],
      ...taskData
    });
    showToast('เพิ่มการบ้านใหม่เรียบร้อยแล้ว');
  }

  saveData();
  closeTaskModal();
  refreshDashboard();
}

function deleteTask(taskId) {
  const task = appData.tasks.find(t => t.id === taskId);
  if (!task) return;
  if (confirm(`คุณต้องการลบการบ้าน "${task.title}" ใช่หรือไม่?`)) {
    appData.tasks = appData.tasks.filter(t => t.id !== taskId);
    saveData();
    refreshDashboard();
    showToast('ลบการบ้านเรียบร้อยแล้ว');
  }
}

/* ==========================================================================
   Checklist (Task Submissions) Modal
   ========================================================================== */

let currentChecklistTaskId = null;

function openChecklistModal(taskId) {
  const task = appData.tasks.find(t => t.id === taskId);
  if (!task) return;
  currentChecklistTaskId = taskId;
  if (!task.completions) task.completions = [];

  const room = appData.rooms[currentRoomId];
  document.getElementById('checklist-task-title').textContent = task.title;
  
  const listContainer = document.getElementById('checklist-container');
  const roster = task.isGroup ? room.groups : room.students;
  
  if (roster.length === 0) {
    listContainer.innerHTML = `<div class="p-6 text-center text-slate-500 text-sm">ไม่มีข้อมูล${task.isGroup ? 'กลุ่ม' : 'นักเรียน'}<br>ไปที่ "จัดการสมาชิก" เพื่อเพิ่มรายชื่อก่อนครับ</div>`;
  } else {
    let html = '';
    roster.forEach(name => {
      const isChecked = task.completions.includes(name);
      html += `
        <label class="flex items-center gap-3 p-3 hover:bg-slate-50 border-b border-slate-100 cursor-pointer transition-colors">
          <input type="checkbox" class="roster-checkbox" value="${name}" ${isChecked ? 'checked' : ''} onchange="toggleStudentCompletion(this.value, this.checked)">
          <span class="text-sm font-medium ${isChecked ? 'task-completed-text' : 'text-slate-800'}">${name}</span>
        </label>
      `;
    });
    listContainer.innerHTML = html;
  }
  
  updateChecklistSummary();
  document.getElementById('checklist-modal').classList.remove('hidden');
  document.getElementById('checklist-modal').classList.add('flex');
}

function closeChecklistModal() {
  document.getElementById('checklist-modal').classList.add('hidden');
  document.getElementById('checklist-modal').classList.remove('flex');
  currentChecklistTaskId = null;
  saveData();
  refreshDashboard();
}

function toggleStudentCompletion(name, isChecked) {
  const task = appData.tasks.find(t => t.id === currentChecklistTaskId);
  if (!task) return;
  
  if (isChecked) {
    if (!task.completions.includes(name)) task.completions.push(name);
  } else {
    task.completions = task.completions.filter(n => n !== name);
  }
  
  // Re-render label style immediately
  const labels = document.getElementById('checklist-container').querySelectorAll('label');
  labels.forEach(lbl => {
    const cb = lbl.querySelector('input');
    const span = lbl.querySelector('span');
    if (cb.value === name) {
      if (isChecked) span.classList.add('task-completed-text', 'text-slate-800');
      else { span.classList.remove('task-completed-text'); span.classList.add('text-slate-800'); }
    }
  });

  updateChecklistSummary(task);
  
  const room = appData.rooms[currentRoomId];
  const total = task.isGroup ? room.groups.length : room.students.length;
  if (isChecked && task.completions.length === total && total > 0) {
    triggerConfetti();
  }
}

function updateChecklistSummary() {
  const task = appData.tasks.find(t => t.id === currentChecklistTaskId);
  const room = appData.rooms[currentRoomId];
  const total = task.isGroup ? room.groups.length : room.students.length;
  const completed = task.completions.length;
  document.getElementById('checklist-summary').textContent = `ส่งแล้ว ${completed} / ${total}`;
}

/* ==========================================================================
   Member Management (Students & Groups)
   ========================================================================== */

function openMembersModal() {
  document.getElementById('members-modal').classList.remove('hidden');
  document.getElementById('members-modal').classList.add('flex');
  switchMemberTab('students');
}

function closeMembersModal() {
  document.getElementById('members-modal').classList.add('hidden');
  document.getElementById('members-modal').classList.remove('flex');
  refreshDashboard(); // Refresh to update possible progress bars
}

function switchMemberTab(tab) {
  const btnSt = document.getElementById('tab-btn-students');
  const btnGr = document.getElementById('tab-btn-groups');
  const divSt = document.getElementById('tab-content-students');
  const divGr = document.getElementById('tab-content-groups');
  
  if (tab === 'students') {
    btnSt.classList.add('bg-blue-600', 'text-white'); btnSt.classList.remove('bg-slate-100', 'text-slate-600');
    btnGr.classList.add('bg-slate-100', 'text-slate-600'); btnGr.classList.remove('bg-blue-600', 'text-white');
    divSt.classList.remove('hidden'); divGr.classList.add('hidden');
    renderMemberList('students');
  } else {
    btnGr.classList.add('bg-blue-600', 'text-white'); btnGr.classList.remove('bg-slate-100', 'text-slate-600');
    btnSt.classList.add('bg-slate-100', 'text-slate-600'); btnSt.classList.remove('bg-blue-600', 'text-white');
    divGr.classList.remove('hidden'); divSt.classList.add('hidden');
    renderMemberList('groups');
  }
}

function renderMemberList(type) {
  const room = appData.rooms[currentRoomId];
  const list = type === 'students' ? room.students : room.groups;
  const container = document.getElementById(type === 'students' ? 'students-list' : 'groups-list');
  
  if (list.length === 0) {
    container.innerHTML = `<div class="text-sm text-slate-400 p-4 text-center">ยังไม่มีข้อมูล</div>`;
    return;
  }
  
  let html = '';
  list.forEach((name, index) => {
    html += `
      <div class="flex items-center justify-between p-2 hover:bg-slate-50 border-b border-slate-100 last:border-0">
        <span class="text-sm text-slate-800">${index + 1}. ${name}</span>
        <button onclick="removeMember('${type}', '${name}')" class="text-rose-500 hover:text-rose-700 p-1">
          <i data-lucide="trash-2" class="w-4 h-4"></i>
        </button>
      </div>
    `;
  });
  container.innerHTML = html;
  if (window.lucide) lucide.createIcons();
}

function addMember(type) {
  const inputEl = document.getElementById(type === 'students' ? 'new-student-input' : 'new-group-input');
  const name = inputEl.value.trim();
  if (!name) return;
  
  const room = appData.rooms[currentRoomId];
  const list = type === 'students' ? room.students : room.groups;
  
  if (list.includes(name)) {
    showToast('มีชื่อนี้อยู่ในระบบแล้ว', 'error');
    return;
  }
  
  list.push(name);
  inputEl.value = '';
  saveData();
  renderMemberList(type);
}

function addMultipleStudents() {
  const input = prompt('วางรายชื่อนักเรียน (คั่นด้วยบรรทัดใหม่หรือจุลภาค)');
  if (!input) return;
  
  const names = input.split(/[\n,]+/).map(n => n.trim()).filter(n => n);
  const room = appData.rooms[currentRoomId];
  
  let added = 0;
  names.forEach(name => {
    if (!room.students.includes(name)) {
      room.students.push(name);
      added++;
    }
  });
  
  if (added > 0) {
    saveData();
    renderMemberList('students');
    showToast(`เพิ่มรายชื่อ ${added} คน เรียบร้อย`);
  }
}

function removeMember(type, name) {
  if (!confirm(`ลบ "${name}" ออกจากห้อง?`)) return;
  const room = appData.rooms[currentRoomId];
  if (type === 'students') {
    room.students = room.students.filter(n => n !== name);
  } else {
    room.groups = room.groups.filter(n => n !== name);
  }
  saveData();
  renderMemberList(type);
}

/* ==========================================================================
   Data Export / Import
   ========================================================================== */

function exportData() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(appData, null, 2));
  const a = document.createElement('a');
  a.setAttribute("href", dataStr);
  a.setAttribute("download", `homework_backup_${new Date().toISOString().slice(0,10)}.json`);
  document.body.appendChild(a);
  a.click();
  a.remove();
  showToast('ส่งออกไฟล์สำรองข้อมูลสำเร็จ');
}

function importData(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (imported && imported.rooms) {
        appData = imported;
        saveData();
        currentRoomId = null;
        initApp();
        showToast('นำเข้าข้อมูลเรียบร้อยแล้ว!');
      } else {
        showToast('รูปแบบไฟล์ไม่ถูกต้อง', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('ไม่สามารถอ่านไฟล์ JSON ได้', 'error');
    }
  };
  reader.readAsText(file);
}

function resetToDefault() {
  if (confirm('คุณต้องการรีเซ็ตข้อมูลทั้งหมดกลับเป็นค่าเริ่มต้นใช่หรือไม่? (ข้อมูลที่เพิ่มใหม่จะหายไป)')) {
    localStorage.removeItem(STORAGE_KEY);
    currentRoomId = null;
    initApp();
    showToast('คืนค่าข้อมูลเริ่มต้นเรียบร้อยแล้ว');
  }
}

/* ==========================================================================
   Setup Event Listeners
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initApp();

  document.getElementById('search-input')?.addEventListener('input', e => { currentFilters.search = e.target.value; renderTasks(); });
  document.getElementById('sort-select')?.addEventListener('change', e => { currentFilters.sortBy = e.target.value; renderTasks(); });
  document.getElementById('task-form')?.addEventListener('submit', handleTaskFormSubmit);
  document.getElementById('pin-form')?.addEventListener('submit', handlePinSubmit);
  document.getElementById('create-room-form')?.addEventListener('submit', handleCreateRoomSubmit);
  
  // Enter keys for add members
  document.getElementById('new-student-input')?.addEventListener('keypress', e => { if (e.key === 'Enter') addMember('students'); });
  document.getElementById('new-group-input')?.addEventListener('keypress', e => { if (e.key === 'Enter') addMember('groups'); });

  document.getElementById('import-file-input')?.addEventListener('change', e => {
    if (e.target.files && e.target.files[0]) { importData(e.target.files[0]); e.target.value = ''; }
  });
});
