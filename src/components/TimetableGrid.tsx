import React, { useState } from 'react';
import { TimetableCell, SessionType } from '../types';
import { MORNING_SLOTS, AFTERNOON_SLOTS, DAYS_OF_WEEK, SUBJECT_METAS } from '../data/timetableData';
import { getSchoolWeek, getWeekDateRangeString } from '../utils/timeUtils';
import { Edit3, Check, X, RotateCcw, Search, Coffee, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface TimetableGridProps {
  cells: TimetableCell[];
  onUpdateCell: (updatedCell: TimetableCell) => void;
  onResetTimetable: () => void;
  onAddExamForSubject: (subjectCode: string, subjectName: string) => void;
  highlightSubject: string | null;
  setHighlightSubject: (code: string | null) => void;
}

export const TimetableGrid: React.FC<TimetableGridProps> = ({
  cells,
  onUpdateCell,
  onResetTimetable,
  onAddExamForSubject,
  highlightSubject,
  setHighlightSubject,
}) => {
  const [sessionFilter, setSessionFilter] = useState<'all' | 'morning' | 'afternoon'>('all');
  const [currentViewWeek, setCurrentViewWeek] = useState<number>(8); // Default to Week 8 as requested
  const [editingCell, setEditingCell] = useState<TimetableCell | null>(null);
  const [editRawText, setEditRawText] = useState('');
  const [selectedCellDetail, setSelectedCellDetail] = useState<TimetableCell | null>(null);

  const getCell = (day: number, session: SessionType, period: number): TimetableCell | undefined => {
    return cells.find((c) => c.day === day && c.session === session && c.period === period);
  };

  const handleStartEdit = (cell: TimetableCell, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingCell(cell);
    setEditRawText(cell.rawText || '');
  };

  const handleSaveEdit = () => {
    if (!editingCell) return;
    const clean = editRawText.trim();
    let code = '';
    let name = '';
    let teacher = '';

    if (clean) {
      if (clean === 'CHAO CO') {
        code = 'CHAO CO';
        name = 'Chào cờ';
        teacher = 'Toàn trường';
      } else {
        const parts = clean.split('-');
        code = parts[0].trim().toUpperCase();
        teacher = parts.length > 1 ? parts.slice(1).join('-').trim() : '';
        const meta = SUBJECT_METAS[code];
        name = meta ? meta.name : code;
        if (!teacher && meta) {
          teacher = meta.defaultTeacher;
        }
      }
    }

    onUpdateCell({
      ...editingCell,
      rawText: clean,
      subjectCode: code,
      subjectName: name,
      teacher,
    });
    setEditingCell(null);
  };

  const existingSubjectCodes = Array.from(
    new Set(cells.map((c) => c.subjectCode).filter(Boolean))
  );

  return (
    <div className="space-y-4">
      
      {/* Week Navigator Bar */}
      <div className="bg-white/95 backdrop-blur-xs p-3.5 sm:p-4 rounded-2xl border border-purple-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#8F60BF]" />
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-900">
              Tuần {currentViewWeek}
            </span>
            {currentViewWeek === 8 && (
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#ECD8F2] text-[#8F60BF]">
                Tuần hiện tại
              </span>
            )}
            <span className="text-xs text-slate-500 font-mono">
              ({getWeekDateRangeString(currentViewWeek)})
            </span>
          </div>
        </div>

        {/* Week navigation buttons */}
        <div className="flex items-center gap-1.5 text-xs">
          <button
            onClick={() => setCurrentViewWeek((w) => Math.max(1, w - 1))}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-purple-200 text-slate-700 hover:bg-purple-50 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Tuần {currentViewWeek - 1}</span>
          </button>
          
          <button
            onClick={() => setCurrentViewWeek(8)}
            className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              currentViewWeek === 8
                ? 'bg-[#8F60BF] text-white shadow-xs'
                : 'bg-purple-50 text-[#8F60BF] hover:bg-purple-100'
            }`}
          >
            Về Tuần 8
          </button>

          <button
            onClick={() => setCurrentViewWeek((w) => w + 1)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-purple-200 text-slate-700 hover:bg-purple-50 transition-colors cursor-pointer"
          >
            <span>Tuần {currentViewWeek + 1}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Top Filter and Controls Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/95 p-3 sm:p-4 rounded-2xl border border-purple-100 shadow-xs">
        {/* Session Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100/90 rounded-xl">
          <button
            onClick={() => setSessionFilter('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              sessionFilter === 'all'
                ? 'bg-white text-[#8F60BF] shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Cả Ngày (Sáng & Chiều)
          </button>
          <button
            onClick={() => setSessionFilter('morning')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              sessionFilter === 'morning'
                ? 'bg-white text-[#8F60BF] shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sáng (5 Tiết · 07:00)
          </button>
          <button
            onClick={() => setSessionFilter('afternoon')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              sessionFilter === 'afternoon'
                ? 'bg-white text-[#8F60BF] shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Chiều (4 Tiết · 13:30)
          </button>
        </div>

        {/* Right action tools */}
        <div className="flex items-center gap-2">
          {highlightSubject && (
            <button
              onClick={() => setHighlightSubject(null)}
              className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 bg-rose-50 px-2 py-1 rounded-lg cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Bỏ lọc ({highlightSubject})</span>
            </button>
          )}

          <button
            onClick={onResetTimetable}
            className="flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
            title="Khôi phục TKB gốc 12A1 từ ảnh chụp"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Khôi phục gốc</span>
          </button>
        </div>
      </div>

      {/* Subject Filter Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-print">
        <span className="text-slate-400 text-xs shrink-0 flex items-center gap-1">
          <Search className="w-3.5 h-3.5" />
          <span>Lọc môn:</span>
        </span>
        <button
          onClick={() => setHighlightSubject(null)}
          className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors shrink-0 cursor-pointer ${
            !highlightSubject ? 'bg-[#8F60BF] text-white font-semibold' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          Tất cả môn
        </button>
        {existingSubjectCodes.map((code) => {
          const meta = SUBJECT_METAS[code];
          const isSelected = highlightSubject === code;
          return (
            <button
              key={code}
              onClick={() => setHighlightSubject(isSelected ? null : code)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer ${
                isSelected
                  ? 'bg-[#079DD9] text-white shadow-xs font-semibold'
                  : 'bg-white border border-purple-100 text-slate-700 hover:border-purple-300'
              }`}
            >
              {code} {meta?.name ? `(${meta.name})` : ''}
            </button>
          );
        })}
      </div>

      {/* Main Timetable Matrix */}
      <div className="bg-white rounded-2xl border border-purple-100 shadow-xs overflow-hidden timetable-print-area">
        
        {/* Print Header */}
        <div className="hidden print-only p-4 border-b border-slate-300 text-center">
          <h1 className="text-xl font-bold uppercase">Thời Khóa Biểu Lớp 12A1 — Tuần {currentViewWeek}</h1>
          <p className="text-xs text-slate-600 mt-1">
            Quy ước: Sáng 07:00 (5 tiết) · Chiều 13:30 (4 tiết) · Mỗi tiết 45p, nghỉ 5p, ra chơi 20p sau tiết 2
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[760px]">
            <thead>
              <tr className="bg-[#EFE5F6] text-[#7A3DAA] text-xs font-bold uppercase tracking-wider border-b border-[#DEC8ED]">
                <th className="py-3 px-3 w-32 border-r border-[#E5D7F2] text-center text-[#7A3DAA]">
                  Tiết / Giờ học
                </th>
                {DAYS_OF_WEEK.map((d) => (
                  <th key={d.dayNumber} className="py-3 px-3 text-center border-r border-[#E5D7F2] last:border-r-0">
                    <span className="text-sm font-bold block text-[#7A3DAA]">{d.name}</span>
                    <span className="text-[10px] text-slate-500 font-medium">{d.full}</span>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-purple-100/70 text-sm">

              {/* ========== MORNING SESSION ========== */}
              {(sessionFilter === 'all' || sessionFilter === 'morning') && (
                <>
                  <tr className="bg-[#ECD8F2]/60 border-y border-[#BEB6F2]/40">
                    <td
                      colSpan={6}
                      className="py-1.5 px-4 text-xs font-bold text-[#8F60BF] uppercase tracking-wide"
                    >
                      Buổi Sáng — Bắt đầu từ 07:00 (5 Tiết · 45 phút/tiết) · Tuần {currentViewWeek}
                    </td>
                  </tr>

                  {MORNING_SLOTS.map((slot) => {
                    const isRecessAfter = slot.period === 2; // 20-min recess
                    return (
                      <React.Fragment key={`morning-${slot.period}`}>
                        <tr className="hover:bg-purple-50/30 transition-colors">
                          {/* Slot Info Column */}
                          <td className="py-3 px-2 border-r border-purple-50 bg-slate-50/50 text-center">
                            <div className="font-bold text-slate-900 text-xs sm:text-sm">
                              Tiết {slot.period}
                            </div>
                            <div className="font-mono text-[11px] text-slate-500 tabular-nums">
                              {slot.startTime} - {slot.endTime}
                            </div>
                          </td>

                          {/* 5 Days Columns */}
                          {DAYS_OF_WEEK.map((day) => {
                            const cell = getCell(day.dayNumber, 'morning', slot.period);
                            const meta = cell?.subjectCode ? SUBJECT_METAS[cell.subjectCode] : null;
                            const isMatch = highlightSubject && cell?.subjectCode === highlightSubject;
                            const isDimmed = highlightSubject && cell?.subjectCode && cell.subjectCode !== highlightSubject;

                            return (
                              <td
                                key={`${day.dayNumber}-morning-${slot.period}`}
                                onClick={() => cell && setSelectedCellDetail(cell)}
                                className={`py-2 px-2.5 border-r border-purple-50 last:border-r-0 align-top transition-all cursor-pointer relative group ${
                                  isMatch
                                    ? 'bg-[#ECD8F2] ring-2 ring-[#8F60BF] z-10'
                                    : isDimmed
                                    ? 'opacity-40'
                                    : cell?.subjectCode
                                    ? 'hover:bg-purple-50/50'
                                    : 'bg-slate-50/20'
                                }`}
                              >
                                {cell?.rawText ? (
                                  <div className="h-full flex flex-col justify-between">
                                    <div>
                                      <div className="flex items-center justify-between gap-1">
                                        <span className={`text-xs font-bold tracking-tight ${meta?.color.text || 'text-slate-900'}`}>
                                          {cell.subjectCode}
                                        </span>
                                        {/* Edit Trigger */}
                                        <button
                                          onClick={(e) => handleStartEdit(cell, e)}
                                          className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-700 p-0.5 rounded transition-opacity no-print cursor-pointer"
                                          title="Chỉnh sửa tiết này"
                                        >
                                          <Edit3 className="w-3 h-3" />
                                        </button>
                                      </div>
                                      <div className="text-[11px] text-slate-600 line-clamp-1 font-medium mt-0.5">
                                        {cell.subjectName}
                                      </div>
                                    </div>

                                    {cell.teacher && (
                                      <div className="text-[10px] text-slate-500 font-normal mt-1 border-t border-purple-50 pt-0.5">
                                        {cell.teacher}
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <div className="h-full min-h-[44px] flex items-center justify-center text-slate-300 text-xs italic group-hover:text-slate-400">
                                    <button
                                      onClick={(e) => cell && handleStartEdit(cell, e)}
                                      className="opacity-0 group-hover:opacity-100 text-[11px] text-[#8F60BF] font-medium hover:underline no-print cursor-pointer"
                                    >
                                      + Thêm
                                    </button>
                                    <span className="group-hover:hidden">—</span>
                                  </div>
                                )}
                              </td>
                            );
                          })}
                        </tr>

                        {/* 20-minute Recess Break Banner after Period 2 */}
                        {isRecessAfter && (
                          <tr className="bg-[#99D9F2]/30 border-y border-[#079DD9]/20 text-center">
                            <td colSpan={6} className="py-1 px-4 text-xs font-semibold text-[#079DD9]">
                              <span className="inline-flex items-center gap-1.5">
                                <Coffee className="w-3.5 h-3.5" />
                                <span>Giờ Ra Chơi Lớn (08:35 - 08:55 · Nghỉ 20 phút để hồi sức)</span>
                              </span>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </>
              )}

              {/* ========== AFTERNOON SESSION ========== */}
              {(sessionFilter === 'all' || sessionFilter === 'afternoon') && (
                <>
                  <tr className="bg-[#99D9F2]/40 border-y border-[#079DD9]/20">
                    <td
                      colSpan={6}
                      className="py-1.5 px-4 text-xs font-bold text-[#079DD9] uppercase tracking-wide"
                    >
                      Buổi Chiều — Bắt đầu từ 13:30 (4 Tiết · 45 phút/tiết) · Tuần {currentViewWeek}
                    </td>
                  </tr>

                  {AFTERNOON_SLOTS.map((slot) => {
                    const isRecessAfter = slot.period === 2;
                    return (
                      <React.Fragment key={`afternoon-${slot.period}`}>
                        <tr className="hover:bg-purple-50/30 transition-colors">
                          {/* Slot Info Column */}
                          <td className="py-3 px-2 border-r border-purple-50 bg-slate-50/50 text-center">
                            <div className="font-bold text-slate-900 text-xs sm:text-sm">
                              Tiết {slot.period}
                            </div>
                            <div className="font-mono text-[11px] text-slate-500 tabular-nums">
                              {slot.startTime} - {slot.endTime}
                            </div>
                          </td>

                          {/* 5 Days Columns */}
                          {DAYS_OF_WEEK.map((day) => {
                            const cell = getCell(day.dayNumber, 'afternoon', slot.period);
                            const meta = cell?.subjectCode ? SUBJECT_METAS[cell.subjectCode] : null;
                            const isMatch = highlightSubject && cell?.subjectCode === highlightSubject;
                            const isDimmed = highlightSubject && cell?.subjectCode && cell.subjectCode !== highlightSubject;

                            return (
                              <td
                                key={`${day.dayNumber}-afternoon-${slot.period}`}
                                onClick={() => cell && setSelectedCellDetail(cell)}
                                className={`py-2 px-2.5 border-r border-purple-50 last:border-r-0 align-top transition-all cursor-pointer relative group ${
                                  isMatch
                                    ? 'bg-[#ECD8F2] ring-2 ring-[#8F60BF] z-10'
                                    : isDimmed
                                    ? 'opacity-40'
                                    : cell?.subjectCode
                                    ? 'hover:bg-purple-50/50'
                                    : 'bg-slate-50/20'
                                }`}
                              >
                                {cell?.rawText ? (
                                  <div className="h-full flex flex-col justify-between">
                                    <div>
                                      <div className="flex items-center justify-between gap-1">
                                        <span className={`text-xs font-bold tracking-tight ${meta?.color.text || 'text-slate-900'}`}>
                                          {cell.subjectCode}
                                        </span>
                                        <button
                                          onClick={(e) => handleStartEdit(cell, e)}
                                          className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-700 p-0.5 rounded transition-opacity no-print cursor-pointer"
                                          title="Chỉnh sửa tiết này"
                                        >
                                          <Edit3 className="w-3 h-3" />
                                        </button>
                                      </div>
                                      <div className="text-[11px] text-slate-600 line-clamp-1 font-medium mt-0.5">
                                        {cell.subjectName}
                                      </div>
                                    </div>

                                    {cell.teacher && (
                                      <div className="text-[10px] text-slate-500 font-normal mt-1 border-t border-purple-50 pt-0.5">
                                        {cell.teacher}
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <div className="h-full min-h-[44px] flex items-center justify-center text-slate-300 text-xs italic group-hover:text-slate-400">
                                    <button
                                      onClick={(e) => cell && handleStartEdit(cell, e)}
                                      className="opacity-0 group-hover:opacity-100 text-[11px] text-[#8F60BF] font-medium hover:underline no-print cursor-pointer"
                                    >
                                      + Thêm
                                    </button>
                                    <span className="group-hover:hidden">—</span>
                                  </div>
                                )}
                              </td>
                            );
                          })}
                        </tr>

                        {/* 20-minute Recess Break Banner after Period 2 */}
                        {isRecessAfter && (
                          <tr className="bg-[#99D9F2]/30 border-y border-[#079DD9]/20 text-center">
                            <td colSpan={6} className="py-1 px-4 text-xs font-semibold text-[#079DD9]">
                              <span className="inline-flex items-center gap-1.5">
                                <Coffee className="w-3.5 h-3.5" />
                                <span>Giờ Ra Chơi Lớn Chiều (15:05 - 15:25 · Nghỉ 20 phút để hồi sức)</span>
                              </span>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </>
              )}

            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Cell Modal */}
      {editingCell && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-purple-200">
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Chỉnh Sửa Tiết {editingCell.period} ({editingCell.session === 'morning' ? 'Sáng' : 'Chiều'}) — Thứ {editingCell.day}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Nhập mã môn và giáo viên (Ví dụ: <code className="bg-purple-50 text-[#8F60BF] px-1 py-0.5 rounded">TOAN-Quyên</code>, <code className="bg-purple-50 text-[#8F60BF] px-1 py-0.5 rounded">HOA-HạnhH</code> hoặc để trống).
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Mã môn - Giáo viên</label>
                <input
                  type="text"
                  value={editRawText}
                  onChange={(e) => setEditRawText(e.target.value)}
                  placeholder="Ví dụ: TOAN-Quyên, HOA-HạnhH..."
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                  autoFocus
                />
              </div>

              {/* Quick suggestion buttons */}
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Gợi ý chọn nhanh:</label>
                <div className="flex flex-wrap gap-1">
                  {['TOAN-Quyên', 'VAN-Bích', 'AV-Trang', 'LY-Nga', 'HOA-HạnhH', 'SINH-Lãm', 'SU-Toàn', 'TH-Chung', 'GDQP-L.Tùng', 'TNHN-Nga', 'GDTD-Gàng', 'GDĐP-Giàu', 'SHL-HạnhH'].map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setEditRawText(item)}
                      className="text-[11px] px-2 py-0.5 bg-purple-50 hover:bg-purple-100 text-purple-800 rounded transition-colors cursor-pointer"
                    >
                      {item}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setEditRawText('')}
                    className="text-[11px] px-2 py-0.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded cursor-pointer"
                  >
                    Để trống
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingCell(null)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800 rounded-lg cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="px-3.5 py-1.5 text-xs font-medium text-white bg-[#8F60BF] hover:bg-[#7b4ea8] rounded-lg shadow-xs cursor-pointer"
                >
                  Lưu thay đổi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Detail Cell Drawer / Popover */}
      {selectedCellDetail && selectedCellDetail.subjectCode && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 backdrop-blur-xs p-4" onClick={() => setSelectedCellDetail(null)}>
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-purple-200" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-3 border-b border-purple-100">
              <div>
                <span className="text-xs font-semibold text-[#8F60BF] uppercase">
                  Thứ {selectedCellDetail.day} · {selectedCellDetail.session === 'morning' ? 'Buổi Sáng' : 'Buổi Chiều'} (Tuần {currentViewWeek})
                </span>
                <h4 className="text-base font-bold text-slate-900 mt-0.5">
                  Tiết {selectedCellDetail.period}: {selectedCellDetail.subjectName}
                </h4>
              </div>
              <button
                onClick={() => setSelectedCellDetail(null)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-3 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Giáo viên:</span>
                <span className="font-semibold text-slate-800">{selectedCellDetail.teacher || 'Chưa cập nhật'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Mã môn:</span>
                <span className="font-mono font-medium text-slate-800">{selectedCellDetail.subjectCode}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Thời gian học:</span>
                <span className="font-mono font-medium text-slate-800">
                  {selectedCellDetail.session === 'morning'
                    ? MORNING_SLOTS[selectedCellDetail.period - 1]?.startTime + ' - ' + MORNING_SLOTS[selectedCellDetail.period - 1]?.endTime
                    : AFTERNOON_SLOTS[selectedCellDetail.period - 1]?.startTime + ' - ' + AFTERNOON_SLOTS[selectedCellDetail.period - 1]?.endTime}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Giải lao sau tiết:</span>
                <span className="font-medium text-[#079DD9]">
                  {selectedCellDetail.period === 2 ? '20 phút hồi sức (ra chơi lớn)' : selectedCellDetail.period === 5 || (selectedCellDetail.session === 'afternoon' && selectedCellDetail.period === 4) ? 'Hết buổi' : '5 phút'}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={(e) => {
                  handleStartEdit(selectedCellDetail, e);
                  setSelectedCellDetail(null);
                }}
                className="text-xs text-slate-600 hover:text-slate-900 font-medium px-2.5 py-1.5 cursor-pointer"
              >
                Đổi môn / GV
              </button>
              <button
                onClick={() => {
                  onAddExamForSubject(selectedCellDetail.subjectCode, selectedCellDetail.subjectName);
                  setSelectedCellDetail(null);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#8F60BF] hover:bg-[#7b4ea8] rounded-xl shadow-xs cursor-pointer"
              >
                <span>+ Lên lịch thi môn này</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
