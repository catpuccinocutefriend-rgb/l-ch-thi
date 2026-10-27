import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { TimetableCell, Exam } from '../types';

export const DEFAULT_SUPABASE_URL = 'https://pcgrpiklpiclgzdahlyj.supabase.co';
export const DEFAULT_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjZ3JwaWtscGljbGd6ZGFobHlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMxMTIyNDAsImV4cCI6MjEwODY4ODI0MH0.0c_f3apew6hPBxGpxRPYf93N7P73zNKz96Ymo27hSHw';

let cachedClient: SupabaseClient | null = null;
let currentConfig: { url: string; anonKey: string } | null = null;

export const SUPABASE_SQL_SCHEMA = `-- ============================================================
-- SCRIPT TẠO BẢNG CƠ SỞ DỮ LIỆU THỜI KHÓA BIỂU & LỊCH THI 12A1
-- Dán script này vào SQL Editor trong Supabase Dashboard rồi bấm RUN
-- ============================================================

-- 1. Bảng lưu các tiết học của Thời khóa biểu
CREATE TABLE IF NOT EXISTS timetable_cells (
  id TEXT PRIMARY KEY,
  day INTEGER NOT NULL,
  session TEXT NOT NULL,
  period INTEGER NOT NULL,
  raw_text TEXT,
  subject_code TEXT,
  subject_name TEXT,
  teacher TEXT,
  room TEXT,
  notes TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Bảng lưu danh sách Lịch thi & Đếm ngược
CREATE TABLE IF NOT EXISTS exams (
  id TEXT PRIMARY KEY,
  subject_code TEXT NOT NULL,
  subject_name TEXT NOT NULL,
  exam_title TEXT NOT NULL,
  exam_date_time TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER DEFAULT 45 NOT NULL,
  room TEXT,
  format TEXT,
  notes TEXT,
  is_completed BOOLEAN DEFAULT false,
  score NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Bật Row Level Security (RLS) & cấp quyền đọc/ghi công khai cho Applet
ALTER TABLE timetable_cells ENABLE ROW LEVEL SECURITY;
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read-write for timetable_cells" ON timetable_cells;
CREATE POLICY "Allow public read-write for timetable_cells" 
ON timetable_cells FOR ALL 
USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read-write for exams" ON exams;
CREATE POLICY "Allow public read-write for exams" 
ON exams FOR ALL 
USING (true) WITH CHECK (true);
`;

export function getActiveSupabaseUrl(): string {
  return localStorage.getItem('supabase_url') || (import.meta.env.VITE_SUPABASE_URL as string) || DEFAULT_SUPABASE_URL;
}

export function getActiveSupabaseKey(): string {
  return localStorage.getItem('supabase_anon_key') || (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || DEFAULT_SUPABASE_ANON_KEY;
}

export function getSupabaseClient(customUrl?: string, customKey?: string): SupabaseClient | null {
  const targetUrl = (customUrl || getActiveSupabaseUrl()).trim().replace(/\/$/, '');
  const targetKey = (customKey || getActiveSupabaseKey()).trim();

  if (!targetUrl || !targetKey) {
    return null;
  }

  if (
    cachedClient &&
    currentConfig &&
    currentConfig.url === targetUrl &&
    currentConfig.anonKey === targetKey
  ) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(targetUrl, targetKey);
    currentConfig = { url: targetUrl, anonKey: targetKey };
    return cachedClient;
  } catch (err) {
    console.error('Failed to create Supabase client:', err);
    return null;
  }
}

export async function checkDatabaseState(): Promise<{
  connected: boolean;
  tablesExist: boolean;
  message: string;
}> {
  const client = getSupabaseClient();
  if (!client) {
    return { connected: false, tablesExist: false, message: 'Chưa khởi tạo cấu hình Supabase.' };
  }

  try {
    const { error } = await client.from('timetable_cells').select('count', { count: 'exact', head: true });
    if (error) {
      if (error.code === '42P01' || error.code === 'PGRST205') {
        return {
          connected: true,
          tablesExist: false,
          message: 'Đã kết nối với dự án Supabase, nhưng chưa tạo bảng dữ liệu.',
        };
      }
      return { connected: false, tablesExist: false, message: `Lỗi kết nối Supabase: ${error.message}` };
    }
    return { connected: true, tablesExist: true, message: 'Cơ sở dữ liệu Supabase đang hoạt động bình thường.' };
  } catch (err: any) {
    return { connected: false, tablesExist: false, message: `Không thể kết nối: ${err.message || err}` };
  }
}

export async function testSupabaseConnection(url: string, key: string): Promise<{ success: boolean; message: string; tablesExist: boolean }> {
  try {
    const cleanUrl = url.trim().replace(/\/$/, '');
    const cleanKey = key.trim();
    const client = createClient(cleanUrl, cleanKey);

    const { error } = await client.from('timetable_cells').select('count', { count: 'exact', head: true });
    if (error) {
      if (error.code === '42P01' || error.code === 'PGRST205') {
        return {
          success: true,
          tablesExist: false,
          message: 'Kết nối dự án thành công! Tuy nhiên bạn cần copy mã SQL dán vào SQL Editor trên Supabase để tạo 2 bảng.',
        };
      }
      return { success: false, tablesExist: false, message: `Lỗi kết nối: ${error.message}` };
    }
    return { success: true, tablesExist: true, message: 'Kết nối Supabase thành công! Dữ liệu đã sẵn sàng.' };
  } catch (err: any) {
    return { success: false, tablesExist: false, message: `Lỗi mạng hoặc URL: ${err.message || err}` };
  }
}

export async function uploadAllToSupabase(
  cells: TimetableCell[],
  exams: Exam[],
  url?: string,
  anonKey?: string
): Promise<{ success: boolean; message: string }> {
  const client = getSupabaseClient(url, anonKey);
  if (!client) {
    return { success: false, message: 'Chưa cấu hình Supabase URL và Anon Key.' };
  }

  try {
    // 1. Upload timetable cells (upsert)
    const formattedCells = cells.map((c) => ({
      id: c.id,
      day: c.day,
      session: c.session,
      period: c.period,
      raw_text: c.rawText,
      subject_code: c.subjectCode,
      subject_name: c.subjectName,
      teacher: c.teacher,
      room: c.room || null,
      notes: c.notes || null,
      updated_at: new Date().toISOString(),
    }));

    const { error: cellsError } = await client
      .from('timetable_cells')
      .upsert(formattedCells, { onConflict: 'id' });

    if (cellsError) {
      if (cellsError.code === 'PGRST205' || cellsError.code === '42P01') {
        return {
          success: false,
          message: 'Chưa tìm thấy bảng "timetable_cells" trên Supabase. Vui lòng bấm vào "Sao chép mã SQL" và chạy trong Supabase SQL Editor.',
        };
      }
      throw new Error(`Lỗi lưu thời khóa biểu lên Supabase: ${cellsError.message}`);
    }

    // 2. Upload exams (upsert)
    const formattedExams = exams.map((e) => ({
      id: e.id,
      subject_code: e.subjectCode,
      subject_name: e.subjectName,
      exam_title: e.examTitle,
      exam_date_time: e.examDateTime,
      duration_minutes: e.durationMinutes,
      room: e.room || null,
      format: e.format || null,
      notes: e.notes || null,
      is_completed: Boolean(e.isCompleted),
      score: e.score !== undefined ? e.score : null,
      created_at: e.createdAt || new Date().toISOString(),
    }));

    const { error: examsError } = await client
      .from('exams')
      .upsert(formattedExams, { onConflict: 'id' });

    if (examsError) {
      if (examsError.code === 'PGRST205' || examsError.code === '42P01') {
        return {
          success: false,
          message: 'Chưa tìm thấy bảng "exams" trên Supabase. Vui lòng chạy mã SQL trong Supabase SQL Editor.',
        };
      }
      throw new Error(`Lỗi lưu lịch thi lên Supabase: ${examsError.message}`);
    }

    return {
      success: true,
      message: `Đã lưu toàn bộ ${cells.length} tiết học và ${exams.length} bài thi lên Supabase thành công!`,
    };
  } catch (err: any) {
    return { success: false, message: err.message || 'Lỗi đồng bộ dữ liệu lên Supabase.' };
  }
}

export async function fetchAllFromSupabase(
  url?: string,
  anonKey?: string
): Promise<{ success: boolean; cells?: TimetableCell[]; exams?: Exam[]; tablesExist?: boolean; message: string }> {
  const client = getSupabaseClient(url, anonKey);
  if (!client) {
    return { success: false, message: 'Chưa cấu hình Supabase URL và Anon Key.' };
  }

  try {
    const { data: cellsData, error: cellsError } = await client
      .from('timetable_cells')
      .select('*')
      .order('day')
      .order('period');

    if (cellsError) {
      if (cellsError.code === 'PGRST205' || cellsError.code === '42P01') {
        return {
          success: false,
          tablesExist: false,
          message: 'Bảng dữ liệu chưa được tạo trên Supabase. Hãy chạy script SQL trên Supabase Dashboard.',
        };
      }
      throw new Error(`Không thể lấy thời khóa biểu từ Supabase: ${cellsError.message}`);
    }

    const { data: examsData, error: examsError } = await client
      .from('exams')
      .select('*')
      .order('exam_date_time', { ascending: true });

    if (examsError) {
      throw new Error(`Không thể lấy lịch thi từ Supabase: ${examsError.message}`);
    }

    const cells: TimetableCell[] = (cellsData || []).map((row: any) => ({
      id: row.id,
      day: row.day,
      session: row.session,
      period: row.period,
      rawText: row.raw_text || '',
      subjectCode: row.subject_code || '',
      subjectName: row.subject_name || '',
      teacher: row.teacher || '',
      room: row.room || undefined,
      notes: row.notes || undefined,
    }));

    const exams: Exam[] = (examsData || []).map((row: any) => ({
      id: row.id,
      subjectCode: row.subject_code,
      subjectName: row.subject_name,
      examTitle: row.exam_title,
      examDateTime: row.exam_date_time,
      durationMinutes: row.duration_minutes,
      room: row.room || undefined,
      format: row.format || undefined,
      notes: row.notes || undefined,
      isCompleted: row.is_completed,
      score: row.score,
      createdAt: row.created_at,
    }));

    return {
      success: true,
      tablesExist: true,
      cells,
      exams,
      message: `Đã tải về ${cells.length} tiết học và ${exams.length} bài thi từ Supabase!`,
    };
  } catch (err: any) {
    return { success: false, message: err.message || 'Lỗi tải dữ liệu từ Supabase.' };
  }
}

export async function deleteExamFromSupabase(examId: string): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;
  try {
    const { error } = await client.from('exams').delete().eq('id', examId);
    return !error;
  } catch {
    return false;
  }
}
