export type AttendanceStatus = 'present' | 'absent' | 'holiday' | 'late';

export interface AttendanceRecord {
  id: string;
  userId?: string;
  userName?: string;
  memberName?: string;
  date?: string; // YYYY-MM-DD
  status: AttendanceStatus;
  checkInTime?: string; // HH:mm AM/PM or ISO date string
  checkOutTime?: string;
  durationMinutes?: number;
  entryMethod?: 'QR_CODE' | 'BIOMETRIC' | 'MANUAL_DESK' | 'CARD_TAP';
}

export interface AttendanceMonthlySummary {
  year: number;
  month: number;
  totalDays: number;
  presentCount: number;
  absentCount: number;
  holidayCount: number;
  attendancePercentage: number;
  currentStreakDays: number;
  longestStreakDays: number;
  records: AttendanceRecord[];
}
