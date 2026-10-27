import React, { useState, useEffect } from 'react';
import { Exam } from '../types';
import { SUBJECT_METAS } from '../data/timetableData';
import { getSchoolWeek } from '../utils/timeUtils';
import { X, Calendar, Clock, MapPin, FileText, CheckCircle2, Trash2, Sparkles } from 'lucide-react';

interface ExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (examData: Omit<Exam, 'id' | 'createdAt'>, existingId?: string) => void;
  onDelete?: (id: string) => void;
  editingExam?: Exam | null;
  initialSubjectCode?: string;
  initialSubjectName?: string;
}

export const ExamModal: React.FC<ExamModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  editingExam,
  initialSubjectCode,
  initialSubjectName,
}) => {
  const [subjectCode, setSubjectCode] = useState<string>('TOAN');
  const [subjectName, setSubjectName] = useState<string>('Toán học');
  const [customSubject, setCustomSubject] = useState<string>('');
  const [examTitle, setExamTitle] = useState<string>('');
  const [examDateTime, setExamDateTime] = useState<string>('');
  const [durationMinutes, setDurationMinutes] = useState<number>(45);
  const [room, setRoom] = useState<string>('Phòng 12A1');
  const [format, setFormat] = useState<Exam['format']>('Combo TN+ĐS+TLN');
  const [notes, setNotes] = useState<string>('');
  const [error, setError] = useState<string>('');

  // Subject options
  const defaultSubjects = [
    { code: 'TOAN', name: 'Toán học' },
    { code: 'VAN', name: 'Ngữ văn' },
    { code: 'AV', name: 'Tiếng Anh' },
    { code: 'LY', name: 'Vật lý' },
    { code: 'HOA', name: 'Hóa học' },
    { code: 'SINH', name: 'Sinh học' },
    { code: 'SU', name: 'Lịch sử' },
    { code: 'TH', name: 'Tin học' },
    { code: 'GDQP', name: 'GD Quốc phòng' },
    { code: 'TNHN', name: 'Trải nghiệm hướng nghiệp' },
    { code: 'GDTD', name: 'Giáo dục thể chất' },
    { code: 'GDĐP', name: 'Giáo dục địa phương' },
    { code: 'CUSTOM', name: 'Môn khác...' },
  ];

  useEffect(() => {
    if (editingExam) {
      setSubjectCode(editingExam.subjectCode);
      setSubjectName(editingExam.subjectName);
      setExamTitle(editingExam.examTitle);
      try {
        const d = new Date(editingExam.examDateTime);
        const pad = (n: number) => String(n).padStart(2, '0');
        const formatted = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
        setExamDateTime(formatted);
      } catch {
        setExamDateTime('');
      }
      setDurationMinutes(editingExam.durationMinutes || 45);
      setRoom(editingExam.room || 'Phòng 12A1');
      setFormat(editingExam.format || 'Combo TN+ĐS+TLN');
      setNotes(editingExam.notes || '');
    } else {
      // Default to tomorrow 07:30
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(7, 30, 0, 0);
      const pad = (n: number) => String(n).padStart(2, '0');
      const formatted = `${tomorrow.getFullYear()}-${pad(tomorrow.getMonth() + 1)}-${pad(tomorrow.getDate())}T${pad(tomorrow.getHours())}:${pad(tomorrow.getMinutes())}`;

      const targetCode = initialSubjectCode || 'TOAN';
      const targetMeta = SUBJECT_METAS[targetCode];
      setSubjectCode(targetCode);
      setSubjectName(initialSubjectName || targetMeta?.name || 'Toán học');
      setExamTitle('Kiểm tra định kì');
      setExamDateTime(formatted);
      setDurationMinutes(45);
      setRoom('Phòng 12A1');
      setFormat('Combo TN+ĐS+TLN');
      setNotes('');
    }
    setError('');
  }, [editingExam, initialSubjectCode, initialSubjectName, isOpen]);

  if (!isOpen) return null;

  const handleSubjectChange = (val: string) => {
    setSubjectCode(val);
    if (val === 'CUSTOM') {
      setSubjectName(customSubject || 'Môn tự chọn');
    } else {
      const found = defaultSubjects.find((s) => s.code === val);
      setSubjectName(found ? found.name : val);
    }
  };

  const calculatedWeek = examDateTime ? getSchoolWeek(examDateTime) : 8;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!examTitle.trim()) {
      setError('Vui lòng nhập tiêu đề bài thi/kiểm tra');
      return;
    }
    if (!examDateTime) {
      setError('Vui lòng chọn ngày và giờ thi');
      return;
    }

    const finalSubjectCode = subjectCode === 'CUSTOM' ? (customSubject.trim() || 'MON-KHAC') : subjectCode;
    const finalSubjectName = subjectCode === 'CUSTOM' ? (customSubject.trim() || 'Môn khác') : subjectName;

    onSave(
      {
        subjectCode: finalSubjectCode,
        subjectName: finalSubjectName,
        examTitle: examTitle.trim(),
        examDateTime: new Date(examDateTime).toISOString(),
        durationMinutes: Number(durationMinutes) || 45,
        room: room.trim() || undefined,
        format,
        notes: notes.trim() || undefined,
      },
      editingExam?.id
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-purple-200 my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-purple-100">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>{editingExam ? 'Chỉnh Sửa Lịch Thi' : 'Thêm Lịch Thi & Đếm Ngược'}</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                Lớp 12A1
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Hỗ trợ đầy đủ định dạng thi mới Combo TN + ĐS + TLN & tính tuần học
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-3 p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700">
            {error}
          </div>
        )}

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          
          {/* Subject Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Môn Học Thi
            </label>
            <select
              value={subjectCode}
              onChange={(e) => handleSubjectChange(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-purple-500 bg-white"
            >
              {defaultSubjects.map((s) => (
                <option key={s.code} value={s.code}>
                  {s.name} ({s.code})
                </option>
              ))}
            </select>

            {subjectCode === 'CUSTOM' && (
              <input
                type="text"
                placeholder="Nhập tên môn học khác..."
                value={customSubject}
                onChange={(e) => {
                  setCustomSubject(e.target.value);
                  setSubjectName(e.target.value);
                }}
                className="mt-2 w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                required
              />
            )}
          </div>

          {/* Exam Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Tiêu Đề / Loại Kỳ Thi
            </label>
            <input
              type="text"
              value={examTitle}
              onChange={(e) => setExamTitle(e.target.value)}
              placeholder="Ví dụ: Thi Giữa Kì I, Kiểm tra 1 tiết Đại số, Thi Thử Tốt Nghiệp..."
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-purple-500"
              required
            />
            {/* Quick Title Suggestions */}
            <div className="flex flex-wrap gap-1 mt-1.5">
              {['Thi Giữa Kì', 'Thi Cuối Kì', 'Kiểm tra 1 tiết', 'Kiểm tra 15 phút', 'Thi Thử THPT'].map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setExamTitle(t)}
                  className="text-[11px] px-2 py-0.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded transition-colors"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Date & Time Picker + Week Number Display */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-purple-600" />
                  <span>Ngày & Giờ Thi</span>
                </span>
                {examDateTime && (
                  <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded">
                    Tuần {calculatedWeek}
                  </span>
                )}
              </label>
              <input
                type="datetime-local"
                value={examDateTime}
                onChange={(e) => setExamDateTime(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-purple-500 font-mono"
                required
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                👉 Bài thi sẽ diễn ra vào <strong>Tuần {calculatedWeek}</strong> của năm học
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-purple-600" />
                <span>Thời Lượng Làm Bài</span>
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min="5"
                  max="300"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-purple-500 font-mono"
                  required
                />
                <span className="text-xs text-slate-500 font-medium whitespace-nowrap">phút</span>
              </div>
              <div className="flex items-center gap-1 mt-1.5">
                {[15, 45, 50, 60, 90].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setDurationMinutes(mins)}
                    className="text-[10px] px-1.5 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-slate-600"
                  >
                    {mins}p
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Room & Format (Includes requested Combo TN+ĐS+TLN) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span>Phòng Thi / Địa Điểm</span>
              </label>
              <input
                type="text"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                placeholder="Ví dụ: P.12A1, Hội trường..."
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  <span>Hình Thức Thi</span>
                </span>
                <span className="text-[10px] text-purple-700 font-semibold">Chuẩn GDPT</span>
              </label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as Exam['format'])}
                className="w-full px-3 py-2 text-sm border border-purple-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-purple-400 bg-white font-medium text-slate-800"
              >
                <option value="TN 100%">TN 100%</option>
                <option value="Tự luận 100%">Tự luận 100%</option>
                <option value="Combo TN+ĐS">Combo TN+ĐS</option>
                <option value="Combo TN+ĐS+TLN">Combo TN+ĐS+TLN</option>
                <option value="Combo TN+TL">Combo TN+TL</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Nội Dung Trọng Tâm & Dặn Dò
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ghi chú kiến thức cần ôn, vật dụng cần mang theo (máy tính Casio, compa, thước kẻ...)..."
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100">
            {editingExam && onDelete ? (
              <button
                type="button"
                onClick={() => {
                  onDelete(editingExam.id);
                  onClose();
                }}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xóa lịch thi</span>
              </button>
            ) : (
              <div></div>
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#8F60BF] hover:bg-[#7b4ea8] rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{editingExam ? 'Cập nhật lịch thi' : 'Tạo đếm ngược'}</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
