'use client';

import React, { useState, useEffect } from 'react';
import { adminService } from '@/services/adminService';
import { AttendanceRecord } from '@/types/attendance';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { formatDate } from '@/lib/utils';
import { Clock, Search, QrCode, CheckCircle2, User } from 'lucide-react';

export default function AdminAttendancePage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const res = await adminService.getAllAttendance();
        setRecords(res.data);
      } catch {
        // Fallback
      }
    }
    loadData();
  }, []);

  const filtered = records.filter(
    (r) =>
      (r.userName || r.memberName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.date || r.checkInTime || '').includes(searchQuery)
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black font-heading text-white uppercase tracking-tight">
            Live Gym Floor Attendance Log
          </h1>
          <p className="text-xs text-forge-400 mt-0.5">
            Real-time check-ins, entry method authentication, and member turnaround times.
          </p>
        </div>

        <Input
          placeholder="Filter by member or date..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-xs"
          leftIcon={<Search className="w-4 h-4" />}
        />
      </div>

      <Card className="p-0 bg-forge-900 border-forge-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-forge-800 text-forge-400 font-heading uppercase bg-forge-950/60">
                <th className="py-4 px-5 font-bold">Member</th>
                <th className="py-4 px-4 font-bold">Date</th>
                <th className="py-4 px-4 font-bold">Status</th>
                <th className="py-4 px-4 font-bold">Check-In Time</th>
                <th className="py-4 px-4 font-bold">Duration</th>
                <th className="py-4 px-5 font-bold text-right">Access Method</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forge-850">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-forge-800/40 transition-colors">
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-brand-orange" />
                      <span className="font-bold text-white font-heading">{r.userName || r.memberName || 'Alex Johnson'}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-forge-300">{formatDate(r.date || r.checkInTime || '')}</td>
                  <td className="py-4 px-4">
                    <Badge variant={r.status === 'present' ? 'success' : r.status === 'holiday' ? 'warning' : 'danger'}>
                      {r.status}
                    </Badge>
                  </td>
                  <td className="py-4 px-4 font-mono text-emerald-400">{r.checkInTime || '—'}</td>
                  <td className="py-4 px-4 text-forge-400">{r.durationMinutes ? `${r.durationMinutes} mins` : '—'}</td>
                  <td className="py-4 px-5 text-right font-mono text-[11px] text-forge-400">
                    {r.entryMethod || 'QR_CODE'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
