import React from 'react';
import { X, Clock, Coffee, Sun, Moon } from 'lucide-react';
import { MORNING_SLOTS, AFTERNOON_SLOTS } from '../data/timetableData';

interface TimeSlotGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TimeSlotGuideModal: React.FC<TimeSlotGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 my-8">
        
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Quy Chuẩn Khung Giờ Học Lớp 12A1
              </h3>
              <p className="text-xs text-slate-500">
                Mỗi tiết 45 phút · Nghỉ 5 phút · Ra chơi hồi sức 20 phút sau 2 tiết
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

        <div className="mt-4 space-y-6 max-h-[65vh] overflow-y-auto pr-1">
          
          {/* SÁNG */}
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <Sun className="w-4 h-4 text-amber-500" />
              <h4 className="text-sm font-bold text-slate-900">
                Buổi Sáng — 5 Tiết (Bắt đầu lúc 07:00)
              </h4>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 font-semibold text-slate-700 border-b border-slate-200">
                  <tr>
                    <th className="py-2 px-3">Tiết</th>
                    <th className="py-2 px-3">Thời Gian Học</th>
                    <th className="py-2 px-3">Thời Lượng</th>
                    <th className="py-2 px-3">Giờ Giải Lao Tiếp Theo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {MORNING_SLOTS.map((slot) => (
                    <tr
                      key={`guide-m-${slot.period}`}
                      className={slot.period === 2 ? 'bg-amber-50/40' : ''}
                    >
                      <td className="py-2.5 px-3 font-bold text-slate-900">
                        Tiết {slot.period}
                      </td>
                      <td className="py-2.5 px-3 font-mono font-medium text-slate-700">
                        {slot.startTime} - {slot.endTime}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">45 phút</td>
                      <td className="py-2.5 px-3">
                        {slot.period === 2 ? (
                          <span className="font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded flex items-center gap-1 w-fit">
                            <Coffee className="w-3 h-3" />
                            Nghỉ 20 phút hồi sức (08:35 - 08:55)
                          </span>
                        ) : slot.breakDurationMinutes > 0 ? (
                          <span className="text-slate-600">Nghỉ chuyển tiết 5 phút</span>
                        ) : (
                          <span className="text-slate-400 italic">Hết buổi sáng</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* CHIỀU */}
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <Moon className="w-4 h-4 text-indigo-500" />
              <h4 className="text-sm font-bold text-slate-900">
                Buổi Chiều — 4 Tiết (Bắt đầu lúc 13:30)
              </h4>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 font-semibold text-slate-700 border-b border-slate-200">
                  <tr>
                    <th className="py-2 px-3">Tiết</th>
                    <th className="py-2 px-3">Thời Gian Học</th>
                    <th className="py-2 px-3">Thời Lượng</th>
                    <th className="py-2 px-3">Giờ Giải Lao Tiếp Theo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {AFTERNOON_SLOTS.map((slot) => (
                    <tr
                      key={`guide-a-${slot.period}`}
                      className={slot.period === 2 ? 'bg-amber-50/40' : ''}
                    >
                      <td className="py-2.5 px-3 font-bold text-slate-900">
                        Tiết {slot.period}
                      </td>
                      <td className="py-2.5 px-3 font-mono font-medium text-slate-700">
                        {slot.startTime} - {slot.endTime}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">45 phút</td>
                      <td className="py-2.5 px-3">
                        {slot.period === 2 ? (
                          <span className="font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded flex items-center gap-1 w-fit">
                            <Coffee className="w-3 h-3" />
                            Nghỉ 20 phút hồi sức (15:05 - 15:25)
                          </span>
                        ) : slot.breakDurationMinutes > 0 ? (
                          <span className="text-slate-600">Nghỉ chuyển tiết 5 phút</span>
                        ) : (
                          <span className="text-slate-400 italic">Hết buổi chiều</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs"
          >
            Đã hiểu
          </button>
        </div>

      </div>
    </div>
  );
};
