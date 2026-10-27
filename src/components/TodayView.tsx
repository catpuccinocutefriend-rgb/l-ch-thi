import React, { useState } from 'react';
import { TimetableCell, Exam } from '../types';
import { MORNING_SLOTS, AFTERNOON_SLOTS, DAYS_OF_WEEK, SUBJECT_METAS } from '../data/timetableData';
import { getSchoolWeek } from '../utils/timeUtils';
import { Coffee, Sun, Moon, Calendar } from 'lucide-react';

interface TodayViewProps {
  cells: TimetableCell[];
  exams: Exam[];
  onAddExamForSubject: (code: string, name: string) => void;
}

export const TodayView: React.FC<TodayViewProps> = ({
  cells,
  exams,
  onAddExamForSubject,
}) => {
  const now = new Date();
  const currentJsDay = now.getDay();
  const initialDayNumber = currentJsDay >= 1 && currentJsDay <= 5 ? currentJsDay + 1 : 2;
  const currentWeek = getSchoolWeek(now);

  const [selectedDay, setSelectedDay] = useState<number>(initialDayNumber);

  const dayCells = cells.filter((c) => c.day === selectedDay);

  const morningCells = MORNING_SLOTS.map((slot) => {
    const cell = dayCells.find((c) => c.session === 'morning' && c.period === slot.period);
    return { slot, cell };
  });

  const afternoonCells = AFTERNOON_SLOTS.map((slot) => {
    const cell = dayCells.find((c) => c.session === 'afternoon' && c.period === slot.period);
    return { slot, cell };
  });

  const activeMorningCount = morningCells.filter((i) => i.cell?.rawText).length;
  const activeAfternoonCount = afternoonCells.filter((i) => i.cell?.rawText).length;

  return (
    <div className="space-y-6">
      {/* Day Selector Bar */}
      <div className="flex items-center justify-between flex-wrap gap-3 bg-white/95 p-3.5 rounded-2xl border border-purple-100 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {DAYS_OF_WEEK.map((day) => {
            const isToday = currentJsDay + 1 === day.dayNumber;
            const isSelected = selectedDay === day.dayNumber;
            return (
              <button
                key={day.dayNumber}
                onClick={() => setSelectedDay(day.dayNumber)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-[#8F60BF] text-white shadow-xs'
                    : 'bg-slate-100/80 hover:bg-purple-50 text-slate-700'
                }`}
              >
                <span>{day.name}</span>
                {isToday && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${isSelected ? 'bg-purple-800 text-white' : 'bg-[#ECD8F2] text-[#8F60BF]'}`}>
                    Hôm nay
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="font-bold px-2 py-0.5 rounded-full bg-[#ECD8F2] text-[#8F60BF]">
            Tuần {currentWeek}
          </span>
          <span className="text-slate-500 font-medium">
            Tổng cộng: <strong className="text-slate-800">{activeMorningCount + activeAfternoonCount} tiết học</strong>
          </span>
        </div>
      </div>

      {/* 2-Column Sessions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* BUỔI SÁNG */}
        <div className="bg-white/95 rounded-2xl border border-purple-100 shadow-xs overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-purple-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sun className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-slate-900 text-sm">
                Buổi Sáng — 07:00 đến 11:20 · Tuần {currentWeek}
              </h3>
            </div>
            <span className="text-xs font-semibold text-[#8F60BF] bg-[#ECD8F2] px-2.5 py-0.5 rounded-full">
              {activeMorningCount} / 5 tiết có học
            </span>
          </div>

          <div className="p-4 divide-y divide-purple-50 space-y-3">
            {morningCells.map(({ slot, cell }, idx) => {
              const meta = cell?.subjectCode ? SUBJECT_METAS[cell.subjectCode] : null;
              const hasClass = Boolean(cell?.rawText);
              const isRecess = slot.period === 2;

              return (
                <div key={`m-${slot.period}`} className={idx > 0 ? 'pt-3' : ''}>
                  <div className={`p-3 rounded-xl border transition-all ${
                    hasClass
                      ? 'bg-slate-50/70 border-purple-100 hover:border-purple-200'
                      : 'bg-slate-50/20 border-dashed border-slate-200 text-slate-400'
                  }`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-xl bg-purple-100 text-[#8F60BF] font-bold text-xs flex items-center justify-center shrink-0">
                          {slot.period}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-sm">
                              {hasClass ? cell?.subjectName : 'Tiết trống (Tự học / Nghỉ)'}
                            </span>
                            {cell?.subjectCode && (
                              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold ${meta?.color.badgeBg || 'bg-purple-100'} ${meta?.color.badgeText || 'text-purple-800'}`}>
                                {cell.subjectCode}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-500 font-mono mt-0.5 tabular-nums">
                            {slot.startTime} - {slot.endTime} (45 phút)
                          </div>
                        </div>
                      </div>

                      {hasClass && (
                        <button
                          onClick={() => cell?.subjectCode && onAddExamForSubject(cell.subjectCode, cell.subjectName)}
                          className="text-[11px] font-medium text-[#8F60BF] hover:text-[#7b4ea8] bg-purple-50 hover:bg-purple-100 px-2 py-1 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                        >
                          + Lịch thi
                        </button>
                      )}
                    </div>

                    {cell?.teacher && (
                      <div className="mt-2 text-xs text-slate-600 flex items-center gap-1.5 border-t border-purple-50 pt-1.5">
                        <span className="text-slate-400">Giáo viên:</span>
                        <span className="font-medium text-slate-800">{cell.teacher}</span>
                      </div>
                    )}
                  </div>

                  {/* 20 min recess note */}
                  {isRecess && (
                    <div className="my-2 p-2 bg-[#99D9F2]/30 rounded-xl border border-[#079DD9]/20 flex items-center justify-between text-xs text-[#079DD9]">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Coffee className="w-4 h-4 text-[#079DD9]" />
                        Ra chơi giải lao lớn 20 phút (hồi sức)
                      </span>
                      <span className="font-mono font-bold">08:35 - 08:55</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* BUỔI CHIỀU */}
        <div className="bg-white/95 rounded-2xl border border-purple-100 shadow-xs overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-sky-50 to-indigo-50 border-b border-sky-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Moon className="w-5 h-5 text-[#079DD9]" />
              <h3 className="font-bold text-slate-900 text-sm">
                Buổi Chiều — 13:30 đến 17:00 · Tuần {currentWeek}
              </h3>
            </div>
            <span className="text-xs font-semibold text-[#079DD9] bg-[#99D9F2]/60 px-2.5 py-0.5 rounded-full">
              {activeAfternoonCount} / 4 tiết có học
            </span>
          </div>

          <div className="p-4 divide-y divide-purple-50 space-y-3">
            {afternoonCells.map(({ slot, cell }, idx) => {
              const meta = cell?.subjectCode ? SUBJECT_METAS[cell.subjectCode] : null;
              const hasClass = Boolean(cell?.rawText);
              const isRecess = slot.period === 2;

              return (
                <div key={`a-${slot.period}`} className={idx > 0 ? 'pt-3' : ''}>
                  <div className={`p-3 rounded-xl border transition-all ${
                    hasClass
                      ? 'bg-slate-50/70 border-purple-100 hover:border-purple-200'
                      : 'bg-slate-50/20 border-dashed border-slate-200 text-slate-400'
                  }`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-xl bg-sky-100 text-[#079DD9] font-bold text-xs flex items-center justify-center shrink-0">
                          {slot.period}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-sm">
                              {hasClass ? cell?.subjectName : 'Tiết trống (Nghỉ buổi chiều)'}
                            </span>
                            {cell?.subjectCode && (
                              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold ${meta?.color.badgeBg || 'bg-purple-100'} ${meta?.color.badgeText || 'text-purple-800'}`}>
                                {cell.subjectCode}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-500 font-mono mt-0.5 tabular-nums">
                            {slot.startTime} - {slot.endTime} (45 phút)
                          </div>
                        </div>
                      </div>

                      {hasClass && (
                        <button
                          onClick={() => cell?.subjectCode && onAddExamForSubject(cell.subjectCode, cell.subjectName)}
                          className="text-[11px] font-medium text-[#8F60BF] hover:text-[#7b4ea8] bg-purple-50 hover:bg-purple-100 px-2 py-1 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                        >
                          + Lịch thi
                        </button>
                      )}
                    </div>

                    {cell?.teacher && (
                      <div className="mt-2 text-xs text-slate-600 flex items-center gap-1.5 border-t border-purple-50 pt-1.5">
                        <span className="text-slate-400">Giáo viên:</span>
                        <span className="font-medium text-slate-800">{cell.teacher}</span>
                      </div>
                    )}
                  </div>

                  {/* 20 min recess note */}
                  {isRecess && (
                    <div className="my-2 p-2 bg-[#99D9F2]/30 rounded-xl border border-[#079DD9]/20 flex items-center justify-between text-xs text-[#079DD9]">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Coffee className="w-4 h-4 text-[#079DD9]" />
                        Ra chơi giải lao lớn 20 phút (hồi sức)
                      </span>
                      <span className="font-mono font-bold">15:05 - 15:25</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
