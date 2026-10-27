import React, { useState, useEffect } from 'react';
import { Exam } from '../types';
import { calculateCountdown, formatDateTimeVN, getSchoolWeek } from '../utils/timeUtils';
import { SUBJECT_METAS } from '../data/timetableData';
import {
  Clock,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  MapPin,
  FileText,
  Check,
  Sparkles,
} from 'lucide-react';

interface ExamCountdownSectionProps {
  exams: Exam[];
  onOpenAddModal: () => void;
  onEditExam: (exam: Exam) => void;
  onDeleteExam: (id: string) => void;
  onToggleComplete: (id: string) => void;
}

export const ExamCountdownSection: React.FC<ExamCountdownSectionProps> = ({
  exams,
  onOpenAddModal,
  onEditExam,
  onDeleteExam,
  onToggleComplete,
}) => {
  // Tick every second for live countdown
  const [, setTick] = useState<number>(0);
  const [filterState, setFilterState] = useState<'all' | 'upcoming' | 'completed'>('upcoming');
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [filterWeek, setFilterWeek] = useState<string>('all');
  const [examToDelete, setExamToDelete] = useState<Exam | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTick((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter exams
  const filteredExams = exams.filter((exam) => {
    const countdown = calculateCountdown(exam.examDateTime);
    const isCompleted = exam.isCompleted || countdown.isPast;

    if (filterState === 'upcoming' && isCompleted) return false;
    if (filterState === 'completed' && !isCompleted) return false;
    if (filterSubject !== 'all' && exam.subjectCode !== filterSubject) return false;
    if (filterWeek !== 'all' && String(countdown.schoolWeek) !== filterWeek) return false;

    return true;
  });

  // Sort by earliest exam first
  const sortedExams = [...filteredExams].sort((a, b) => {
    return new Date(a.examDateTime).getTime() - new Date(b.examDateTime).getTime();
  });

  // Distinct subjects present
  const distinctSubjects = Array.from(new Set(exams.map((e) => e.subjectCode)));
  // Distinct weeks present
  const distinctWeeks = Array.from(new Set(exams.map((e) => getSchoolWeek(e.examDateTime)))).sort((a, b) => a - b);

  // Helper for format tag styles in soft pastel tones
  const getFormatBadgeStyle = (fmt?: string) => {
    switch (fmt) {
      case 'Combo TN+ĐS+TLN':
        return 'bg-[#E1F4FC] text-[#057CA8] border border-[#079DD9]/30';
      case 'Combo TN+ĐS':
        return 'bg-[#F2E8FA] text-[#7A3DAA] border border-[#BEB6F2]/50';
      case 'Combo TN+TL':
        return 'bg-[#FFF1EB] text-[#C2410C] border border-[#FDBA74]/50';
      case 'TN 100%':
        return 'bg-[#EBFBF2] text-[#15803D] border border-[#86EFAC]/60';
      case 'Tự luận 100%':
        return 'bg-[#FFF8E6] text-[#B45309] border border-[#FDE68A]';
      default:
        return 'bg-purple-50 text-[#8F60BF] border border-purple-200';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header and Toolbar - Soft Pastel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/95 backdrop-blur-xs p-4 sm:p-5 rounded-2xl border border-purple-100 shadow-xs">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>Đếm Ngược Lịch Thi Từng Môn</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 bg-[#ECD8F2] text-[#8F60BF] rounded-full">
              {exams.length} môn/bài thi
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Theo dõi chính xác Ngày : Giờ : Phút : Giây · Tự động tính số tuần học (Tuần 8, 9, 10...)
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#8F60BF] hover:bg-[#7b4ea8] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Lịch Thi Mới</span>
        </button>
      </div>

      {/* Filter Tabs and Selectors */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-1 p-1 bg-purple-50/70 rounded-xl self-start border border-purple-100/60">
          <button
            onClick={() => setFilterState('upcoming')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              filterState === 'upcoming'
                ? 'bg-white text-[#8F60BF] shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sắp Thi ({exams.filter((e) => !e.isCompleted && !calculateCountdown(e.examDateTime).isPast).length})
          </button>
          <button
            onClick={() => setFilterState('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              filterState === 'all'
                ? 'bg-white text-[#8F60BF] shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tất Cả ({exams.length})
          </button>
          <button
            onClick={() => setFilterState('completed')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              filterState === 'completed'
                ? 'bg-white text-[#8F60BF] shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Đã Thi ({exams.filter((e) => e.isCompleted || calculateCountdown(e.examDateTime).isPast).length})
          </button>
        </div>

        {/* Dropdowns */}
        <div className="flex items-center gap-2 text-xs flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Tuần:</span>
            <select
              value={filterWeek}
              onChange={(e) => setFilterWeek(e.target.value)}
              className="bg-white border border-purple-200 rounded-xl px-2.5 py-1.5 text-xs font-medium text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-purple-300"
            >
              <option value="all">Tất cả các tuần</option>
              {distinctWeeks.map((w) => (
                <option key={w} value={String(w)}>
                  Tuần {w} {w === 8 ? '(Hiện tại)' : ''}
                </option>
              ))}
            </select>
          </div>

          {distinctSubjects.length > 1 && (
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">Môn:</span>
              <select
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
                className="bg-white border border-purple-200 rounded-xl px-2.5 py-1.5 text-xs font-medium text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-purple-300"
              >
                <option value="all">Tất cả môn</option>
                {distinctSubjects.map((code) => {
                  const meta = SUBJECT_METAS[code];
                  return (
                    <option key={code} value={code}>
                      {code} - {meta?.name || code}
                    </option>
                  );
                })}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Exam Cards Grid */}
      {sortedExams.length === 0 ? (
        <div className="bg-white/90 rounded-2xl border border-purple-100 p-10 text-center space-y-3">
          <Clock className="w-10 h-10 text-purple-300 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-800">Không có lịch thi nào phù hợp</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {filterState === 'completed'
              ? 'Chưa có bài thi nào được đánh dấu hoàn thành.'
              : 'Hãy nhấn nút bên dưới để thêm bài kiểm tra 15p, 1 tiết hoặc thi học kì.'}
          </p>
          <button
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#8F60BF] text-white rounded-xl text-xs font-medium hover:bg-[#7b4ea8] transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm lịch thi ngay</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {sortedExams.map((exam) => {
            const countdown = calculateCountdown(exam.examDateTime);
            const isCompleted = exam.isCompleted || countdown.isPast;
            const meta = SUBJECT_METAS[exam.subjectCode];

            return (
              <div
                key={exam.id}
                className={`bg-white rounded-2xl border transition-all flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md ${
                  isCompleted
                    ? 'border-slate-200 opacity-80'
                    : countdown.urgency === 'urgent'
                    ? 'border-rose-200 ring-2 ring-rose-100'
                    : countdown.urgency === 'warning'
                    ? 'border-amber-200 ring-2 ring-amber-100'
                    : 'border-purple-100 hover:border-purple-200'
                }`}
              >
                {/* Urgent notification ribbon in soft pastel rose */}
                {!isCompleted && countdown.urgency === 'urgent' && (
                  <div className="bg-rose-50/90 border-b border-rose-100 px-4 py-1.5 flex items-center justify-between text-xs font-semibold text-rose-700">
                    <span className="flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                      Gấp! {countdown.statusText}
                    </span>
                    <span className="text-[11px] font-mono bg-white px-2 py-0.5 rounded text-rose-700 font-bold border border-rose-200">
                      Dưới 48 giờ
                    </span>
                  </div>
                )}

                <div className="p-4 sm:p-5 space-y-3.5">
                  {/* Subject Tag, Week Badge & Title */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {/* Subject Badge */}
                        <span className={`text-[11px] font-bold font-mono px-2.5 py-0.5 rounded-lg ${meta?.color.badgeBg || 'bg-purple-100'} ${meta?.color.badgeText || 'text-purple-800'}`}>
                          {exam.subjectCode}
                        </span>
                        <span className="text-xs text-slate-600 font-medium">
                          {exam.subjectName}
                        </span>
                        
                        {/* School Week Badge in soft lilac */}
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#ECD8F2] text-[#8F60BF] border border-[#BEB6F2]/40">
                          Tuần {countdown.schoolWeek}
                        </span>

                        {/* Exam Format Badge - Soft Pastel */}
                        {exam.format && (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getFormatBadgeStyle(exam.format)}`}>
                            {exam.format}
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-slate-900 mt-2">
                        {exam.examTitle}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onEditExam(exam)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        title="Chỉnh sửa"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setExamToDelete(exam)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Xóa lịch thi này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* LIGHT PASTEL COUNTDOWN TICKER BOX (NO BLACK / NO DARK BACKGROUND) */}
                  {!isCompleted ? (
                    <div className="bg-gradient-to-br from-[#F7F2FB] via-[#F1F7FD] to-[#EBF6FC] rounded-2xl p-3.5 border border-[#E6DBF7] shadow-xs">
                      <div className="text-[11px] text-[#8F60BF] font-semibold mb-2 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#079DD9] animate-pulse"></span>
                          <span>Thời gian đếm ngược</span>
                        </span>
                        <span className="text-[#079DD9] font-mono font-bold bg-white px-2 py-0.5 rounded-md border border-[#079DD9]/20 shadow-xs">
                          Tuần {countdown.schoolWeek}
                        </span>
                      </div>

                      {/* 4 Light Pastel Number Boxes */}
                      <div className="grid grid-cols-4 gap-2 text-center">
                        <div className="bg-white/95 rounded-xl py-2 px-1 border border-[#E8DEF8] shadow-xs">
                          <span className="text-2xl sm:text-3xl font-extrabold font-mono tabular-nums text-[#8F60BF] block">
                            {String(countdown.days).padStart(2, '0')}
                          </span>
                          <span className="text-[10px] text-slate-500 uppercase font-semibold">Ngày</span>
                        </div>
                        <div className="bg-white/95 rounded-xl py-2 px-1 border border-[#E8DEF8] shadow-xs">
                          <span className="text-2xl sm:text-3xl font-extrabold font-mono tabular-nums text-[#8F60BF] block">
                            {String(countdown.hours).padStart(2, '0')}
                          </span>
                          <span className="text-[10px] text-slate-500 uppercase font-semibold">Giờ</span>
                        </div>
                        <div className="bg-white/95 rounded-xl py-2 px-1 border border-[#E8DEF8] shadow-xs">
                          <span className="text-2xl sm:text-3xl font-extrabold font-mono tabular-nums text-[#8F60BF] block">
                            {String(countdown.minutes).padStart(2, '0')}
                          </span>
                          <span className="text-[10px] text-slate-500 uppercase font-semibold">Phút</span>
                        </div>
                        <div className="bg-white/95 rounded-xl py-2 px-1 border border-[#BAE6FD] shadow-xs">
                          <span className="text-2xl sm:text-3xl font-extrabold font-mono tabular-nums text-[#079DD9] block animate-pulse">
                            {String(countdown.seconds).padStart(2, '0')}
                          </span>
                          <span className="text-[10px] text-[#079DD9] uppercase font-bold">Giây</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-[#EBFBF2] border border-[#86EFAC] rounded-2xl p-3 flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      <div>
                        <span className="text-xs font-bold text-emerald-900 block">
                          Đã hoàn thành kỳ thi này
                        </span>
                        <span className="text-[11px] text-emerald-700">
                          Đã diễn ra: {formatDateTimeVN(exam.examDateTime)}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Exam Details & Metadata */}
                  <div className="space-y-1.5 text-xs text-slate-600 pt-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Calendar className="w-3.5 h-3.5 text-[#8F60BF] shrink-0" />
                      <span>Thời gian:</span>
                      <strong className="text-slate-800 font-mono">
                        {formatDateTimeVN(exam.examDateTime)}
                      </strong>
                      <span className="text-slate-400">({exam.durationMinutes} phút)</span>
                    </div>

                    {exam.room && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-[#079DD9] shrink-0" />
                        <span>Địa điểm:</span>
                        <span className="text-slate-800 font-medium">{exam.room}</span>
                      </div>
                    )}

                    {exam.format && (
                      <div className="flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>Hình thức:</span>
                        <span className="text-slate-800 font-medium">
                          {exam.format}
                        </span>
                      </div>
                    )}

                    {exam.notes && (
                      <div className="p-2.5 bg-purple-50/40 rounded-xl border border-purple-100/70 text-[11px] text-slate-600 mt-2">
                        <span className="font-semibold text-slate-700 block mb-0.5">Nội dung ôn tập & Ghi chú:</span>
                        {exam.notes}
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Card Footer Actions */}
                <div className="px-4 py-2.5 bg-slate-50/70 border-t border-purple-50 flex items-center justify-between gap-2 text-xs">
                  <button
                    onClick={() => onToggleComplete(exam.id)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                      isCompleted
                        ? 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
                        : 'text-emerald-700 hover:text-emerald-800 bg-[#EBFBF2] hover:bg-emerald-100 border border-emerald-200'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{isCompleted ? 'Đặt lại chưa thi' : 'Đánh dấu đã thi'}</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onEditExam(exam)}
                      className="px-2.5 py-1 text-slate-600 hover:text-slate-900 font-medium hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => setExamToDelete(exam)}
                      className="flex items-center gap-1 px-2.5 py-1 text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg font-medium transition-colors cursor-pointer"
                      title="Xóa bài thi này"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Xóa</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* In-App Delete Confirmation Modal */}
      {examToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-purple-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Xác Nhận Xóa Lịch Thi</h3>
                <p className="text-xs text-slate-500">Môn {examToDelete.subjectName} ({examToDelete.subjectCode})</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
              Bạn có chắc chắn muốn xóa bài thi <strong>"{examToDelete.examTitle}"</strong> khỏi danh sách đếm ngược?
            </p>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setExamToDelete(null)}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteExam(examToDelete.id);
                  setExamToDelete(null);
                }}
                className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xác nhận xóa</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
