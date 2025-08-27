export interface Student {
  id: string;
  name: string;
}

export interface AttendanceRecord {
  date: string; // ISO string for date
  studentId: string;
  status: 'Present' | 'Absent';
}
