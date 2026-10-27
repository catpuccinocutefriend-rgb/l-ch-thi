import React, { useState, useEffect } from 'react';
import { TimetableCell } from '../types';
import { getCurrentPeriodStatus, formatSecondsToMS, getSchoolWeek } from '../utils/timeUtils';
import { Clock, BookOpen, Coffee, Bell, RotateCcw, Calendar } from 'lucide-react';

interface CurrentStatusWidgetProps {
  cells: TimetableCell[];
  onQuickAddExam: (subjectCode: string, subjectName: string) => void;
}

export const CurrentStatusWidget: React.FC<CurrentStatusWidgetProps> = ({
  cells,
  onQuickAddExam,
}) => {
  const [simulatedTime, setSimulatedTime] = useState<Date | null>(null);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const effectiveDate = simulatedTime || currentTime;
  const statusInfo = getCurrentPeriodStatus(cells, effectiveDate);
  const currentWeek = getSchoolWeek(effectiveDate);

  // Format real clock
  const hours = String(effectiveDate.getHours()).padStart(2, '0');
  const minutes = String(effectiveDate.getMinutes()).padStart(2, '0');
  const seconds = String(effectiveDate.getSeconds()).padStart(2, '0');

  const daysOfWeekVN = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  const currentDayLabel = daysOfWeekVN[effectiveDate.getDay()];
  const currentDateStr = `${effectiveDate.getDate()}/${effectiveDate.getMonth() + 1}/${effectiveDate.getFullYear()}`;

  // Progress percentage
  const progressPercent = statusInfo.totalSeconds > 0
    ? Math.max(0, Math.min(100, Math.round(((statusInfo.totalSeconds - statusInfo.remainingSeconds) / statusInfo.totalSeconds) * 100)))
    : 100;

  return (
    <section className="bg-white/95 backdrop-blur-xs rounded-2xl border border-purple-100/90 shadow-xs p-4 sm:p-5 transition-all">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Left: Current Time & Date + School Week */}
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[#8F60BF] to-[#079DD9] text-white flex flex-col items-center justify-center shrink-0 shadow-sm">
            <Clock className="w-4 h-4 text-purple-100 mb-0.5" />
            <span className="text-xs font-mono font-bold leading-none">{hours}:{minutes}</span>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-sm font-bold text-slate-900">
                {currentDayLabel}, {currentDateStr}
              </h2>
              <span className="font-mono text-xs text-purple-600 font-semibold tabular-nums">
                :{seconds}s
              </span>
              
              {/* Highlighted School Week Badge */}
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#ECD8F2] text-[#8F60BF] border border-[#BEB6F2]/50">
                Tuần {currentWeek}
              </span>

              {simulatedTime && (
                <span className="text-[11px] font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded px-1.5 py-0.5">
                  Đang mô phỏng
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Quy chuẩn 12A1 · Sáng từ 07:00 (5 tiết) · Chiều từ 13:30 (4 tiết) · Ra chơi 20p hồi sức
            </p>
          </div>
        </div>

        {/* Center / Right: Live Status Content */}
        <div className="flex-1 lg:max-w-xl">
          {statusInfo.status === 'in_period' && statusInfo.currentSlot && (
            <div className="bg-gradient-to-r from-purple-50/70 to-sky-50/70 border border-purple-200 rounded-xl p-3">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#079DD9] animate-pulse"></span>
                  <span className="text-xs font-bold text-[#8F60BF]">
                    Đang trong Tiết {statusInfo.currentSlot.period} {statusInfo.currentSlot.session === 'morning' ? 'Sáng' : 'Chiều'} (Tuần {currentWeek})
                  </span>
                  <span className="text-xs text-slate-600 font-mono">
                    ({statusInfo.currentSlot.startTime} - {statusInfo.currentSlot.endTime})
                  </span>
                </div>
                <div className="text-xs font-mono font-bold text-[#079DD9] tabular-nums">
                  Còn {formatSecondsToMS(statusInfo.remainingSeconds)}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#8F60BF]" />
                  <span className="text-sm font-bold text-slate-900">
                    {statusInfo.currentCell?.subjectName || 'Trống'}
                  </span>
                  {statusInfo.currentCell?.teacher && (
                    <span className="text-xs text-slate-600">
                      ({statusInfo.currentCell.teacher})
                    </span>
                  )}
                </div>

                {statusInfo.currentCell?.subjectCode && (
                  <button
                    onClick={() =>
                      statusInfo.currentCell &&
                      onQuickAddExam(statusInfo.currentCell.subjectCode, statusInfo.currentCell.subjectName)
                    }
                    className="text-[11px] font-medium text-[#8F60BF] hover:text-[#7b4ea8] underline underline-offset-2 cursor-pointer"
                  >
                    + Tạo lịch thi môn này
                  </button>
                )}
              </div>

              {/* Progress bar */}
              <div className="w-full bg-purple-100 rounded-full h-1.5 mt-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#8F60BF] to-[#079DD9] h-full rounded-full transition-all duration-1000 ease-linear"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {statusInfo.status === 'in_break' && (
            <div className="bg-amber-50/90 border border-amber-200 rounded-xl p-3">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Coffee className="w-4 h-4 text-amber-700" />
                  <span className="text-xs font-bold text-amber-900">
                    {statusInfo.currentSlot?.breakDurationMinutes === 20 ? 'Giờ ra chơi lớn (20 phút để hồi sức)' : 'Nghỉ chuyển tiết (5 phút)'}
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-amber-800 tabular-nums">
                  Còn {formatSecondsToMS(statusInfo.remainingSeconds)}
                </span>
              </div>
              <p className="text-xs text-amber-800">
                {statusInfo.nextSlot && statusInfo.nextCell?.subjectName
                  ? `Sắp vào Tiết ${statusInfo.nextSlot.period}: ${statusInfo.nextCell.subjectName} (${statusInfo.nextCell.teacher || 'GV bộ môn'}) lúc ${statusInfo.nextSlot.startTime}`
                  : 'Nghỉ ngơi chuẩn bị cho tiết tiếp theo'}
              </p>
            </div>
          )}

          {statusInfo.status === 'before_school' && (
            <div className="bg-purple-50/60 border border-purple-200 rounded-xl p-3 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-purple-900 flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-[#8F60BF]" />
                  Chuẩn bị vào học sáng · Tuần {currentWeek}
                </span>
                <p className="text-xs text-slate-600 mt-0.5">
                  Tiết 1 bắt đầu lúc 07:00 {statusInfo.nextCell?.subjectName ? `· Môn ${statusInfo.nextCell.subjectName}` : ''}
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-purple-800 tabular-nums">
                còn {formatSecondsToMS(statusInfo.remainingSeconds)}
              </span>
            </div>
          )}

          {statusInfo.status === 'between_sessions' && (
            <div className="bg-sky-50/70 border border-sky-200 rounded-xl p-3 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-sky-900 flex items-center gap-1.5">
                  <Coffee className="w-3.5 h-3.5 text-[#079DD9]" />
                  Giờ nghỉ trưa · Tuần {currentWeek}
                </span>
                <p className="text-xs text-sky-800 mt-0.5">
                  Buổi chiều 4 tiết, bắt đầu lúc 13:30
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-[#079DD9] tabular-nums">
                vào học 13:30
              </span>
            </div>
          )}

          {statusInfo.status === 'after_school' && (
            <div className="bg-purple-50/50 border border-purple-200 rounded-xl p-3 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-800">
                  Đã hết giờ học hôm nay · Tuần {currentWeek}
                </span>
                <p className="text-xs text-slate-600 mt-0.5">
                  Hoàn thành các tiết theo TKB 12A1. Đừng quên xem lịch thi sắp tới!
                </p>
              </div>
            </div>
          )}

          {statusInfo.status === 'weekend' && (
            <div className="bg-purple-50/60 border border-purple-200 rounded-xl p-3 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-[#8F60BF]">
                  Cuối tuần nghỉ ngơi · Tuần {currentWeek}
                </span>
                <p className="text-xs text-slate-600 mt-0.5">
                  Không có tiết theo thời khóa biểu. Thứ 2 tuần sau bắt đầu lúc 07:00 (Chào cờ).
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Simulator controls */}
        <div className="border-t lg:border-t-0 lg:border-l border-purple-100 pt-3 lg:pt-0 lg:pl-4 flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-slate-400 text-[11px] block w-full sm:w-auto">Thử nghiệm:</span>
          <button
            onClick={() => {
              const d = new Date();
              d.setDate(d.getDate() + ((1 + 7 - d.getDay()) % 7 || 7)); // Next Monday
              d.setHours(7, 15, 0, 0); // Tiết 1
              setSimulatedTime(d);
            }}
            className="px-2 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg transition-colors text-[11px] cursor-pointer"
          >
            07:15 (Tiết 1)
          </button>
          <button
            onClick={() => {
              const d = new Date();
              d.setDate(d.getDate() + ((1 + 7 - d.getDay()) % 7 || 7));
              d.setHours(8, 40, 0, 0); // Giờ ra chơi lớn 20p
              setSimulatedTime(d);
            }}
            className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg transition-colors text-[11px] cursor-pointer"
          >
            08:40 (Ra chơi 20p)
          </button>
          <button
            onClick={() => {
              const d = new Date();
              d.setDate(d.getDate() + ((1 + 7 - d.getDay()) % 7 || 7));
              d.setHours(13, 40, 0, 0); // Tiết chiều
              setSimulatedTime(d);
            }}
            className="px-2 py-1 bg-sky-50 hover:bg-sky-100 text-[#079DD9] rounded-lg transition-colors text-[11px] cursor-pointer"
          >
            13:40 (Chiều)
          </button>
          {simulatedTime && (
            <button
              onClick={() => setSimulatedTime(null)}
              className="flex items-center gap-1 px-2 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg transition-colors text-[11px] font-medium cursor-pointer"
              title="Trở về thời gian thực"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Thời gian thực</span>
            </button>
          )}
        </div>

      </div>
    </section>
  );
};
