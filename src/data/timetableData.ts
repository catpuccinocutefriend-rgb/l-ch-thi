import { TimeSlot, TimetableCell, SubjectMeta, Exam } from '../types';

export const MORNING_SLOTS: TimeSlot[] = [
  {
    period: 1,
    session: 'morning',
    startTime: '07:00',
    endTime: '07:45',
    breakDurationMinutes: 5,
    breakDescription: 'Nghỉ giải lao 5 phút',
  },
  {
    period: 2,
    session: 'morning',
    startTime: '07:50',
    endTime: '08:35',
    breakDurationMinutes: 20,
    breakDescription: 'Ra chơi lớn giải lao 20 phút (hồi sức)',
  },
  {
    period: 3,
    session: 'morning',
    startTime: '08:55',
    endTime: '09:40',
    breakDurationMinutes: 5,
    breakDescription: 'Nghỉ giải lao 5 phút',
  },
  {
    period: 4,
    session: 'morning',
    startTime: '09:45',
    endTime: '10:30',
    breakDurationMinutes: 5,
    breakDescription: 'Nghỉ giải lao 5 phút',
  },
  {
    period: 5,
    session: 'morning',
    startTime: '10:35',
    endTime: '11:20',
    breakDurationMinutes: 0,
    breakDescription: 'Kết thúc buổi sáng',
  },
];

export const AFTERNOON_SLOTS: TimeSlot[] = [
  {
    period: 1,
    session: 'afternoon',
    startTime: '13:30',
    endTime: '14:15',
    breakDurationMinutes: 5,
    breakDescription: 'Nghỉ giải lao 5 phút',
  },
  {
    period: 2,
    session: 'afternoon',
    startTime: '14:20',
    endTime: '15:05',
    breakDurationMinutes: 20,
    breakDescription: 'Ra chơi lớn giải lao 20 phút (hồi sức)',
  },
  {
    period: 3,
    session: 'afternoon',
    startTime: '15:25',
    endTime: '16:10',
    breakDurationMinutes: 5,
    breakDescription: 'Nghỉ giải lao 5 phút',
  },
  {
    period: 4,
    session: 'afternoon',
    startTime: '16:15',
    endTime: '17:00',
    breakDurationMinutes: 0,
    breakDescription: 'Kết thúc buổi chiều',
  },
];

export const SUBJECT_METAS: Record<string, SubjectMeta> = {
  TOAN: {
    code: 'TOAN',
    name: 'Toán học',
    defaultTeacher: 'Cô Quyên',
    category: 'core',
    color: {
      bg: 'bg-blue-50/70',
      text: 'text-blue-900',
      border: 'border-blue-200',
      badgeBg: 'bg-blue-100',
      badgeText: 'text-blue-700',
    },
  },
  VAN: {
    code: 'VAN',
    name: 'Ngữ văn',
    defaultTeacher: 'Cô Bích',
    category: 'core',
    color: {
      bg: 'bg-rose-50/70',
      text: 'text-rose-900',
      border: 'border-rose-200',
      badgeBg: 'bg-rose-100',
      badgeText: 'text-rose-700',
    },
  },
  AV: {
    code: 'AV',
    name: 'Tiếng Anh',
    defaultTeacher: 'Cô Trang',
    category: 'core',
    color: {
      bg: 'bg-emerald-50/70',
      text: 'text-emerald-900',
      border: 'border-emerald-200',
      badgeBg: 'bg-emerald-100',
      badgeText: 'text-emerald-700',
    },
  },
  LY: {
    code: 'LY',
    name: 'Vật lý',
    defaultTeacher: 'Cô Nga',
    category: 'science',
    color: {
      bg: 'bg-sky-50/70',
      text: 'text-sky-900',
      border: 'border-sky-200',
      badgeBg: 'bg-sky-100',
      badgeText: 'text-sky-700',
    },
  },
  HOA: {
    code: 'HOA',
    name: 'Hóa học',
    defaultTeacher: 'Cô Hạnh H',
    category: 'science',
    color: {
      bg: 'bg-violet-50/70',
      text: 'text-violet-900',
      border: 'border-violet-200',
      badgeBg: 'bg-violet-100',
      badgeText: 'text-violet-700',
    },
  },
  SINH: {
    code: 'SINH',
    name: 'Sinh học',
    defaultTeacher: 'Thầy Lãm',
    category: 'science',
    color: {
      bg: 'bg-teal-50/70',
      text: 'text-teal-900',
      border: 'border-teal-200',
      badgeBg: 'bg-teal-100',
      badgeText: 'text-teal-700',
    },
  },
  SU: {
    code: 'SU',
    name: 'Lịch sử',
    defaultTeacher: 'Thầy Toàn',
    category: 'social',
    color: {
      bg: 'bg-amber-50/70',
      text: 'text-amber-900',
      border: 'border-amber-200',
      badgeBg: 'bg-amber-100',
      badgeText: 'text-amber-800',
    },
  },
  TH: {
    code: 'TH',
    name: 'Tin học',
    defaultTeacher: 'Thầy Chung',
    category: 'science',
    color: {
      bg: 'bg-cyan-50/70',
      text: 'text-cyan-900',
      border: 'border-cyan-200',
      badgeBg: 'bg-cyan-100',
      badgeText: 'text-cyan-800',
    },
  },
  GDQP: {
    code: 'GDQP',
    name: 'GD Quốc phòng & An ninh',
    defaultTeacher: 'Thầy L.Tùng',
    category: 'special',
    color: {
      bg: 'bg-lime-50/70',
      text: 'text-lime-900',
      border: 'border-lime-200',
      badgeBg: 'bg-lime-100',
      badgeText: 'text-lime-800',
    },
  },
  TNHN: {
    code: 'TNHN',
    name: 'Hoạt động Trải nghiệm - Hướng nghiệp',
    defaultTeacher: 'Cô Nga',
    category: 'general',
    color: {
      bg: 'bg-indigo-50/70',
      text: 'text-indigo-900',
      border: 'border-indigo-200',
      badgeBg: 'bg-indigo-100',
      badgeText: 'text-indigo-800',
    },
  },
  GDTD: {
    code: 'GDTD',
    name: 'Giáo dục Thể chất (Thể dục)',
    defaultTeacher: 'Thầy Gàng',
    category: 'special',
    color: {
      bg: 'bg-orange-50/70',
      text: 'text-orange-900',
      border: 'border-orange-200',
      badgeBg: 'bg-orange-100',
      badgeText: 'text-orange-800',
    },
  },
  'GDĐP': {
    code: 'GDĐP',
    name: 'Giáo dục Địa phương',
    defaultTeacher: 'Cô/Thầy Giàu',
    category: 'social',
    color: {
      bg: 'bg-fuchsia-50/70',
      text: 'text-fuchsia-900',
      border: 'border-fuchsia-200',
      badgeBg: 'bg-fuchsia-100',
      badgeText: 'text-fuchsia-800',
    },
  },
  'CHAO CO': {
    code: 'CHAO CO',
    name: 'Chào cờ đầu tuần',
    defaultTeacher: 'Toàn trường',
    category: 'general',
    color: {
      bg: 'bg-red-50/70',
      text: 'text-red-900',
      border: 'border-red-200',
      badgeBg: 'bg-red-100',
      badgeText: 'text-red-800',
    },
  },
  SHL: {
    code: 'SHL',
    name: 'Sinh hoạt lớp',
    defaultTeacher: 'Cô Hạnh H (CN)',
    category: 'general',
    color: {
      bg: 'bg-purple-50/70',
      text: 'text-purple-900',
      border: 'border-purple-200',
      badgeBg: 'bg-purple-100',
      badgeText: 'text-purple-800',
    },
  },
};

export function parseSubjectString(raw: string): { subjectCode: string; subjectName: string; teacher: string } {
  if (!raw || !raw.trim()) {
    return { subjectCode: '', subjectName: '', teacher: '' };
  }
  const clean = raw.trim();
  if (clean === 'CHAO CO') {
    return { subjectCode: 'CHAO CO', subjectName: 'Chào cờ', teacher: 'Toàn trường' };
  }
  
  const parts = clean.split('-');
  const code = parts[0].trim().toUpperCase();
  const teacherRaw = parts.length > 1 ? parts.slice(1).join('-').trim() : '';

  const meta = SUBJECT_METAS[code];
  const subjectName = meta ? meta.name : code;
  
  let teacher = teacherRaw;
  if (!teacher && meta) {
    teacher = meta.defaultTeacher;
  } else if (teacher) {
    // format teacher name if needed
    if (!teacher.startsWith('Cô') && !teacher.startsWith('Thầy')) {
      if (['HạnhH', 'Quyên', 'Nga', 'Trang', 'Bích'].includes(teacher)) {
        teacher = `Cô ${teacher}`;
      } else if (['Lãm', 'Toàn', 'Chung', 'L.Tùng', 'Gàng'].includes(teacher)) {
        teacher = `Thầy ${teacher}`;
      } else if (teacher === 'Giàu') {
        teacher = 'Cô/Thầy Giàu';
      }
    }
  }

  return {
    subjectCode: code,
    subjectName,
    teacher: teacher || (meta ? meta.defaultTeacher : ''),
  };
}

export const INITIAL_TIMETABLE: TimetableCell[] = [
  // --- THỨ 2 (day: 2) ---
  // Sáng: 1: CHAO CO, 2: HOA-HạnhH, 3: TOAN-Quyên, 4: TOAN-Quyên, 5: SINH-Lãm
  {
    id: 'd2-m-1',
    day: 2,
    session: 'morning',
    period: 1,
    rawText: 'CHAO CO',
    ...parseSubjectString('CHAO CO'),
  },
  {
    id: 'd2-m-2',
    day: 2,
    session: 'morning',
    period: 2,
    rawText: 'HOA-HạnhH',
    ...parseSubjectString('HOA-HạnhH'),
  },
  {
    id: 'd2-m-3',
    day: 2,
    session: 'morning',
    period: 3,
    rawText: 'TOAN-Quyên',
    ...parseSubjectString('TOAN-Quyên'),
  },
  {
    id: 'd2-m-4',
    day: 2,
    session: 'morning',
    period: 4,
    rawText: 'TOAN-Quyên',
    ...parseSubjectString('TOAN-Quyên'),
  },
  {
    id: 'd2-m-5',
    day: 2,
    session: 'morning',
    period: 5,
    rawText: 'SINH-Lãm',
    ...parseSubjectString('SINH-Lãm'),
  },
  // Chiều: 1: GDQP-L.Tùng, 2: TNHN-Nga, 3: TNHN-Nga, 4: Trống
  {
    id: 'd2-a-1',
    day: 2,
    session: 'afternoon',
    period: 1,
    rawText: 'GDQP-L.Tùng',
    ...parseSubjectString('GDQP-L.Tùng'),
  },
  {
    id: 'd2-a-2',
    day: 2,
    session: 'afternoon',
    period: 2,
    rawText: 'TNHN-Nga',
    ...parseSubjectString('TNHN-Nga'),
  },
  {
    id: 'd2-a-3',
    day: 2,
    session: 'afternoon',
    period: 3,
    rawText: 'TNHN-Nga',
    ...parseSubjectString('TNHN-Nga'),
  },
  {
    id: 'd2-a-4',
    day: 2,
    session: 'afternoon',
    period: 4,
    rawText: '',
    ...parseSubjectString(''),
  },

  // --- THỨ 3 (day: 3) ---
  // Sáng: 1: LY-Nga, 2: LY-Nga, 3: AV-Trang, 4: SINH-Lãm, 5: Trống
  {
    id: 'd3-m-1',
    day: 3,
    session: 'morning',
    period: 1,
    rawText: 'LY-Nga',
    ...parseSubjectString('LY-Nga'),
  },
  {
    id: 'd3-m-2',
    day: 3,
    session: 'morning',
    period: 2,
    rawText: 'LY-Nga',
    ...parseSubjectString('LY-Nga'),
  },
  {
    id: 'd3-m-3',
    day: 3,
    session: 'morning',
    period: 3,
    rawText: 'AV-Trang',
    ...parseSubjectString('AV-Trang'),
  },
  {
    id: 'd3-m-4',
    day: 3,
    session: 'morning',
    period: 4,
    rawText: 'SINH-Lãm',
    ...parseSubjectString('SINH-Lãm'),
  },
  {
    id: 'd3-m-5',
    day: 3,
    session: 'morning',
    period: 5,
    rawText: '',
    ...parseSubjectString(''),
  },
  // Chiều: trống cả 4 tiết
  {
    id: 'd3-a-1',
    day: 3,
    session: 'afternoon',
    period: 1,
    rawText: '',
    ...parseSubjectString(''),
  },
  {
    id: 'd3-a-2',
    day: 3,
    session: 'afternoon',
    period: 2,
    rawText: '',
    ...parseSubjectString(''),
  },
  {
    id: 'd3-a-3',
    day: 3,
    session: 'afternoon',
    period: 3,
    rawText: '',
    ...parseSubjectString(''),
  },
  {
    id: 'd3-a-4',
    day: 3,
    session: 'afternoon',
    period: 4,
    rawText: '',
    ...parseSubjectString(''),
  },

  // --- THỨ 4 (day: 4) ---
  // Sáng: 1: VAN-Bích, 2: VAN-Bích, 3: HOA-HạnhH, 4: HOA-HạnhH, 5: SU-Toàn
  {
    id: 'd4-m-1',
    day: 4,
    session: 'morning',
    period: 1,
    rawText: 'VAN-Bích',
    ...parseSubjectString('VAN-Bích'),
  },
  {
    id: 'd4-m-2',
    day: 4,
    session: 'morning',
    period: 2,
    rawText: 'VAN-Bích',
    ...parseSubjectString('VAN-Bích'),
  },
  {
    id: 'd4-m-3',
    day: 4,
    session: 'morning',
    period: 3,
    rawText: 'HOA-HạnhH',
    ...parseSubjectString('HOA-HạnhH'),
  },
  {
    id: 'd4-m-4',
    day: 4,
    session: 'morning',
    period: 4,
    rawText: 'HOA-HạnhH',
    ...parseSubjectString('HOA-HạnhH'),
  },
  {
    id: 'd4-m-5',
    day: 4,
    session: 'morning',
    period: 5,
    rawText: 'SU-Toàn',
    ...parseSubjectString('SU-Toàn'),
  },
  // Chiều: trống cả 4 tiết
  {
    id: 'd4-a-1',
    day: 4,
    session: 'afternoon',
    period: 1,
    rawText: '',
    ...parseSubjectString(''),
  },
  {
    id: 'd4-a-2',
    day: 4,
    session: 'afternoon',
    period: 2,
    rawText: '',
    ...parseSubjectString(''),
  },
  {
    id: 'd4-a-3',
    day: 4,
    session: 'afternoon',
    period: 3,
    rawText: '',
    ...parseSubjectString(''),
  },
  {
    id: 'd4-a-4',
    day: 4,
    session: 'afternoon',
    period: 4,
    rawText: '',
    ...parseSubjectString(''),
  },

  // --- THỨ 5 (day: 5) ---
  // Sáng: 1: AV-Trang, 2: AV-Trang, 3: TH-Chung, 4: TH-Chung, 5: VAN-Bích
  {
    id: 'd5-m-1',
    day: 5,
    session: 'morning',
    period: 1,
    rawText: 'AV-Trang',
    ...parseSubjectString('AV-Trang'),
  },
  {
    id: 'd5-m-2',
    day: 5,
    session: 'morning',
    period: 2,
    rawText: 'AV-Trang',
    ...parseSubjectString('AV-Trang'),
  },
  {
    id: 'd5-m-3',
    day: 5,
    session: 'morning',
    period: 3,
    rawText: 'TH-Chung',
    ...parseSubjectString('TH-Chung'),
  },
  {
    id: 'd5-m-4',
    day: 5,
    session: 'morning',
    period: 4,
    rawText: 'TH-Chung',
    ...parseSubjectString('TH-Chung'),
  },
  {
    id: 'd5-m-5',
    day: 5,
    session: 'morning',
    period: 5,
    rawText: 'VAN-Bích',
    ...parseSubjectString('VAN-Bích'),
  },
  // Chiều: 1: GDTD-Gàng, 2: GDTD-Gàng, 3: TNHN-Nga, 4: GDĐP-Giàu
  {
    id: 'd5-a-1',
    day: 5,
    session: 'afternoon',
    period: 1,
    rawText: 'GDTD-Gàng',
    ...parseSubjectString('GDTD-Gàng'),
  },
  {
    id: 'd5-a-2',
    day: 5,
    session: 'afternoon',
    period: 2,
    rawText: 'GDTD-Gàng',
    ...parseSubjectString('GDTD-Gàng'),
  },
  {
    id: 'd5-a-3',
    day: 5,
    session: 'afternoon',
    period: 3,
    rawText: 'TNHN-Nga',
    ...parseSubjectString('TNHN-Nga'),
  },
  {
    id: 'd5-a-4',
    day: 5,
    session: 'afternoon',
    period: 4,
    rawText: 'GDĐP-Giàu',
    ...parseSubjectString('GDĐP-Giàu'),
  },

  // --- THỨ 6 (day: 6) ---
  // Sáng: 1: TOAN-Quyên, 2: TOAN-Quyên, 3: SU-Toàn, 4: LY-Nga, 5: SHL-HạnhH
  {
    id: 'd6-m-1',
    day: 6,
    session: 'morning',
    period: 1,
    rawText: 'TOAN-Quyên',
    ...parseSubjectString('TOAN-Quyên'),
  },
  {
    id: 'd6-m-2',
    day: 6,
    session: 'morning',
    period: 2,
    rawText: 'TOAN-Quyên',
    ...parseSubjectString('TOAN-Quyên'),
  },
  {
    id: 'd6-m-3',
    day: 6,
    session: 'morning',
    period: 3,
    rawText: 'SU-Toàn',
    ...parseSubjectString('SU-Toàn'),
  },
  {
    id: 'd6-m-4',
    day: 6,
    session: 'morning',
    period: 4,
    rawText: 'LY-Nga',
    ...parseSubjectString('LY-Nga'),
  },
  {
    id: 'd6-m-5',
    day: 6,
    session: 'morning',
    period: 5,
    rawText: 'SHL-HạnhH',
    ...parseSubjectString('SHL-HạnhH'),
  },
  // Chiều: trống cả 4 tiết
  {
    id: 'd6-a-1',
    day: 6,
    session: 'afternoon',
    period: 1,
    rawText: '',
    ...parseSubjectString(''),
  },
  {
    id: 'd6-a-2',
    day: 6,
    session: 'afternoon',
    period: 2,
    rawText: '',
    ...parseSubjectString(''),
  },
  {
    id: 'd6-a-3',
    day: 6,
    session: 'afternoon',
    period: 3,
    rawText: '',
    ...parseSubjectString(''),
  },
  {
    id: 'd6-a-4',
    day: 6,
    session: 'afternoon',
    period: 4,
    rawText: '',
    ...parseSubjectString(''),
  },
];

export const DAYS_OF_WEEK = [
  { dayNumber: 2, short: 'T2', name: 'Thứ 2', full: 'Thứ Hai' },
  { dayNumber: 3, short: 'T3', name: 'Thứ 3', full: 'Thứ Ba' },
  { dayNumber: 4, short: 'T4', name: 'Thứ 4', full: 'Thứ Tư' },
  { dayNumber: 5, short: 'T5', name: 'Thứ 5', full: 'Thứ Năm' },
  { dayNumber: 6, short: 'T6', name: 'Thứ 6', full: 'Thứ Sáu' },
];

export const INITIAL_EXAMS: Exam[] = [
  {
    id: 'exam-toan-1',
    subjectCode: 'TOAN',
    subjectName: 'Toán học',
    examTitle: 'Kiểm tra 1 tiết Khảo sát hàm số',
    examDateTime: new Date(Date.now() + 2 * 24 * 3600 * 1000 + 4 * 3600 * 1000).toISOString(), // ~2 days away
    durationMinutes: 45,
    room: 'Phòng 12A1',
    format: 'Combo TN+ĐS+TLN',
    notes: 'Ôn tập chương Khảo sát hàm số, mang theo máy tính Casio FX 580VNX',
    isCompleted: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'exam-ly-1',
    subjectCode: 'LY',
    subjectName: 'Vật lý',
    examTitle: 'Kiểm tra giữa kì I Vật lý',
    examDateTime: new Date(Date.now() + 5 * 24 * 3600 * 1000 + 8 * 3600 * 1000).toISOString(), // ~5 days away
    durationMinutes: 50,
    room: 'Phòng 12A1',
    format: 'Combo TN+ĐS',
    notes: 'Dao động cơ học và Sóng cơ, nhớ công thức tính chu kì con lắc',
    isCompleted: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'exam-van-1',
    subjectCode: 'VAN',
    subjectName: 'Ngữ văn',
    examTitle: 'Thi Giữa Kì - Nghị luận văn học',
    examDateTime: new Date(Date.now() + 12 * 24 * 3600 * 1000).toISOString(), // ~12 days away
    durationMinutes: 90,
    room: 'Phòng Hội đồng 2',
    format: 'Tự luận 100%',
    notes: 'Phân tích nhân vật và các tác phẩm trọng tâm đầu học kì',
    isCompleted: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'exam-hoa-1',
    subjectCode: 'HOA',
    subjectName: 'Hóa học',
    examTitle: 'Kiểm tra 15 phút Este - Lipit',
    examDateTime: new Date(Date.now() + 20 * 3600 * 1000).toISOString(), // within 24h
    durationMinutes: 15,
    room: 'Phòng 12A1',
    format: 'TN 100%',
    notes: 'Phản ứng xà phòng hóa, chỉ số este',
    isCompleted: false,
    createdAt: new Date().toISOString(),
  },
];
