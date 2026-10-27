export type SessionType = 'morning' | 'afternoon';

export interface TimeSlot {
  period: number; // 1 to 5 for morning, 1 to 4 for afternoon
  session: SessionType;
  startTime: string; // "07:00"
  endTime: string;   // "07:45"
  breakDurationMinutes: number; // break after this period (5 or 20, or 0 if last)
  breakDescription?: string;    // "Nghỉ 5 phút" or "Ra chơi giải lao 20 phút"
}

export interface TimetableCell {
  id: string; // e.g. "mon-morning-1"
  day: number; // 2 to 6 (Thứ 2 to Thứ 6)
  session: SessionType;
  period: number;
  rawText: string; // e.g. "HOA-HạnhH", "TOAN-Quyên"
  subjectCode: string; // e.g. "HOA", "TOAN"
  subjectName: string; // e.g. "Hóa học", "Toán học"
  teacher: string;     // e.g. "Cô Hạnh H", "Cô Quyên"
  room?: string;
  notes?: string;
}

export interface DaySchedule {
  dayNumber: number; // 2, 3, 4, 5, 6
  dayLabel: string;  // "Thứ 2", "Thứ 3", ...
  morning: TimetableCell[];
  afternoon: TimetableCell[];
}

export interface Exam {
  id: string;
  subjectCode: string;
  subjectName: string;
  examTitle: string; // e.g. "Thi Giữa Kì II", "Kiểm tra 1 tiết", "Thi Thử THPT"
  examDateTime: string; // ISO string e.g. "2026-11-15T08:00:00"
  durationMinutes: number; // e.g. 45, 60, 90
  room?: string; // e.g. "Phòng 12A1", "Hội trường A"
  format?: 'TN 100%' | 'Tự luận 100%' | 'Combo TN+ĐS' | 'Combo TN+ĐS+TLN' | 'Combo TN+TL';
  notes?: string; // Topics to study, reminders
  isCompleted?: boolean;
  score?: number; // Optional score when completed
  createdAt: string;
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConnected: boolean;
  lastSyncedAt?: string;
}

export interface SubjectMeta {
  code: string;
  name: string;
  defaultTeacher: string;
  category: 'core' | 'science' | 'social' | 'special' | 'general';
  color: {
    bg: string;
    text: string;
    border: string;
    badgeBg: string;
    badgeText: string;
  };
}

export interface CurrentPeriodStatus {
  status: 'in_period' | 'in_break' | 'before_school' | 'between_sessions' | 'after_school' | 'weekend';
  currentSlot?: TimeSlot;
  currentCell?: TimetableCell;
  nextSlot?: TimeSlot;
  nextCell?: TimetableCell;
  remainingSeconds: number;
  totalSeconds: number;
  message: string;
}
