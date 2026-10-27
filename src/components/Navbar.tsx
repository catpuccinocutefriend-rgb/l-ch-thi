import React from 'react';
import { Calendar, Clock, Plus, Users, Info, Printer, Database } from 'lucide-react';

interface NavbarProps {
  activeTab: 'timetable' | 'exams' | 'today';
  setActiveTab: (tab: 'timetable' | 'exams' | 'today') => void;
  onOpenAddExam: () => void;
  onOpenTeachers: () => void;
  onOpenTimeGuide: () => void;
  onOpenSupabase: () => void;
  isSupabaseConnected: boolean;
  examCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAddExam,
  onOpenTeachers,
  onOpenTimeGuide,
  onOpenSupabase,
  isSupabaseConnected,
  examCount,
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-purple-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Zone 1: Single text element wordmark with balloon color touch */}
          <div className="flex items-center gap-2.5 shrink-0">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#8F60BF] to-[#079DD9] flex items-center justify-center text-white font-bold text-sm shadow-xs">
              12A1
            </span>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap leading-tight">
                Thời Khóa Biểu & Lịch Thi
              </span>
              <span className="text-[10px] text-purple-700 font-semibold hidden sm:inline">
                Tuần 8 · Niên khóa 2026-2027
              </span>
            </div>
          </div>

          {/* Zone 2: 4-5 single-line clean navigation links */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('timetable')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'timetable'
                  ? 'bg-[#ECD8F2] text-[#8F60BF] font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Thời Khóa Biểu Tuần</span>
            </button>

            <button
              onClick={() => setActiveTab('today')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'today'
                  ? 'bg-[#ECD8F2] text-[#8F60BF] font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Hôm Nay</span>
            </button>

            <button
              onClick={() => setActiveTab('exams')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'exams'
                  ? 'bg-[#ECD8F2] text-[#8F60BF] font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <span>Đếm Ngược Lịch Thi</span>
              {examCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 text-[11px] font-semibold bg-[#99D9F2]/70 text-[#079DD9] rounded-md">
                  {examCount}
                </span>
              )}
            </button>

            <button
              onClick={onOpenTimeGuide}
              className="flex items-center gap-1 px-2.5 py-2 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              title="Quy ước giờ học sáng chiều"
            >
              <Info className="w-4 h-4" />
              <span>Khung Giờ</span>
            </button>

            <button
              onClick={onOpenTeachers}
              className="flex items-center gap-1 px-2.5 py-2 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              title="Danh sách giáo viên bộ môn"
            >
              <Users className="w-4 h-4" />
              <span>Giáo Viên</span>
            </button>
          </nav>

          {/* Zone 3: Action Buttons (Supabase Sync + Print + Add Exam) */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Supabase Connection status button */}
            <button
              onClick={onOpenSupabase}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                isSupabaseConnected
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                  : 'bg-purple-50 text-[#8F60BF] border-purple-200 hover:bg-purple-100'
              }`}
              title="Cơ sở dữ liệu Supabase"
            >
              <Database className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {isSupabaseConnected ? 'Supabase: Đã kết nối' : 'Đồng bộ Supabase'}
              </span>
              <span className="sm:hidden">DB</span>
            </button>

            <button
              onClick={handlePrint}
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              title="In thời khóa biểu"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>In TKB</span>
            </button>

            <button
              onClick={onOpenAddExam}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-[#8F60BF] hover:bg-[#7b4ea8] rounded-xl transition-colors shadow-xs whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Lịch Thi</span>
            </button>
          </div>

        </div>

        {/* Mobile Sub Navigation bar */}
        <div className="flex md:hidden items-center justify-between border-t border-purple-100 py-2 gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('timetable')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap ${
              activeTab === 'timetable' ? 'bg-[#8F60BF] text-white font-semibold' : 'text-slate-600 bg-white'
            }`}
          >
            Thời Khóa Biểu
          </button>
          <button
            onClick={() => setActiveTab('today')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap ${
              activeTab === 'today' ? 'bg-[#8F60BF] text-white font-semibold' : 'text-slate-600 bg-white'
            }`}
          >
            Hôm Nay
          </button>
          <button
            onClick={() => setActiveTab('exams')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap ${
              activeTab === 'exams' ? 'bg-[#8F60BF] text-white font-semibold' : 'text-slate-600 bg-white'
            }`}
          >
            Lịch Thi ({examCount})
          </button>
          <button
            onClick={onOpenSupabase}
            className="px-2.5 py-1.5 text-xs font-medium text-[#8F60BF] bg-purple-50 rounded-lg whitespace-nowrap"
          >
            Supabase
          </button>
          <button
            onClick={onOpenTimeGuide}
            className="px-2.5 py-1.5 text-xs font-medium text-slate-600 bg-white rounded-lg whitespace-nowrap"
          >
            Khung Giờ
          </button>
        </div>
      </div>
    </header>
  );
};
