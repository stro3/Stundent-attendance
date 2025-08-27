"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Users, UserCheck, UserX, Percent } from 'lucide-react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { DEFAULT_STUDENTS } from '@/lib/data';
import type { AttendanceRecord, Student } from '@/lib/types';
import { format, subDays } from 'date-fns';

export default function DashboardPage() {
  const [attendanceRecords] = useLocalStorage<AttendanceRecord[]>('attendanceRecords', []);
  const [students] = useLocalStorage<Student[]>('students', DEFAULT_STUDENTS);
  const [todayStats, setTodayStats] = useState({ present: 0, absent: 0 });
  const [weekData, setWeekData] = useState<any[]>([]);

  useEffect(() => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const todayRecords = attendanceRecords.filter(rec => rec.date === today);
    const present = todayRecords.filter(r => r.status === 'Present').length;
    const absent = students.length - present;
    setTodayStats({ present, absent });

    const last7Days = Array.from({ length: 7 }, (_, i) => subDays(new Date(), i)).reverse();
    const chartData = last7Days.map(day => {
      const dateStr = format(day, 'yyyy-MM-dd');
      const dayRecords = attendanceRecords.filter(rec => rec.date === dateStr);
      const presentCount = dayRecords.filter(r => r.status === 'Present').length;
      return {
        name: format(day, 'EEE'),
        date: format(day, 'MMM d'),
        present: presentCount,
        absent: students.length - presentCount,
      };
    });
    setWeekData(chartData);

  }, [attendanceRecords, students]);

  const totalStudents = students.length;
  const attendancePercentage = totalStudents > 0 ? (todayStats.present / totalStudents) * 100 : 0;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Dashboard</h1>
        <p className="text-muted-foreground">Overview of school attendance.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">Total enrolled students</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Present Today</CardTitle>
            <UserCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayStats.present}</div>
            <p className="text-xs text-muted-foreground">Students marked as present</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Absent Today</CardTitle>
            <UserX className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayStats.absent}</div>
            <p className="text-xs text-muted-foreground">Students not present</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendancePercentage.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">For today's attendance</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Attendance</CardTitle>
            <CardDescription>Attendance trends for the last 7 days.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] w-full">
            <ResponsiveContainer>
              <BarChart data={weekData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    borderColor: 'hsl(var(--border))',
                  }}
                />
                <Bar dataKey="present" fill="hsl(var(--primary))" name="Present" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Get started with your daily tasks.</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col justify-center gap-4">
            <Link href="/dashboard/attendance" passHref>
              <Button size="lg" className="w-full">
                Take Today&apos;s Attendance <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/dashboard/logs" passHref>
              <Button size="lg" variant="secondary" className="w-full">
                View Attendance Logs
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
