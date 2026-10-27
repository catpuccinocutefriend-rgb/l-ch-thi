import React, { useState, useEffect } from 'react';
import { TimetableCell, Exam } from './types';
import { INITIAL_TIMETABLE, INITIAL_EXAMS } from './data/timetableData';
import { Navbar } from './components/Navbar';
import { CurrentStatusWidget } from './components/CurrentStatusWidget';
import { TimetableGrid } from './components/TimetableGrid';
import { TodayView } from './components/TodayView';
import { ExamCountdownSection } from './components/ExamCountdownSection';
import { ExamModal } from './components/ExamModal';
import { TeacherDirectoryModal } from './components/TeacherDirectoryModal';
import { TimeSlotGuideModal } from './components/TimeSlotGuideModal';
import { SupabaseModal } from './components/SupabaseModal';
import { getSchoolWeek, getWeekDateRangeString } from './utils/timeUtils';
import {
  getSupabaseClient,
  uploadAllToSupabase,
  fetchAllFromSupabase,
  deleteExamFromSupabase,
} from './lib/supabase';
import { Calendar, Clock, BookOpen, AlertCircle, Sparkles, CheckCircle2, Database, Cloud } from 'lucide-react';

export default function App() {
  // Navigation tabs: 'timetable' | 'today' | 'exams'
  const [activeTab, setActiveTab] = useState<'timetable' | 'today' | 'exams'>('timetable');

  // Supabase connection state
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState<boolean>(false);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(true); // Preconfigured with user credentials
  const [needRunSqlSchema, setNeedRunSqlSchema] = useState<boolean>(false);
  const [isSyncingInitial, setIsSyncingInitial] = useState<boolean>(true);

  // Load timetable cells from localStorage or initial
  const [cells, setCells] = useState<TimetableCell[]>(() => {
    try {
      const saved = localStorage.getItem('timetable_cells_12a1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load timetable from storage', e);
    }
    return INITIAL_TIMETABLE;
  });

  // Load exams from localStorage or initial
  const [exams, setExams] = useState<Exam[]>(() => {
    try {
      const saved = localStorage.getItem('timetable_exams_12a1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load exams from storage', e);
    }
    return INITIAL_EXAMS;
  });

  // Highlighted subject for cross-referencing
  const [highlightSubject, setHighlightSubject] = useState<string | null>(null);

  // Modals state
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [prefilledSubject, setPrefilledSubject] = useState<{ code: string; name: string } | null>(null);
  const [isTeachersModalOpen, setIsTeachersModalOpen] = useState(false);
  const [isTimeGuideModalOpen, setIsTimeGuideModalOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Notification / toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Automatic Supabase load on mount (no manual config needed)
  useEffect(() => {
    async function initSupabaseData() {
      setIsSyncingInitial(true);
      try {
        const res = await fetchAllFromSupabase();
        if (res.success && res.cells && res.exams) {
          setIsSupabaseConnected(true);
          setNeedRunSqlSchema(false);
          if (res.cells.length > 0) {
            setCells(res.cells);
            if (res.exams.length > 0) {
              setExams(res.exams);
            }
            showToast('Đã tự động tải dữ liệu trực tuyến từ Supabase');
          } else {
            // Tables exist but are empty -> auto seed with current updated cells & exams!
            await uploadAllToSupabase(cells, exams);
            showToast('Đã tự động lưu dữ liệu lên Supabase thành công');
          }
        } else if (res.tablesExist === false) {
          setIsSupabaseConnected(false);
          setNeedRunSqlSchema(true);
        }
      } catch (err) {
        console.warn('Initial Supabase fetch fallback to local cache', err);
      } finally {
        setIsSyncingInitial(false);
      }
    }

    initSupabaseData();
  }, []);

  // Persist cells & auto-sync to Supabase if connected
  useEffect(() => {
    try {
      localStorage.setItem('timetable_cells_12a1', JSON.stringify(cells));
      if (isSupabaseConnected && !isSyncingInitial) {
        uploadAllToSupabase(cells, exams).catch(console.error);
      }
    } catch (e) {
      console.error('Failed to save timetable to storage', e);
    }
  }, [cells, isSupabaseConnected, isSyncingInitial]);

  // Persist exams & auto-sync to Supabase if connected
  useEffect(() => {
    try {
      localStorage.setItem('timetable_exams_12a1', JSON.stringify(exams));
      if (isSupabaseConnected && !isSyncingInitial) {
        uploadAllToSupabase(cells, exams).catch(console.error);
      }
    } catch (e) {
      console.error('Failed to save exams to storage', e);
    }
  }, [exams, isSupabaseConnected, isSyncingInitial]);

  // Timetable update handlers
  const handleUpdateCell = (updatedCell: TimetableCell) => {
    setCells((prev) =>
      prev.map((c) => (c.id === updatedCell.id ? updatedCell : c))
    );
    showToast('Đã cập nhật tiết học thành công');
  };

  const handleResetTimetable = () => {
    setIsResetConfirmOpen(true);
  };

  const handleConfirmReset = () => {
    setCells(INITIAL_TIMETABLE);
    setIsResetConfirmOpen(false);
    showToast('Đã khôi phục thời khóa biểu gốc 12A1');
  };

  // Exam handlers
  const handleOpenAddExamModal = (subjectCode?: string, subjectName?: string) => {
    setEditingExam(null);
    if (subjectCode && subjectName) {
      setPrefilledSubject({ code: subjectCode, name: subjectName });
    } else {
      setPrefilledSubject(null);
    }
    setIsExamModalOpen(true);
  };

  const handleOpenEditExam = (exam: Exam) => {
    setEditingExam(exam);
    setPrefilledSubject(null);
    setIsExamModalOpen(true);
  };

  const handleSaveExam = (
    examData: Omit<Exam, 'id' | 'createdAt'>,
    existingId?: string
  ) => {
    if (existingId) {
      setExams((prev) =>
        prev.map((e) =>
          e.id === existingId ? { ...e, ...examData } : e
        )
      );
      showToast('Đã cập nhật thông tin bài thi');
    } else {
      const newExam: Exam = {
        id: `exam-${Date.now()}`,
        ...examData,
        isCompleted: false,
        createdAt: new Date().toISOString(),
      };
      setExams((prev) => [newExam, ...prev]);
      showToast('Đã thêm bài thi mới vào đồng hồ đếm ngược');
    }
  };

  const handleDeleteExam = (id: string) => {
    setExams((prev) => prev.filter((e) => e.id !== id));
    deleteExamFromSupabase(id).catch(console.error);
    showToast('Đã xóa bài thi khỏi đồng hồ đếm ngược');
  };

  const handleToggleExamComplete = (id: string) => {
    setExams((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, isCompleted: !e.isCompleted } : e
      )
    );
  };

  // Quick stats
  const totalWeeklyPeriods = cells.filter((c) => Boolean(c.rawText)).length;
  const morningPeriods = cells.filter((c) => c.session === 'morning' && Boolean(c.rawText)).length;
  const afternoonPeriods = cells.filter((c) => c.session === 'afternoon' && Boolean(c.rawText)).length;
  const activeExamsCount = exams.filter((e) => !e.isCompleted).length;
  const currentSchoolWeek = getSchoolWeek(new Date());

  return (
    <div className="min-h-screen text-slate-800 flex flex-col font-sans selection:bg-[#ECD8F2] selection:text-[#8F60BF]">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-xl text-xs font-medium flex items-center gap-2 border border-purple-500/30 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-[#99D9F2]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Primary Top Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddExam={() => handleOpenAddExamModal()}
        onOpenTeachers={() => setIsTeachersModalOpen(true)}
        onOpenTimeGuide={() => setIsTimeGuideModalOpen(true)}
        onOpenSupabase={() => setIsSupabaseModalOpen(true)}
        isSupabaseConnected={isSupabaseConnected}
        examCount={activeExamsCount}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-6">
        
        {/* Real-time Current Period Status Widget */}
        <CurrentStatusWidget
          cells={cells}
          onQuickAddExam={(code, name) => handleOpenAddExamModal(code, name)}
        />

        {/* Notice Banner if SQL script needs running in Supabase */}
        {needRunSqlSchema && (
          <div className="bg-[#ECD8F2]/70 border border-[#BEB6F2] rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-100 text-[#8F60BF] flex items-center justify-center shrink-0">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#8F60BF] block">
                  Dự án Supabase (pcgrpiklpiclgzdahlyj) đã được tích hợp sẵn!
                </span>
                <span className="text-[11px] text-slate-600">
                  Chỉ cần 1 bước cuối: Dán mã SQL vào Supabase SQL Editor và bấm Run để tạo bảng lưu trữ vĩnh viễn.
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setIsSupabaseModalOpen(true)}
                className="px-3.5 py-1.5 text-xs font-semibold bg-[#8F60BF] hover:bg-[#7b4ea8] text-white rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Xem mã SQL & Hướng dẫn &rarr;
              </button>
            </div>
          </div>
        )}

        {/* Hero Context Bar with Pastel Balloon Style */}
        <section className="bg-white/90 backdrop-blur-xs rounded-2xl border border-purple-100/90 shadow-xs p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-[#8F60BF] bg-[#ECD8F2] rounded-full px-2.5 py-0.5 border border-[#BEB6F2]/40">
                Tuần {currentSchoolWeek} ({getWeekDateRangeString(currentSchoolWeek)})
              </span>
              <span className="text-xs text-slate-300">·</span>
              <span className="text-xs font-semibold text-slate-600">
                GVCN: Cô Hạnh H · Lớp 12A1
              </span>
              <span className="text-xs text-slate-300">·</span>
              <button
                onClick={() => setIsSupabaseModalOpen(true)}
                className={`text-[11px] font-semibold flex items-center gap-1 px-2.5 py-0.5 rounded-full transition-colors cursor-pointer ${
                  isSupabaseConnected
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-purple-50 text-[#8F60BF] border border-purple-200 hover:bg-purple-100'
                }`}
              >
                <Database className="w-3 h-3" />
                <span>
                  {isSupabaseConnected
                    ? 'Supabase: Đã kết nối tự động'
                    : 'Supabase: Chờ chạy mã SQL tạo bảng'}
                </span>
              </button>
            </div>

            <h1 className="text-lg sm:text-xl font-bold text-slate-900 mt-1.5 flex items-center gap-2">
              <span>Thời Khóa Biểu & Kế Hoạch Ôn Thi Lớp 12A1</span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Sáng 07:00 (5 tiết) · Chiều 13:30 (4 tiết) · Mỗi tiết 45p · Nghỉ ra chơi 20p hồi sức · Tự động đồng bộ Supabase
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-4 text-xs shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-purple-100">
            <div className="text-center sm:text-right">
              <span className="text-[11px] text-slate-400 block">Số tiết / tuần</span>
              <strong className="text-slate-900 font-mono text-sm">
                {totalWeeklyPeriods} tiết
              </strong>
              <span className="text-[10px] text-slate-500 block">({morningPeriods} sáng · {afternoonPeriods} chiều)</span>
            </div>

            <div className="w-px h-8 bg-purple-100 hidden sm:block"></div>

            <div className="text-center sm:text-right">
              <span className="text-[11px] text-slate-400 block">Kỳ thi sắp tới</span>
              <strong className="text-[#079DD9] font-mono text-sm">
                {activeExamsCount} môn
              </strong>
              <button
                onClick={() => setActiveTab('exams')}
                className="text-[10px] text-[#8F60BF] hover:underline block cursor-pointer font-medium"
              >
                Xem đếm ngược &rarr;
              </button>
            </div>
          </div>
        </section>

        {/* Tab Content Display */}
        {activeTab === 'timetable' && (
          <TimetableGrid
            cells={cells}
            onUpdateCell={handleUpdateCell}
            onResetTimetable={handleResetTimetable}
            onAddExamForSubject={(code, name) => handleOpenAddExamModal(code, name)}
            highlightSubject={highlightSubject}
            setHighlightSubject={setHighlightSubject}
          />
        )}

        {activeTab === 'today' && (
          <TodayView
            cells={cells}
            exams={exams}
            onAddExamForSubject={(code, name) => handleOpenAddExamModal(code, name)}
          />
        )}

        {activeTab === 'exams' && (
          <ExamCountdownSection
            exams={exams}
            onOpenAddModal={() => handleOpenAddExamModal()}
            onEditExam={handleOpenEditExam}
            onDeleteExam={handleDeleteExam}
            onToggleComplete={handleToggleExamComplete}
          />
        )}

      </main>

      {/* Clean Footer */}
      <footer className="border-t border-purple-100 bg-white/80 py-5 text-xs text-slate-500 no-print mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p>
            Thời khóa biểu lớp 12A1 · Hiện tại đang là <strong>Tuần {currentSchoolWeek}</strong>.
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSupabaseModalOpen(true)}
              className="text-[#8F60BF] hover:text-[#7b4ea8] font-medium transition-colors cursor-pointer flex items-center gap-1"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Cơ sở dữ liệu Supabase</span>
            </button>
            <span>·</span>
            <button
              onClick={() => setIsTimeGuideModalOpen(true)}
              className="hover:text-slate-800 transition-colors cursor-pointer"
            >
              Quy chuẩn giờ học
            </button>
            <span>·</span>
            <button
              onClick={() => setIsTeachersModalOpen(true)}
              className="hover:text-slate-800 transition-colors cursor-pointer"
            >
              Giáo viên 12A1
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ExamModal
        isOpen={isExamModalOpen}
        onClose={() => {
          setIsExamModalOpen(false);
          setEditingExam(null);
          setPrefilledSubject(null);
        }}
        onSave={handleSaveExam}
        onDelete={handleDeleteExam}
        editingExam={editingExam}
        initialSubjectCode={prefilledSubject?.code}
        initialSubjectName={prefilledSubject?.name}
      />

      <TeacherDirectoryModal
        isOpen={isTeachersModalOpen}
        onClose={() => setIsTeachersModalOpen(false)}
        onSelectSubject={(code) => {
          setHighlightSubject(code);
          setActiveTab('timetable');
        }}
      />

      <TimeSlotGuideModal
        isOpen={isTimeGuideModalOpen}
        onClose={() => setIsTimeGuideModalOpen(false)}
      />

      <SupabaseModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
        cells={cells}
        exams={exams}
        onDataFetched={(newCells, newExams) => {
          setCells(newCells);
          setExams(newExams);
          setIsSupabaseConnected(true);
          setNeedRunSqlSchema(false);
          showToast('Đã nạp dữ liệu mới nhất từ Supabase');
        }}
        onConnectionStatusChange={(connected) => {
          setIsSupabaseConnected(connected);
          if (connected) setNeedRunSqlSchema(false);
        }}
        isConnected={isSupabaseConnected}
      />

      {/* Reset Timetable In-App Confirmation Modal */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-purple-200">
            <h3 className="text-sm font-bold text-slate-900 mb-2">Khôi Phục Thời Khóa Biểu Gốc?</h3>
            <p className="text-xs text-slate-600 mb-4 bg-purple-50/50 p-2.5 rounded-xl border border-purple-100">
              Bạn có chắc chắn muốn đặt lại tất cả các tiết về đúng thời khóa biểu gốc của lớp 12A1 từ ảnh chụp?
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-[#8F60BF] hover:bg-[#7b4ea8] rounded-xl shadow-xs cursor-pointer"
              >
                Xác nhận khôi phục
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
