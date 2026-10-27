import React from 'react';
import { X, Users, BookOpen, GraduationCap, Award } from 'lucide-react';
import { SUBJECT_METAS } from '../data/timetableData';

interface TeacherDirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSubject: (code: string) => void;
}

export const TeacherDirectoryModal: React.FC<TeacherDirectoryModalProps> = ({
  isOpen,
  onClose,
  onSelectSubject,
}) => {
  if (!isOpen) return null;

  const teachers = [
    {
      code: 'HOA',
      subject: 'Hóa học & Sinh hoạt lớp (CN)',
      teacher: 'Cô Hạnh H',
      role: 'Giáo viên Chủ nhiệm 12A1',
      periodsCount: '4 tiết Hóa + 1 tiết SHL',
      badge: 'Chủ Nhiệm',
    },
    {
      code: 'TOAN',
      subject: 'Toán học',
      teacher: 'Cô Quyên',
      role: 'Giáo viên bộ môn Toán',
      periodsCount: '4 tiết / tuần',
      badge: 'Môn trọng tâm',
    },
    {
      code: 'VAN',
      subject: 'Ngữ văn',
      teacher: 'Cô Bích',
      role: 'Giáo viên bộ môn Ngữ văn',
      periodsCount: '3 tiết / tuần',
      badge: 'Môn trọng tâm',
    },
    {
      code: 'AV',
      subject: 'Tiếng Anh',
      teacher: 'Cô Trang',
      role: 'Giáo viên bộ môn Tiếng Anh',
      periodsCount: '3 tiết / tuần',
      badge: 'Môn trọng tâm',
    },
    {
      code: 'LY',
      subject: 'Vật lý',
      teacher: 'Cô Nga',
      role: 'Giáo viên bộ môn Vật lý',
      periodsCount: '3 tiết / tuần',
      badge: null,
    },
    {
      code: 'SINH',
      subject: 'Sinh học',
      teacher: 'Thầy Lãm',
      role: 'Giáo viên bộ môn Sinh học',
      periodsCount: '2 tiết / tuần',
      badge: null,
    },
    {
      code: 'SU',
      subject: 'Lịch sử',
      teacher: 'Thầy Toàn',
      role: 'Giáo viên bộ môn Lịch sử',
      periodsCount: '2 tiết / tuần',
      badge: null,
    },
    {
      code: 'TH',
      subject: 'Tin học',
      teacher: 'Thầy Chung',
      role: 'Giáo viên bộ môn Tin học',
      periodsCount: '2 tiết / tuần',
      badge: null,
    },
    {
      code: 'GDQP',
      subject: 'Giáo dục Quốc phòng & An ninh',
      teacher: 'Thầy L.Tùng',
      role: 'Giáo viên GDQP',
      periodsCount: '1 tiết / tuần (Chiều T2)',
      badge: null,
    },
    {
      code: 'TNHN',
      subject: 'Trải nghiệm - Hướng nghiệp',
      teacher: 'Cô Nga',
      role: 'Giáo viên phụ trách TNHN',
      periodsCount: '3 tiết / tuần (Chiều T2 & T5)',
      badge: null,
    },
    {
      code: 'GDTD',
      subject: 'Giáo dục Thể chất (Thể dục)',
      teacher: 'Thầy Gàng',
      role: 'Giáo viên GDTC',
      periodsCount: '2 tiết / tuần (Chiều T5)',
      badge: null,
    },
    {
      code: 'GDĐP',
      subject: 'Giáo dục Địa phương',
      teacher: 'Cô/Thầy Giàu',
      role: 'Giáo viên GDĐP',
      periodsCount: '1 tiết / tuần (Chiều T5)',
      badge: null,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 my-8">
        
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Danh Sách Giáo Viên Bộ Môn
              </h3>
              <p className="text-xs text-slate-500">
                Tập thể lớp 12A1 theo thời khóa biểu
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 max-h-[60vh] overflow-y-auto space-y-2.5 pr-1">
          {teachers.map((item) => {
            const meta = SUBJECT_METAS[item.code];
            return (
              <div
                key={item.code}
                onClick={() => {
                  onSelectSubject(item.code);
                  onClose();
                }}
                className="p-3 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-slate-50/70 transition-all cursor-pointer flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-12 h-10 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 ${meta?.color.badgeBg || 'bg-slate-100'} ${meta?.color.badgeText || 'text-slate-800'}`}>
                    {item.code}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">
                        {item.teacher}
                      </span>
                      {item.badge && (
                        <span className="text-[10px] font-semibold bg-indigo-50 text-indigo-700 px-1.5 py-0.2 rounded">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {item.subject} · <span className="text-slate-400">{item.periodsCount}</span>
                    </div>
                  </div>
                </div>

                <span className="text-xs text-indigo-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Lọc trên TKB &rarr;
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Nhấn vào môn để tô sáng các tiết trên thời khóa biểu</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
};
