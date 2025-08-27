"use client";

import { useMemo, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useLocalStorage } from '@/hooks/use-local-storage';
import { DEFAULT_STUDENTS } from '@/lib/data';
import type { AttendanceRecord, Student } from '@/lib/types';
import { School, TrendingUp } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

export default function ReportsView() {
  const [records] = useLocalStorage<AttendanceRecord[]>('attendanceRecords', []);
  const [students] = useLocalStorage<Student[]>("students", DEFAULT_STUDENTS);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const reportData = useMemo(() => {
    if (!isClient) return { overallPercentage: 0, studentStats: [] };

    const totalPossibleDays = new Set(records.map(r => r.date)).size;
    if (totalPossibleDays === 0) {
      return { overallPercentage: 0, studentStats: [] };
    }

    const totalPresents = records.filter(r => r.status === 'Present').length;
    const totalPossibleAttendances = students.length * totalPossibleDays;
    const overallPercentage = totalPossibleAttendances > 0 ? (totalPresents / totalPossibleAttendances) * 100 : 0;

    const studentStats = students.map(student => {
      const studentRecords = records.filter(r => r.studentId === student.id);
      const presentDays = studentRecords.filter(r => r.status === 'Present').length;
      const percentage = totalPossibleDays > 0 ? (presentDays / totalPossibleDays) * 100 : 0;
      return {
        ...student,
        presentDays,
        totalDays: totalPossibleDays,
        percentage,
      };
    }).sort((a,b) => b.percentage - a.percentage);

    return { overallPercentage, studentStats };
  }, [records, students, isClient]);

  if (!isClient) {
    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(2)].map((_, i) => (
                     <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <Skeleton className="h-4 w-1/2" />
                            <Skeleton className="h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-1/3 mb-1" />
                            <Skeleton className="h-3 w-full" />
                        </CardContent>
                    </Card>
                ))}
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Student Attendance Summary</CardTitle>
                    <CardDescription>Individual attendance rates for all students.</CardDescription>
                </CardHeader>
                <CardContent>
                   <Skeleton className="h-64 w-full" />
                </CardContent>
            </Card>
        </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Attendance</CardTitle>
            <School className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.overallPercentage.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Across all students and days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Recorded Days</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.studentStats[0]?.totalDays || 0}</div>
            <p className="text-xs text-muted-foreground">Days with attendance taken</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student Attendance Summary</CardTitle>
          <CardDescription>Individual attendance rates for all students.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-[200px]'>Student</TableHead>
                  <TableHead>Attendance Rate</TableHead>
                  <TableHead className="text-right">Days Present</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportData.studentStats.length > 0 ? (
                  reportData.studentStats.map(stat => (
                    <TableRow key={stat.id}>
                      <TableCell className="font-medium">{stat.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={stat.percentage} className="w-full max-w-xs" />
                          <span className="text-sm text-muted-foreground">{stat.percentage.toFixed(1)}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{stat.presentDays} / {stat.totalDays}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center">
                      No report data available. Take attendance to generate reports.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
