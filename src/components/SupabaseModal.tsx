import React, { useState } from 'react';
import { Database, Copy, Check, ExternalLink, UploadCloud, DownloadCloud, AlertCircle, X, ShieldCheck, FileDown } from 'lucide-react';
import { testSupabaseConnection, uploadAllToSupabase, fetchAllFromSupabase, SUPABASE_SQL_SCHEMA, getActiveSupabaseUrl, getActiveSupabaseKey } from '../lib/supabase';
import { TimetableCell, Exam } from '../types';

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  cells: TimetableCell[];
  exams: Exam[];
  onDataFetched: (cells: TimetableCell[], exams: Exam[]) => void;
  onConnectionStatusChange: (isConnected: boolean) => void;
  isConnected: boolean;
}

export const SupabaseModal: React.FC<SupabaseModalProps> = ({
  isOpen,
  onClose,
  cells,
  exams,
  onDataFetched,
  onConnectionStatusChange,
  isConnected,
}) => {
  const [url, setUrl] = useState<string>(() => getActiveSupabaseUrl());
  const [anonKey, setAnonKey] = useState<string>(() => getActiveSupabaseKey());
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedSql, setCopiedSql] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleTestAndSave = async () => {
    if (!url.trim() || !anonKey.trim()) {
      setStatusMessage({ type: 'error', text: 'Vui lòng nhập cả Supabase URL và Anon Public Key.' });
      return;
    }

    setIsLoading(true);
    setStatusMessage({ type: 'info', text: 'Đang kiểm tra kết nối tới Supabase...' });

    const cleanUrl = url.trim().replace(/\/$/, '');
    const cleanKey = anonKey.trim();

    const res = await testSupabaseConnection(cleanUrl, cleanKey);
    setIsLoading(false);

    if (res.success) {
      localStorage.setItem('supabase_url', cleanUrl);
      localStorage.setItem('supabase_anon_key', cleanKey);
      onConnectionStatusChange(true);
      setStatusMessage({
        type: 'success',
        text: 'Kết nối Supabase thành công! Hãy nhấn "Đẩy dữ liệu hiện tại lên Supabase" bên dưới để lưu dữ liệu của bạn.',
      });
    } else {
      setStatusMessage({ type: 'error', text: res.message });
      onConnectionStatusChange(false);
    }
  };

  const handleUploadCurrentData = async () => {
    const cleanUrl = url.trim().replace(/\/$/, '');
    const cleanKey = anonKey.trim();

    if (!cleanUrl || !cleanKey) {
      setStatusMessage({ type: 'error', text: 'Vui lòng nhập và kết nối Supabase trước khi đẩy dữ liệu.' });
      return;
    }

    setIsLoading(true);
    setStatusMessage({ type: 'info', text: 'Đang chuyển toàn bộ dữ liệu bạn đã cập nhật lên Supabase...' });

    const res = await uploadAllToSupabase(cells, exams, cleanUrl, cleanKey);
    setIsLoading(false);

    if (res.success) {
      localStorage.setItem('supabase_url', cleanUrl);
      localStorage.setItem('supabase_anon_key', cleanKey);
      onConnectionStatusChange(true);
      setStatusMessage({ type: 'success', text: res.message });
    } else {
      setStatusMessage({ type: 'error', text: res.message });
    }
  };

  const handleFetchData = async () => {
    const cleanUrl = url.trim().replace(/\/$/, '');
    const cleanKey = anonKey.trim();

    if (!cleanUrl || !cleanKey) {
      setStatusMessage({ type: 'error', text: 'Vui lòng nhập thông tin kết nối Supabase.' });
      return;
    }

    setIsLoading(true);
    setStatusMessage({ type: 'info', text: 'Đang tải dữ liệu từ Supabase về...' });

    const res = await fetchAllFromSupabase(cleanUrl, cleanKey);
    setIsLoading(false);

    if (res.success && res.cells && res.exams) {
      onDataFetched(res.cells, res.exams);
      onConnectionStatusChange(true);
      setStatusMessage({ type: 'success', text: res.message });
    } else {
      setStatusMessage({ type: 'error', text: res.message });
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleExportJson = () => {
    const backupData = {
      exportDate: new Date().toISOString(),
      class: '12A1',
      totalCells: cells.length,
      totalExams: exams.length,
      cells,
      exams,
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const downloadUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `backup_tkb_12a1_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(downloadUrl);
  };

  const handleDisconnect = () => {
    localStorage.removeItem('supabase_url');
    localStorage.removeItem('supabase_anon_key');
    setUrl('');
    setAnonKey('');
    onConnectionStatusChange(false);
    setStatusMessage({ type: 'info', text: 'Đã ngắt kết nối với Supabase. Ứng dụng chuyển về lưu cục bộ (LocalStorage).' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <span>Cơ Sở Dữ Liệu Supabase</span>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                  isConnected ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {isConnected ? 'Đang kết nối trực tuyến' : 'Đang lưu LocalStorage'}
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Lưu trữ vĩnh viễn thời khóa biểu & lịch thi trên đám mây PostgreSQL
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

        {/* Status Alert Banner */}
        {statusMessage && (
          <div className={`mt-4 p-3 rounded-xl text-xs flex items-start gap-2 ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
              : statusMessage.type === 'error'
              ? 'bg-rose-50 text-rose-900 border border-rose-200'
              : 'bg-blue-50 text-blue-900 border border-blue-200'
          }`}>
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex-1">{statusMessage.text}</div>
          </div>
        )}

        {/* Content Body */}
        <div className="mt-4 space-y-5 max-h-[60vh] overflow-y-auto pr-1">
          
          {/* Connection inputs */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">
                Thông tin kết nối Supabase
              </span>
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-purple-600 hover:text-purple-800 flex items-center gap-1 font-medium"
              >
                <span>Mở Supabase Dashboard</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Project URL (Vd: https://abcdefghijklm.supabase.co)
              </label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://xyz.supabase.co"
                className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Anon Public Key (eyJhbGciOi...)
              </label>
              <input
                type="password"
                value={anonKey}
                onChange={(e) => setAnonKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleTestAndSave}
                disabled={isLoading}
                className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold shadow-xs disabled:opacity-50 transition-colors"
              >
                {isLoading ? 'Đang kiểm tra...' : 'Kiểm tra & Lưu cấu hình'}
              </button>

              <button
                type="button"
                onClick={handleUploadCurrentData}
                disabled={isLoading}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs disabled:opacity-50 transition-colors"
                title="Chuyển dữ liệu hiện tại bạn đã cập nhật lên Supabase"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Đẩy dữ liệu hiện tại lên Supabase</span>
              </button>

              {isConnected && (
                <>
                  <button
                    type="button"
                    onClick={handleFetchData}
                    disabled={isLoading}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-medium transition-colors"
                  >
                    <DownloadCloud className="w-3.5 h-3.5" />
                    <span>Tải về từ Supabase</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleDisconnect}
                    className="px-3 py-1.5 text-xs text-rose-600 hover:underline"
                  >
                    Ngắt kết nối
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Quick Step by Step Instructions */}
          <div className="p-4 bg-purple-50/60 rounded-xl border border-purple-100 space-y-2 text-xs text-slate-700">
            <h4 className="font-bold text-purple-950 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-purple-700" />
              <span>Hướng Dẫn Thao Tác Với Supabase (4 Bước Cực Nhanh)</span>
            </h4>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-600">
              <li>
                Truy cập <strong>supabase.com</strong> &rarr; Đăng ký/Đăng nhập &rarr; Nhấn <strong>"New project"</strong> (Đặt tên ví dụ: <code>tkb-12a1</code>).
              </li>
              <li>
                Ở thanh bên trái, nhấn vào <strong>"SQL Editor"</strong> &rarr; Bấm <strong>"New query"</strong>.
              </li>
              <li>
                Nhấn nút <strong>"Sao chép mã SQL"</strong> ở khung dưới &rarr; Dán vào SQL Editor &rarr; Bấm nút <strong>"Run"</strong> (xanh lá).
              </li>
              <li>
                Vào <strong>Project Settings (hình bánh răng)</strong> &rarr; <strong>API</strong> &rarr; Copy <strong>Project URL</strong> và <strong>anon key</strong> rồi dán vào 2 ô ở trên.
              </li>
            </ol>
          </div>

          {/* SQL Script block */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">
                Mã SQL tạo bảng trên Supabase (timetable_cells & exams):
              </span>
              <button
                type="button"
                onClick={handleCopySql}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-slate-900 text-white rounded-md hover:bg-slate-800 transition-colors shadow-xs"
              >
                {copiedSql ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Đã sao chép!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Sao chép mã SQL</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-3 bg-slate-900 text-slate-100 rounded-xl text-[11px] font-mono overflow-x-auto max-h-40 leading-relaxed border border-slate-800">
              {SUPABASE_SQL_SCHEMA}
            </pre>
          </div>

          {/* Backup Option */}
          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-slate-800 block">Sao lưu dữ liệu JSON dự phòng</span>
              <span className="text-[11px] text-slate-500">Tải toàn bộ TKB và lịch thi đã cập nhật về máy tính</span>
            </div>
            <button
              type="button"
              onClick={handleExportJson}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg shadow-xs transition-colors shrink-0"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Tải file JSON</span>
            </button>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
          >
            Đóng bảng
          </button>
        </div>

      </div>
    </div>
  );
};
