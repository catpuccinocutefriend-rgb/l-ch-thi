import { TimeSlot, TimetableCell, CurrentPeriodStatus } from '../types';
import { MORNING_SLOTS, AFTERNOON_SLOTS } from '../data/timetableData';

export function timeStringToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

/**
 * School week calculation:
 * The user specified: "tính thời gian từ tuần này là tuần 8, từ đó bổ sung thêm chỗ thời gian là ngày đó là tuần thứ mấy(tuần 9, 10, 11....)"
 * Current date is late Oct 2026 (e.g. 2026-10-27 is Tuesday of Week 8).
 * Base Monday for Week 8: 2026-10-26 (Monday).
 */
export function getSchoolWeek(dateInput: Date | string): number {
  try {
    const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    if (isNaN(d.getTime())) return 8;

    // Get Monday 00:00:00 of the week for date d
    const day = d.getDay(); // 0: Sun, 1: Mon, 2: Tue...
    const diffToMonday = day === 0 ? -6 : 1 - day;
    const targetMonday = new Date(d.getFullYear(), d.getMonth(), d.getDate() + diffToMonday);
    targetMonday.setHours(0, 0, 0, 0);

    // Base Monday: October 26, 2026 = Week 8
    const baseMonday = new Date(2026, 9, 26);
    baseMonday.setHours(0, 0, 0, 0);

    const diffMs = targetMonday.getTime() - baseMonday.getTime();
    const diffWeeks = Math.round(diffMs / (7 * 24 * 3600 * 1000));
    return 8 + diffWeeks;
  } catch {
    return 8;
  }
}

export function getWeekDateRangeString(weekNumber: number): string {
  const baseMonday = new Date(2026, 9, 26);
  baseMonday.setHours(0, 0, 0, 0);
  const offsetWeeks = weekNumber - 8;
  const monday = new Date(baseMonday.getTime() + offsetWeeks * 7 * 24 * 3600 * 1000);
  const sunday = new Date(monday.getTime() + 6 * 24 * 3600 * 1000);

  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(monday.getDate())}/${pad(monday.getMonth() + 1)} - ${pad(sunday.getDate())}/${pad(sunday.getMonth() + 1)}/${monday.getFullYear()}`;
}

export function getCurrentPeriodStatus(
  cells: TimetableCell[],
  mockDate?: Date
): CurrentPeriodStatus {
  const now = mockDate || new Date();
  const day = now.getDay(); // 0 is Sunday, 1 is Monday, ..., 6 is Saturday
  // In our app: Monday = 2, Tuesday = 3, Wednesday = 4, Thursday = 5, Friday = 6
  const appDayNumber = day === 0 ? 8 : day + 1; // Mon -> 2, Tue -> 3, Wed -> 4, Thu -> 5, Fri -> 6, Sat -> 7, Sun -> 8

  const currentWeek = getSchoolWeek(now);

  if (appDayNumber > 6) {
    return {
      status: 'weekend',
      remainingSeconds: 0,
      totalSeconds: 0,
      message: `Cuối tuần nghỉ ngơi (Tuần ${currentWeek})! Chúc bạn nạp đầy năng lượng cho tuần mới.`,
    };
  }

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const currentSecondsInDay = currentMinutes * 60 + now.getSeconds();

  const dayCells = cells.filter((c) => c.day === appDayNumber);

  // Check morning session (07:00 to 11:20)
  const morningStartMinutes = timeStringToMinutes('07:00');
  const morningEndMinutes = timeStringToMinutes('11:20');
  const afternoonStartMinutes = timeStringToMinutes('13:30');
  const afternoonEndMinutes = timeStringToMinutes('17:00');

  if (currentMinutes < morningStartMinutes) {
    const diffSec = (morningStartMinutes * 60) - currentSecondsInDay;
    const firstCell = dayCells.find((c) => c.session === 'morning' && c.period === 1);
    return {
      status: 'before_school',
      nextSlot: MORNING_SLOTS[0],
      nextCell: firstCell,
      remainingSeconds: diffSec,
      totalSeconds: diffSec,
      message: `Chưa vào giờ học sáng (Tuần ${currentWeek}). Tiết 1 bắt đầu lúc 07:00 (${firstCell?.subjectName || 'Bắt đầu ngày học'})`,
    };
  }

  // Check in morning slots
  if (currentMinutes >= morningStartMinutes && currentMinutes <= morningEndMinutes) {
    for (let i = 0; i < MORNING_SLOTS.length; i++) {
      const slot = MORNING_SLOTS[i];
      const slotStart = timeStringToMinutes(slot.startTime);
      const slotEnd = timeStringToMinutes(slot.endTime);
      const periodCell = dayCells.find((c) => c.session === 'morning' && c.period === slot.period);

      // Is it inside the period?
      if (currentMinutes >= slotStart && currentMinutes < slotEnd) {
        const slotEndSec = slotEnd * 60;
        const remaining = Math.max(0, slotEndSec - currentSecondsInDay);
        return {
          status: 'in_period',
          currentSlot: slot,
          currentCell: periodCell,
          nextSlot: i + 1 < MORNING_SLOTS.length ? MORNING_SLOTS[i + 1] : undefined,
          nextCell: i + 1 < MORNING_SLOTS.length ? dayCells.find((c) => c.session === 'morning' && c.period === i + 2) : undefined,
          remainingSeconds: remaining,
          totalSeconds: 45 * 60,
          message: `Đang trong Tiết ${slot.period} sáng: ${periodCell?.subjectName || 'Trống'} (${slot.startTime} - ${slot.endTime}) · Tuần ${currentWeek}`,
        };
      }

      // Is it in the break after this period?
      if (slot.breakDurationMinutes > 0 && i + 1 < MORNING_SLOTS.length) {
        const nextSlot = MORNING_SLOTS[i + 1];
        const nextSlotStart = timeStringToMinutes(nextSlot.startTime);
        if (currentMinutes >= slotEnd && currentMinutes < nextSlotStart) {
          const breakEndSec = nextSlotStart * 60;
          const remaining = Math.max(0, breakEndSec - currentSecondsInDay);
          const nextPeriodCell = dayCells.find((c) => c.session === 'morning' && c.period === nextSlot.period);
          const isBigBreak = slot.breakDurationMinutes >= 15;
          return {
            status: 'in_break',
            currentSlot: slot,
            currentCell: periodCell,
            nextSlot,
            nextCell: nextPeriodCell,
            remainingSeconds: remaining,
            totalSeconds: slot.breakDurationMinutes * 60,
            message: isBigBreak
              ? `Đang trong giờ ra chơi hồi sức (20 phút). Tiếp theo: Tiết ${nextSlot.period} - ${nextPeriodCell?.subjectName || 'Trống'}`
              : `Giờ nghỉ chuyển tiết (5 phút). Chuẩn bị vào Tiết ${nextSlot.period} - ${nextPeriodCell?.subjectName || 'Trống'}`,
          };
        }
      }
    }
  }

  // Between morning and afternoon (11:20 to 13:30)
  if (currentMinutes > morningEndMinutes && currentMinutes < afternoonStartMinutes) {
    const diffSec = (afternoonStartMinutes * 60) - currentSecondsInDay;
    const firstAfternoonCell = dayCells.find((c) => c.session === 'afternoon' && c.period === 1);
    return {
      status: 'between_sessions',
      nextSlot: AFTERNOON_SLOTS[0],
      nextCell: firstAfternoonCell,
      remainingSeconds: diffSec,
      totalSeconds: diffSec,
      message: `Nghỉ trưa. Buổi chiều bắt đầu lúc 13:30 ${firstAfternoonCell?.subjectName ? `(Tiết 1: ${firstAfternoonCell.subjectName})` : ''} · Tuần ${currentWeek}`,
    };
  }

  // Afternoon slots (13:30 to 17:00)
  if (currentMinutes >= afternoonStartMinutes && currentMinutes <= afternoonEndMinutes) {
    for (let i = 0; i < AFTERNOON_SLOTS.length; i++) {
      const slot = AFTERNOON_SLOTS[i];
      const slotStart = timeStringToMinutes(slot.startTime);
      const slotEnd = timeStringToMinutes(slot.endTime);
      const periodCell = dayCells.find((c) => c.session === 'afternoon' && c.period === slot.period);

      if (currentMinutes >= slotStart && currentMinutes < slotEnd) {
        const slotEndSec = slotEnd * 60;
        const remaining = Math.max(0, slotEndSec - currentSecondsInDay);
        return {
          status: 'in_period',
          currentSlot: slot,
          currentCell: periodCell,
          nextSlot: i + 1 < AFTERNOON_SLOTS.length ? AFTERNOON_SLOTS[i + 1] : undefined,
          nextCell: i + 1 < AFTERNOON_SLOTS.length ? dayCells.find((c) => c.session === 'afternoon' && c.period === i + 2) : undefined,
          remainingSeconds: remaining,
          totalSeconds: 45 * 60,
          message: `Đang trong Tiết ${slot.period} chiều: ${periodCell?.subjectName || 'Trống'} (${slot.startTime} - ${slot.endTime}) · Tuần ${currentWeek}`,
        };
      }

      if (slot.breakDurationMinutes > 0 && i + 1 < AFTERNOON_SLOTS.length) {
        const nextSlot = AFTERNOON_SLOTS[i + 1];
        const nextSlotStart = timeStringToMinutes(nextSlot.startTime);
        if (currentMinutes >= slotEnd && currentMinutes < nextSlotStart) {
          const breakEndSec = nextSlotStart * 60;
          const remaining = Math.max(0, breakEndSec - currentSecondsInDay);
          const nextPeriodCell = dayCells.find((c) => c.session === 'afternoon' && c.period === nextSlot.period);
          const isBigBreak = slot.breakDurationMinutes >= 15;
          return {
            status: 'in_break',
            currentSlot: slot,
            currentCell: periodCell,
            nextSlot,
            nextCell: nextPeriodCell,
            remainingSeconds: remaining,
            totalSeconds: slot.breakDurationMinutes * 60,
            message: isBigBreak
              ? `Đang trong giờ ra chơi hồi sức buổi chiều (20 phút). Tiếp theo: Tiết ${nextSlot.period} - ${nextPeriodCell?.subjectName || 'Trống'}`
              : `Giờ nghỉ chuyển tiết (5 phút). Chuẩn bị vào Tiết ${nextSlot.period} - ${nextPeriodCell?.subjectName || 'Trống'}`,
          };
        }
      }
    }
  }

  // After school (> 17:00)
  return {
    status: 'after_school',
    remainingSeconds: 0,
    totalSeconds: 0,
    message: `Đã hoàn thành các tiết học trong ngày (Tuần ${currentWeek})! Chúc bạn ôn bài tốt buổi tối.`,
  };
}

export interface CountdownParts {
  totalMs: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
  statusText: string;
  urgency: 'urgent' | 'warning' | 'normal' | 'past';
  schoolWeek: number;
}

export function calculateCountdown(targetIso: string): CountdownParts {
  const target = new Date(targetIso).getTime();
  const now = Date.now();
  const diff = target - now;
  const schoolWeek = getSchoolWeek(targetIso);

  if (diff <= 0) {
    return {
      totalMs: diff,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isPast: true,
      statusText: 'Đã đến giờ / Đã thi xong',
      urgency: 'past',
      schoolWeek,
    };
  }

  const seconds = Math.floor((diff / 1000) % 60);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  let urgency: 'urgent' | 'warning' | 'normal' | 'past' = 'normal';
  let statusText = `Còn ${days} ngày (Tuần ${schoolWeek})`;

  if (days < 2) {
    urgency = 'urgent';
    statusText = days === 0 ? `Hôm nay thi! (Còn ${hours}h ${minutes}p · Tuần ${schoolWeek})` : `Còn 1 ngày nữa (${hours}h ${minutes}p · Tuần ${schoolWeek})`;
  } else if (days <= 5) {
    urgency = 'warning';
    statusText = `Sắp thi (còn ${days} ngày · Tuần ${schoolWeek})`;
  }

  return {
    totalMs: diff,
    days,
    hours,
    minutes,
    seconds,
    isPast: false,
    statusText,
    urgency,
    schoolWeek,
  };
}

export function formatDateTimeVN(isoString: string, includeWeek: boolean = true): string {
  try {
    const d = new Date(isoString);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const week = getSchoolWeek(d);
    
    if (includeWeek) {
      return `${hours}:${minutes} - ${day}/${month}/${year} · Tuần ${week}`;
    }
    return `${hours}:${minutes} - ${day}/${month}/${year}`;
  } catch {
    return isoString;
  }
}

export function formatSecondsToMS(totalSec: number): string {
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
