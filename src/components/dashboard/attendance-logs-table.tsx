"use client";

import { useState, useMemo, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useLocalStorage } from '@/hooks/use-local-storage';
import { DEFAULT_STUDENTS } from '@/lib/data';
import type { AttendanceRecord, Student } from '@/lib/types';
import { format, parseISO } from 'date-fns';
import { Card, CardContent } from '../ui/card';
import { Skeleton } from '../ui/skeleton';

const RECORDS_PER_PAGE = 10;

export default function AttendanceLogsTable() {
  const [records] = useLocalStorage<AttendanceRecord[]>('attendanceRecords', []);
  const [students] = useLocalStorage<Student[]>("students", DEFAULT_STUDENTS);
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [studentFilter, setStudentFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const studentMap = useMemo(() => new Map(students.map(s => [s.id, s.name])), [students]);
  
  const uniqueDates = useMemo(() => {
    const dates = new Set(records.map(r => r.date));
    return Array.from(dates).sort((a, b) => b.localeCompare(a));
  }, [records]);

  const filteredRecords = useMemo(() => {
    return records
      .filter(record => (dateFilter === 'all' || record.date === dateFilter))
      .filter(record => (studentFilter === 'all' || record.studentId === studentFilter))
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [records, dateFilter, studentFilter]);

  const totalPages = Math.ceil(filteredRecords.length / RECORDS_PER_PAGE);
  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * RECORDS_PER_PAGE,
    currentPage * RECORDS_PER_PAGE
  );
  
  useEffect(() => {
    setCurrentPage(1);
  }, [dateFilter, studentFilter]);

  if (!isClient) {
    return (
      <Card>
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <Skeleton className="h-10 w-full sm:w-[180px]" />
            <Skeleton className="h-10 w-full sm:w-[180px]" />
          </div>
          <div className="border rounded-md">
             <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-4 md:p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Dates</SelectItem>
              {uniqueDates.map(date => (
                <SelectItem key={date} value={date}>{format(parseISO(date), 'MMMM d, yyyy')}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={studentFilter} onValueChange={setStudentFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by student" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Students</SelectItem>
              {students.map(student => (
                <SelectItem key={student.id} value={student.id}>{student.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedRecords.length > 0 ? (
                paginatedRecords.map((record, index) => (
                  <TableRow key={`${record.date}-${record.studentId}-${index}`}>
                    <TableCell className="font-medium">{studentMap.get(record.studentId) || 'Unknown'}</TableCell>
                    <TableCell>{format(parseISO(record.date), 'MMMM d, yyyy')}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant={record.status === 'Present' ? 'default' : 'destructive'}
                         className={record.status === 'Present' ? 'bg-green-600/80 hover:bg-green-600' : ''}>
                        {record.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    No attendance records found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
