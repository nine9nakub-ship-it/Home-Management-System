/**
 * ระบบจัดการการบ้าน ม.4/10 โรงเรียนบรรหารแจ่มใสวิทยา 3
 * Application Logic & LocalStorage Management
 */

const STORAGE_KEY = 'banharn10_homework_tracker_v1';

// ข้อมูลเริ่มต้นตามข้อมูลห้อง ม.4/10
const DEFAULT_DATA = {
  schoolName: 'โรงเรียนบรรหารแจ่มใสวิทยา 3',
  roomName: 'ม.4/10',
  currentGrade: 'มัธยมศึกษาปีที่ 4 (ภาคเรียนที่ 1)',
  availableGrades: [
    'มัธยมศึกษาปีที่ 4 (ภาคเรียนที่ 1)',
    'มัธยมศึกษาปีที่ 4 (ภาคเรียนที่ 2)',
    'มัธยมศึกษาปีที่ 5 (ภาคเรียนที่ 1)',
    'มัธยมศึกษาปีที่ 5 (ภาคเรียนที่ 2)',
    'มัธยมศึกษาปีที่ 6 (ภาคเรียนที่ 1)',
    'มัธยมศึกษาปีที่ 6 (ภาคเรียนที่ 2)'
  ],
  announcement: {
    text: 'งานกีฬาสีสัปดาห์หน้า งดสั่งการบ้านวิชาพลศึกษาและศิลปะ!',
    active: true
  },
  tasks: [
    {
      id: 'task-1',
      grade: 'มัธยมศึกษาปีที่ 4 (ภาคเรียนที่ 1)',
      subjectCode: 'ค31201',
      subjectName: 'คณิตศาสตร์เพิ่มเติม',
      teacher: 'ครูสมชาย ใจดี',
      title: 'แบบฝึกหัด 1.1 เรื่องเซต (หน้า 15)',
      isGroup: false,
      assignedDate: '2024-05-12',
      dueDate: '2024-05-15',
      completed: true,
      notes: 'ส่งในคาบเรียน',
      color: 'blue'
    },
    {
      id: 'task-2',
      grade: 'มัธยมศึกษาปีที่ 4 (ภาคเรียนที่ 1)',
      subjectCode: 'ค31201',
      subjectName: 'คณิตศาสตร์เพิ่มเติม',
      teacher: 'ครูสมชาย ใจดี',
      title: 'โครงงานคณิตศาสตร์ (งานกลุ่ม)',
      isGroup: true,
      assignedDate: '2024-05-20',
      dueDate: '2024-06-30',
      completed: false,
      notes: 'กลุ่มละ 5 คน ทำรูปเล่ม',
      color: 'blue'
    },
    {
      id: 'task-3',
      grade: 'มัธยมศึกษาปีที่ 4 (ภาคเรียนที่ 1)',
      subjectCode: 'ค31201',
      subjectName: 'คณิตศาสตร์เพิ่มเติม',
      teacher: 'ครูสมชาย ใจดี',
      title: 'ชีทสรุปตรรกศาสตร์',
      isGroup: false,
      assignedDate: '2024-06-01',
      dueDate: '2024-06-05',
      completed: false,
      notes: 'ถ่ายรูปลง Google Classroom',
      color: 'blue'
    },
    {
      id: 'task-4',
      grade: 'มัธยมศึกษาปีที่ 4 (ภาคเรียนที่ 1)',
      subjectCode: 'ว31102',
      subjectName: 'วิทยาศาสตร์กายภาพ (เคมี)',
      teacher: 'ครูสมหญิง รักเรียน',
      title: 'ใบงานที่ 1 โครงสร้างอะตอม',
      isGroup: false,
      assignedDate: '2024-05-25',
      dueDate: '2024-05-28',
      completed: true,
      notes: 'ส่งที่โต๊ะครูหมวดวิทย์',
      color: 'emerald'
    },
    {
      id: 'task-5',
      grade: 'มัธยมศึกษาปีที่ 4 (ภาคเรียนที่ 1)',
      subjectCode: 'ว31102',
      subjectName: 'วิทยาศาสตร์กายภาพ (เคมี)',
      teacher: 'ครูสมหญิง รักเรียน',
      title: 'สรุปผลการทดลองเรื่องสารละลาย',
      isGroup: false,
      assignedDate: '2024-06-02',
      dueDate: '2024-06-09',
      completed: false,
      notes: 'เขียนลงสมุดกราฟ',
      color: 'emerald'
    },
    {
      id: 'task-6',
      grade: 'มัธยมศึกษาปีที่ 4 (ภาคเรียนที่ 1)',
      subjectCode: 'อ31101',
      subjectName: 'ภาษาอังกฤษพื้นฐาน',
      teacher: 'T. John Smith',
      title: 'อัดคลิปวิดีโอแนะนำตัว (Pair Work)',
      isGroup: true,
      assignedDate: '2024-06-01',
      dueDate: '2024-06-15',
      completed: false,
      notes: 'ความยาว 3 นาที อัปโหลดลง YouTube',
      color: 'purple'
    },
    {
      id: 'task-7',
      grade: 'มัธยมศึกษาปีที่ 4 (ภาคเรียนที่ 1)',
      subjectCode: 'อ31101',
      subjectName: 'ภาษาอังกฤษพื้นฐาน',
      teacher: 'T. John Smith',
      title: 'Worksheet: Present Perfect',
      isGroup: false,
      assignedDate: '2024-06-05',
      dueDate: '2024-06-08',
      completed: false,
      notes: 'ปริ้นท์ทำหรือเขียนใส่ iPad',
      color: 'purple'
    }
  ]
};

// Application State
let appData = null;
let currentFilters = {
  subject: 'all',
  status: 'all', // 'all', 'pending', 'completed', 'group'
  search: '',
  sortBy: 'due-asc',
  viewMode: 'card' // 'card' or 'table'
};

// Palette วิชา
const SUBJECT_COLORS = ['blue', 'emerald', 'purple', 'amber', 'rose', 'cyan', 'indigo', 'orange'];

// เดือนภาษาไทย
const THAI_MONTHS_SHORT = [
  'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
  'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
];

// Helper: แปลงวันที่ YYYY-MM-DD เป็น วัน เดือน พ.ศ. (เช่น 15 พ.ค. 67)
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

// Helper: คำนวณสถานะกำหนดส่ง
function getDueStatus(dueDateStr, isCompleted) {
  if (isCompleted) {
    return {
      text: 'ส่งแล้ว',
      colorClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      type: 'completed'
    };
  }
  
  if (!dueDateStr) {
    return {
      text: 'ไม่ระบุ',
      colorClass: 'bg-slate-100 text-slate-700 border-slate-300',
      type: 'none'
    };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = new Date(dueDateStr);
  due.setHours(0, 0, 0, 0);

  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      text: `เลยกำหนด ${Math.abs(diffDays)} วัน`,
      colorClass: 'bg-rose-100 text-rose-800 border-rose-300 font-semibold',
      type: 'overdue'
    };
  } else if (diffDays === 0) {
    return {
      text: 'ส่งวันนี้!',
      colorClass: 'bg-amber-500 text-white font-bold urgent-badge',
      type: 'today'
    };
  } else if (diffDays === 1) {
    return {
      text: 'ส่งพรุ่งนี้',
      colorClass: 'bg-amber-100 text-amber-800 border-amber-300 font-medium',
      type: 'tomorrow'
    };
  } else if (diffDays <= 3) {
    return {
      text: `เหลืออีก ${diffDays} วัน`,
      colorClass: 'bg-orange-100 text-orange-800 border-orange-300',
      type: 'near'
    };
  } else {
    return {
      text: `เหลืออีก ${diffDays} วัน`,
      colorClass: 'bg-blue-50 text-blue-700 border-blue-200',
      type: 'normal'
    };
  }
}

// โหลดข้อมูลจาก LocalStorage
function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      appData = JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error reading localStorage:', e);
  }

  if (!appData || !Array.isArray(appData.tasks)) {
    appData = JSON.parse(JSON.stringify(DEFAULT_DATA));
    saveData();
  }
}

// บันทึกข้อมูลลง LocalStorage
function saveData() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
  } catch (e) {
    console.error('Error saving to localStorage:', e);
    showToast('เกิดข้อผิดพลาดในการบันทึกข้อมูล', 'error');
  }
}

// แสดงแจ้งเตือน Toast สั้นๆ
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  const bg = type === 'success' ? 'bg-slate-900 text-white' : (type === 'error' ? 'bg-rose-600 text-white' : 'bg-blue-600 text-white');
  
  toast.className = `flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-lg ${bg} text-sm transition-all duration-300 transform translate-y-2 opacity-0`;
  toast.innerHTML = `
    <span>${type === 'success' ? '✓' : (type === 'error' ? '✕' : 'ℹ')}</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-2', 'opacity-0');
  });

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => toast.remove(), 300);
  }, 2600);
}

// ดึงสีตามวิชา
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

// อัปเดตสถิติ Dashboard
function updateDashboardStats() {
  const currentGradeTasks = appData.tasks.filter(t => t.grade === appData.currentGrade);
  const total = currentGradeTasks.length;
  const completed = currentGradeTasks.filter(t => t.completed).length;
  const pending = total - completed;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  // งานด่วน (ยังไม่เสร็จ และเลยกำหนด หรือส่งภายใน 3 วัน)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const urgentCount = currentGradeTasks.filter(t => {
    if (t.completed || !t.dueDate) return false;
    const due = new Date(t.dueDate);
    due.setHours(0, 0, 0, 0);
    const diffDays = Math.round((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 3;
  }).length;

  document.getElementById('stat-total').textContent = total;
  document.getElementById('stat-completed').textContent = completed;
  document.getElementById('stat-pending').textContent = pending;
  document.getElementById('stat-urgent').textContent = urgentCount;
  
  const progressBar = document.getElementById('stat-progress-bar');
  if (progressBar) {
    progressBar.style.width = `${percentage}%`;
  }
  const progressText = document.getElementById('stat-progress-text');
  if (progressText) {
    progressText.textContent = `${percentage}%`;
  }
}

// Render ตัวเลือกวิชา (Subject Filters)
function renderSubjectFilters() {
  const currentGradeTasks = appData.tasks.filter(t => t.grade === appData.currentGrade);
  const uniqueSubjects = [];
  const subjectMap = new Set();

  currentGradeTasks.forEach(t => {
    const key = `${t.subjectCode || ''}_${t.subjectName}`;
    if (!subjectMap.has(key)) {
      subjectMap.add(key);
      uniqueSubjects.push({
        code: t.subjectCode,
        name: t.subjectName,
        color: t.color
      });
    }
  });

  const container = document.getElementById('subject-filter-container');
  if (!container) return;

  let html = `
    <button onclick="setSubjectFilter('all')" 
      class="px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
        currentFilters.subject === 'all' 
          ? 'bg-blue-600 text-white shadow-sm' 
          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
      }">
      ทุกวิชา (${currentGradeTasks.length})
    </button>
  `;

  uniqueSubjects.forEach(sub => {
    const isSelected = currentFilters.subject === sub.name;
    const count = currentGradeTasks.filter(t => t.subjectName === sub.name).length;
    html += `
      <button onclick="setSubjectFilter('${sub.name.replace(/'/g, "\\'")}')" 
        class="px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
          isSelected 
            ? 'bg-blue-600 text-white shadow-sm' 
            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
        }">
        ${sub.name} (${count})
      </button>
    `;
  });

  container.innerHTML = html;
}

// กรองและเรียงลำดับการบ้าน
function getFilteredTasks() {
  let tasks = appData.tasks.filter(t => t.grade === appData.currentGrade);

  // กรองตามวิชา
  if (currentFilters.subject !== 'all') {
    tasks = tasks.filter(t => t.subjectName === currentFilters.subject);
  }

  // กรองตามสถานะ
  if (currentFilters.status === 'pending') {
    tasks = tasks.filter(t => !t.completed);
  } else if (currentFilters.status === 'completed') {
    tasks = tasks.filter(t => t.completed);
  } else if (currentFilters.status === 'group') {
    tasks = tasks.filter(t => t.isGroup);
  }

  // ค้นหาข้อความ
  if (currentFilters.search.trim()) {
    const q = currentFilters.search.trim().toLowerCase();
    tasks = tasks.filter(t => 
      t.title.toLowerCase().includes(q) ||
      t.subjectName.toLowerCase().includes(q) ||
      (t.subjectCode && t.subjectCode.toLowerCase().includes(q)) ||
      (t.teacher && t.teacher.toLowerCase().includes(q)) ||
      (t.notes && t.notes.toLowerCase().includes(q))
    );
  }

  // การเรียงลำดับ
  tasks.sort((a, b) => {
    if (currentFilters.sortBy === 'due-asc') {
      return (a.dueDate || '9999') > (b.dueDate || '9999') ? 1 : -1;
    } else if (currentFilters.sortBy === 'due-desc') {
      return (a.dueDate || '') < (b.dueDate || '') ? 1 : -1;
    } else if (currentFilters.sortBy === 'assigned-desc') {
      return (a.assignedDate || '') < (b.assignedDate || '') ? 1 : -1;
    } else if (currentFilters.sortBy === 'subject') {
      return a.subjectName.localeCompare(b.subjectName, 'th');
    }
    return 0;
  });

  return tasks;
}

// แสดงการ์ดรายการการบ้าน
function renderTasks() {
  const container = document.getElementById('tasks-container');
  if (!container) return;

  const tasks = getFilteredTasks();

  if (tasks.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-16 text-center bg-white rounded-2xl border border-dashed border-slate-200 p-8">
        <div class="w-16 h-16 mx-auto mb-4 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center">
          <i data-lucide="inbox" class="w-8 h-8"></i>
        </div>
        <h4 class="text-base font-medium text-slate-700 mb-1">ไม่พบรายการการบ้าน</h4>
        <p class="text-sm text-slate-400 mb-4">ลองปรับตัวกรอง หรือกดปุ่ม "เพิ่มการบ้านใหม่" เพื่อสร้างรายการ</p>
        <button onclick="openAddTaskModal()" class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-all shadow-sm">
          <i data-lucide="plus" class="w-4 h-4"></i> เพิ่มการบ้าน
        </button>
      </div>
    `;
    if (window.lucide) lucide.createIcons();
    return;
  }

  if (currentFilters.viewMode === 'table') {
    renderTableView(tasks, container);
  } else {
    renderCardView(tasks, container);
  }

  if (window.lucide) lucide.createIcons();
}

// Render Card View
function renderCardView(tasks, container) {
  let html = `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">`;

  tasks.forEach(task => {
    const dueStatus = getDueStatus(task.dueDate, task.completed);
    const colorTheme = getSubjectColorClass(task.color);

    html += `
      <div class="group bg-white rounded-2xl p-5 border ${task.completed ? 'border-slate-200 bg-slate-50/50' : 'border-slate-200/80 shadow-sm hover:shadow-md'} transition-all-custom flex flex-col justify-between">
        <div>
          <!-- Header Card: วิชา & Badge -->
          <div class="flex items-start justify-between gap-2 mb-3">
            <div class="flex items-center gap-1.5 flex-wrap">
              <span class="px-2.5 py-1 rounded-lg text-xs font-medium ${colorTheme.badge}">
                ${task.subjectCode ? `${task.subjectCode} ` : ''}${task.subjectName}
              </span>
              ${task.isGroup ? `
                <span class="px-2 py-0.5 rounded-lg text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                  <i data-lucide="users" class="w-3 h-3"></i> งานกลุ่ม
                </span>
              ` : ''}
            </div>
            <span class="px-2.5 py-1 rounded-full text-xs border ${dueStatus.colorClass}">
              ${dueStatus.text}
            </span>
          </div>

          <!-- ชื่องาน & Checkbox -->
          <div class="flex items-start gap-3 mb-3">
            <button onclick="toggleTaskStatus('${task.id}')" 
              class="mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                task.completed 
                  ? 'bg-emerald-500 text-white shadow-sm hover:bg-emerald-600' 
                  : 'border-2 border-slate-300 hover:border-blue-500 bg-white'
              }" title="คลิกเพื่อเปลี่ยนสถานะ">
              ${task.completed ? '<i data-lucide="check" class="w-4 h-4"></i>' : ''}
            </button>
            <div class="flex-1">
              <h3 class="text-base font-semibold leading-snug ${task.completed ? 'task-completed-title' : 'text-slate-800'}">
                ${task.title}
              </h3>
              ${task.teacher ? `
                <p class="text-xs text-slate-500 mt-1 flex items-center gap-1">
                  <i data-lucide="user" class="w-3 h-3 text-slate-400"></i> ${task.teacher}
                </p>
              ` : ''}
            </div>
          </div>

          <!-- หมายเหตุ / วิธีส่ง -->
          ${task.notes ? `
            <div class="mb-4 bg-slate-50 rounded-xl p-2.5 text-xs text-slate-600 border border-slate-100 flex items-start gap-2">
              <i data-lucide="info" class="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0"></i>
              <span class="break-words">${task.notes}</span>
            </div>
          ` : ''}
        </div>

        <!-- Footer: วันที่ และปุ่มจัดการ -->
        <div class="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div class="flex flex-col">
            <span>สั่ง: ${formatThaiDate(task.assignedDate)}</span>
            <span class="font-medium ${task.completed ? 'text-slate-500' : 'text-slate-700'}">กำหนด: ${formatThaiDate(task.dueDate)}</span>
          </div>
          
          <div class="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
            <button onclick="editTask('${task.id}')" class="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-blue-600 transition-colors" title="แก้ไข">
              <i data-lucide="pencil" class="w-4 h-4"></i>
            </button>
            <button onclick="deleteTask('${task.id}')" class="p-1.5 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600 transition-colors" title="ลบ">
              <i data-lucide="trash-2" class="w-4 h-4"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  });

  html += `</div>`;
  container.innerHTML = html;
}

// Render Table View (เหมือนตารางใน README)
function renderTableView(tasks, container) {
  let html = `
    <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm text-slate-600">
          <thead class="bg-slate-50 text-xs uppercase text-slate-500 border-b border-slate-200">
            <tr>
              <th scope="col" class="px-4 py-3.5 text-center w-14">สถานะ</th>
              <th scope="col" class="px-4 py-3.5">วิชา / ครูผู้สอน</th>
              <th scope="col" class="px-4 py-3.5">ชื่องาน / รายละเอียด</th>
              <th scope="col" class="px-4 py-3.5 w-28 text-center">วันที่สั่ง</th>
              <th scope="col" class="px-4 py-3.5 w-32 text-center">กำหนดส่ง</th>
              <th scope="col" class="px-4 py-3.5">หมายเหตุ</th>
              <th scope="col" class="px-4 py-3.5 text-right w-20 no-print">จัดการ</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
  `;

  tasks.forEach(task => {
    const dueStatus = getDueStatus(task.dueDate, task.completed);
    const colorTheme = getSubjectColorClass(task.color);

    html += `
      <tr class="hover:bg-slate-50/70 transition-colors ${task.completed ? 'bg-slate-50/40' : ''}">
        <td class="px-4 py-3 text-center">
          <button onclick="toggleTaskStatus('${task.id}')" 
            class="w-6 h-6 mx-auto rounded-lg flex items-center justify-center transition-all ${
              task.completed 
                ? 'bg-emerald-500 text-white shadow-sm hover:bg-emerald-600' 
                : 'border-2 border-slate-300 hover:border-blue-500 bg-white'
            }" title="คลิกเพื่อเปลี่ยนสถานะ">
            ${task.completed ? '<i data-lucide="check" class="w-4 h-4"></i>' : ''}
          </button>
        </td>
        <td class="px-4 py-3">
          <span class="inline-block px-2 py-0.5 rounded text-xs font-medium ${colorTheme.badge} mb-0.5">
            ${task.subjectCode ? `${task.subjectCode} ` : ''}${task.subjectName}
          </span>
          ${task.teacher ? `<div class="text-xs text-slate-400">${task.teacher}</div>` : ''}
        </td>
        <td class="px-4 py-3">
          <div class="font-medium ${task.completed ? 'task-completed-title' : 'text-slate-800'}">
            ${task.title}
          </div>
          ${task.isGroup ? `
            <span class="inline-flex items-center gap-1 text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 mt-1">
              <i data-lucide="users" class="w-3 h-3"></i> งานกลุ่ม
            </span>
          ` : ''}
        </td>
        <td class="px-4 py-3 text-center text-xs text-slate-500 whitespace-nowrap">
          ${formatThaiDate(task.assignedDate)}
        </td>
        <td class="px-4 py-3 text-center whitespace-nowrap">
          <div class="text-xs font-medium text-slate-700">${formatThaiDate(task.dueDate)}</div>
          <span class="inline-block px-2 py-0.5 text-[11px] rounded-full border mt-1 ${dueStatus.colorClass}">
            ${dueStatus.text}
          </span>
        </td>
        <td class="px-4 py-3 text-xs text-slate-600 max-w-xs">
          ${task.notes || '-'}
        </td>
        <td class="px-4 py-3 text-right whitespace-nowrap no-print">
          <div class="flex items-center justify-end gap-1">
            <button onclick="editTask('${task.id}')" class="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-blue-600 transition-colors" title="แก้ไข">
              <i data-lucide="pencil" class="w-4 h-4"></i>
            </button>
            <button onclick="deleteTask('${task.id}')" class="p-1 hover:bg-rose-50 rounded text-slate-400 hover:text-rose-600 transition-colors" title="ลบ">
              <i data-lucide="trash-2" class="w-4 h-4"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  });

  html += `
          </tbody>
        </table>
      </div>
    </div>
  `;

  container.innerHTML = html;
}

// สลับสถานะงานเสร็จ / ยังไม่เสร็จ
function toggleTaskStatus(taskId) {
  const task = appData.tasks.find(t => t.id === taskId);
  if (!task) return;

  task.completed = !task.completed;
  saveData();
  updateDashboardStats();
  renderTasks();

  if (task.completed) {
    showToast(`เสร็จสิ้น: ${task.title}`);
    checkIfAllCompleted();
  } else {
    showToast(`เปลี่ยนเป็นยังไม่เสร็จ: ${task.title}`, 'info');
  }
}

// ตรวจสอบว่าทำงานเสร็จหมดทุกงานหรือยัง (ฉลอง Confetti)
function checkIfAllCompleted() {
  const currentGradeTasks = appData.tasks.filter(t => t.grade === appData.currentGrade);
  if (currentGradeTasks.length > 0 && currentGradeTasks.every(t => t.completed)) {
    triggerConfetti();
    showToast('🎉 เยี่ยมมาก! คุณทำการบ้านครบทุกวิชาแล้ว!', 'success');
  }
}

// Confetti Effect
function triggerConfetti() {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }
}

// ตั้งค่าตัวกรองวิชา
function setSubjectFilter(subName) {
  currentFilters.subject = subName;
  renderSubjectFilters();
  renderTasks();
}

// ตั้งค่าตัวกรองสถานะ
function setStatusFilter(status) {
  currentFilters.status = status;
  
  // อัปเดต UI ปุ่มสถานะ
  const buttons = document.querySelectorAll('.status-filter-btn');
  buttons.forEach(btn => {
    if (btn.dataset.status === status) {
      btn.className = 'status-filter-btn px-4 py-2 rounded-xl text-xs font-semibold bg-white text-blue-600 shadow-sm transition-all';
    } else {
      btn.className = 'status-filter-btn px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 transition-all';
    }
  });

  renderTasks();
}

// สลับมุมมอง Card / Table
function setViewMode(mode) {
  currentFilters.viewMode = mode;
  const cardBtn = document.getElementById('view-mode-card');
  const tableBtn = document.getElementById('view-mode-table');
  
  if (mode === 'card') {
    cardBtn.classList.add('bg-white', 'text-blue-600', 'shadow-sm');
    cardBtn.classList.remove('text-slate-500');
    tableBtn.classList.remove('bg-white', 'text-blue-600', 'shadow-sm');
    tableBtn.classList.add('text-slate-500');
  } else {
    tableBtn.classList.add('bg-white', 'text-blue-600', 'shadow-sm');
    tableBtn.classList.remove('text-slate-500');
    cardBtn.classList.remove('bg-white', 'text-blue-600', 'shadow-sm');
    cardBtn.classList.add('text-slate-500');
  }

  renderTasks();
}

// สลับระดับชั้นเรียน
function switchGrade(newGrade) {
  appData.currentGrade = newGrade;
  saveData();
  
  // Reset filters
  currentFilters.subject = 'all';
  
  document.getElementById('current-grade-display').textContent = newGrade;
  
  updateDashboardStats();
  renderSubjectFilters();
  renderTasks();
  showToast(`เปลี่ยนระดับชั้นเป็น: ${newGrade}`);
}

// เปิด Modal เพิ่มการบ้านใหม่
function openAddTaskModal() {
  document.getElementById('modal-task-title-header').textContent = 'เพิ่มการบ้านใหม่';
  document.getElementById('task-id-input').value = '';
  document.getElementById('task-form').reset();
  
  // ใส่วันที่สั่งเป็นวันนี้โดยอัตโนมัติ
  const todayStr = new Date().toISOString().split('T')[0];
  document.getElementById('task-assigned-date').value = todayStr;

  // Auto-fill existing subjects into datalist
  populateSubjectSuggestions();

  const modal = document.getElementById('task-modal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  document.getElementById('task-title').focus();
}

// เติมตัวเลือกรายวิชาใน Datalist
function populateSubjectSuggestions() {
  const currentGradeTasks = appData.tasks.filter(t => t.grade === appData.currentGrade);
  const subjects = [...new Set(currentGradeTasks.map(t => t.subjectName))];
  const teachers = [...new Set(currentGradeTasks.map(t => t.teacher).filter(Boolean))];

  const subList = document.getElementById('existing-subjects-list');
  if (subList) {
    subList.innerHTML = subjects.map(s => `<option value="${s}">`).join('');
  }

  const teacherList = document.getElementById('existing-teachers-list');
  if (teacherList) {
    teacherList.innerHTML = teachers.map(t => `<option value="${t}">`).join('');
  }
}

// แก้ไขการบ้าน
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

  const modal = document.getElementById('task-modal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

// ปิด Modal การบ้าน
function closeTaskModal() {
  const modal = document.getElementById('task-modal');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

// บันทึกฟอร์มการบ้าน (Add / Edit)
function handleTaskFormSubmit(e) {
  e.preventDefault();
  
  const id = document.getElementById('task-id-input').value;
  const subjectName = document.getElementById('task-subject-name').value.trim();
  const subjectCode = document.getElementById('task-subject-code').value.trim();
  const teacher = document.getElementById('task-teacher').value.trim();
  const title = document.getElementById('task-title').value.trim();
  const isGroup = document.getElementById('task-is-group').checked;
  const assignedDate = document.getElementById('task-assigned-date').value;
  const dueDate = document.getElementById('task-due-date').value;
  const notes = document.getElementById('task-notes').value.trim();
  const color = document.getElementById('task-color').value || 'blue';

  if (!subjectName || !title) {
    showToast('กรุณากรอกชื่อวิชาและชื่องาน', 'error');
    return;
  }

  if (id) {
    // Edit existing
    const index = appData.tasks.findIndex(t => t.id === id);
    if (index !== -1) {
      appData.tasks[index] = {
        ...appData.tasks[index],
        subjectName,
        subjectCode,
        teacher,
        title,
        isGroup,
        assignedDate,
        dueDate,
        notes,
        color
      };
      showToast('แก้ไขข้อมูลการบ้านเรียบร้อย');
    }
  } else {
    // Add new
    const newTask = {
      id: 'task-' + Date.now(),
      grade: appData.currentGrade,
      subjectName,
      subjectCode,
      teacher,
      title,
      isGroup,
      assignedDate,
      dueDate,
      completed: false,
      notes,
      color
    };
    appData.tasks.unshift(newTask);
    showToast('เพิ่มการบ้านใหม่เรียบร้อยแล้ว');
  }

  saveData();
  closeTaskModal();
  updateDashboardStats();
  renderSubjectFilters();
  renderTasks();
}

// ลบการบ้าน
function deleteTask(taskId) {
  const task = appData.tasks.find(t => t.id === taskId);
  if (!task) return;

  if (confirm(`คุณต้องการลบการบ้าน "${task.title}" ใช่หรือไม่?`)) {
    appData.tasks = appData.tasks.filter(t => t.id !== taskId);
    saveData();
    updateDashboardStats();
    renderSubjectFilters();
    renderTasks();
    showToast('ลบการบ้านเรียบร้อยแล้ว');
  }
}

// เปิด/ปิด ประกาศห้อง
function toggleAnnouncement() {
  appData.announcement.active = !appData.announcement.active;
  saveData();
  renderAnnouncement();
}

// แก้ไขประกาศห้อง
function editAnnouncement() {
  const current = appData.announcement.text;
  const updated = prompt('พิมพ์ข้อความประกาศห้องใหม่:', current);
  if (updated !== null && updated.trim()) {
    appData.announcement.text = updated.trim();
    appData.announcement.active = true;
    saveData();
    renderAnnouncement();
    showToast('อัปเดตประกาศห้องแล้ว');
  }
}

function renderAnnouncement() {
  const banner = document.getElementById('announcement-banner');
  const textEl = document.getElementById('announcement-text');
  if (!banner || !textEl) return;

  if (appData.announcement && appData.announcement.active && appData.announcement.text) {
    textEl.textContent = appData.announcement.text;
    banner.classList.remove('hidden');
  } else {
    banner.classList.add('hidden');
  }
}

// ส่งออกข้อมูลสำรอง (Backup JSON)
function exportData() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(appData, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `การบ้าน_${appData.roomName}_${new Date().toISOString().slice(0,10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  showToast('ส่งออกไฟล์สำรองข้อมูลสำเร็จ');
}

// นำเข้าข้อมูล (Import JSON)
function importData(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (imported && Array.isArray(imported.tasks)) {
        appData = imported;
        saveData();
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

// รีเซ็ตข้อมูลเป็นค่าเริ่มต้นของ ม.4/10
function resetToDefault() {
  if (confirm('คุณต้องการรีเซ็ตข้อมูลทั้งหมดกลับเป็นค่าเริ่มต้นของ ม.4/10 โรงเรียนบรรหารแจ่มใสวิทยา 3 ใช่หรือไม่? (ข้อมูลที่เพิ่มใหม่จะหายไป)')) {
    appData = JSON.parse(JSON.stringify(DEFAULT_DATA));
    saveData();
    initApp();
    showToast('คืนค่าข้อมูลเริ่มต้นเรียบร้อยแล้ว');
  }
}

// เพิ่มระดับชั้นเรียนใหม่
function addNewGradePrompt() {
  const newGrade = prompt('พิมพ์ชื่อระดับชั้น / ภาคเรียนใหม่ (เช่น มัธยมศึกษาปีที่ 5 (ภาคเรียนที่ 1)):');
  if (newGrade && newGrade.trim()) {
    const trimmed = newGrade.trim();
    if (!appData.availableGrades.includes(trimmed)) {
      appData.availableGrades.push(trimmed);
    }
    switchGrade(trimmed);
    renderGradeSelector();
  }
}

// Render ตัวเลือกระดับชั้นใน Dropdown
function renderGradeSelector() {
  const select = document.getElementById('grade-select');
  if (!select) return;

  select.innerHTML = appData.availableGrades.map(g => `
    <option value="${g}" ${g === appData.currentGrade ? 'selected' : ''}>${g}</option>
  `).join('') + `<option value="__NEW__">+ เพิ่มระดับชั้น / ภาคเรียนใหม่...</option>`;
}

// เริ่มต้นระบบเมื่อโหลดหน้าเว็บ
function initApp() {
  loadData();
  
  // Set school and room header
  document.getElementById('school-name-display').textContent = appData.schoolName;
  document.getElementById('room-name-display').textContent = appData.roomName;
  document.getElementById('current-grade-display').textContent = appData.currentGrade;

  renderAnnouncement();
  renderGradeSelector();
  updateDashboardStats();
  renderSubjectFilters();
  renderTasks();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  initApp();

  // Search Input Live Filter
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentFilters.search = e.target.value;
      renderTasks();
    });
  }

  // Sort By Select
  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentFilters.sortBy = e.target.value;
      renderTasks();
    });
  }

  // Grade Select Change
  const gradeSelect = document.getElementById('grade-select');
  if (gradeSelect) {
    gradeSelect.addEventListener('change', (e) => {
      if (e.target.value === '__NEW__') {
        addNewGradePrompt();
      } else {
        switchGrade(e.target.value);
      }
    });
  }

  // Task Form Submit
  const taskForm = document.getElementById('task-form');
  if (taskForm) {
    taskForm.addEventListener('submit', handleTaskFormSubmit);
  }

  // File Import Input
  const fileInput = document.getElementById('import-file-input');
  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        importData(e.target.files[0]);
        e.target.value = '';
      }
    });
  }
});
