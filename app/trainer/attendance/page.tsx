'use client';

import React, { useState, useEffect } from 'react';
import { attendanceService } from '@/services/attendanceService';
import { trainerService, TrainerMember } from '@/services/trainerService';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/context/ToastContext';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
  Search,
  Plus,
  Edit2,
  Trash2,
  UserCheck,
  XCircle,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function TrainerAttendancePage() {
  const { success, error } = useToast();
  const [records, setRecords] = useState<any[]>([]);
  const [members, setMembers] = useState<TrainerMember[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  // Form Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    memberId: '',
    date: new Date().toISOString().split('T')[0],
    status: 'present' as 'present' | 'absent' | 'late',
    checkInTime: '08:00 AM',
    checkOutTime: '09:30 AM',
    notes: '',
  });

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [attRes, memRes] = await Promise.all([
        attendanceService.getTrainerAttendance(),
        trainerService.getMyMembers(),
      ]);
      setRecords(attRes.data || []);
      setMembers(memRes.data || []);
    } catch (err) {
      console.error('Failed to load trainer attendance:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingRecord(null);
    setFormData({
      memberId: members[0]?._id || '',
      date: new Date().toISOString().split('T')[0],
      status: 'present',
      checkInTime: '08:00 AM',
      checkOutTime: '09:30 AM',
      notes: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (rec: any) => {
    setEditingRecord(rec);
    setFormData({
      memberId: rec.member?._id || rec.member || '',
      date: new Date(rec.date).toISOString().split('T')[0],
      status: rec.status,
      checkInTime: rec.checkInTime || '',
      checkOutTime: rec.checkOutTime || '',
      notes: rec.notes || '',
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingRecord) {
        await attendanceService.updateAttendance(editingRecord._id, formData);
        success('Success', 'Attendance log updated.');
      } else {
        await attendanceService.markAttendance(formData);
        success('Success', 'Attendance log added successfully.');
      }
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      error('Failed', 'Could not record attendance.');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this log?')) {
      try {
        await attendanceService.deleteAttendance(id);
        success('Success', 'Attendance record deleted.');
        loadData();
      } catch (err) {
        error('Failed', 'Unable to delete record.');
      }
    }
  };

  const filtered = records.filter((rec) => {
    const memberName = rec.member?.name || '';
    const matchesSearch = memberName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || rec.status === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  // Calculate high-level attendance metrics
  const total = records.length;
  const presentCount = records.filter(r => r.status === 'present').length;
  const lateCount = records.filter(r => r.status === 'late').length;
  const rate = total > 0 ? Math.round(((presentCount + lateCount) / total) * 100) : 0;

  if (isLoading) {
    return (
      <div className="pt-20 flex items-center justify-center min-h-screen bg-forge-950">
        <LoadingSpinner label="Retrieving floor occupancy logs..." />
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black font-heading uppercase tracking-tight">
            Athlete Attendance Board
          </h1>
          <p className="text-xs text-forge-400 mt-0.5">
            Log, update, and manage check-in logs for your assigned athletes.
          </p>
        </div>

        <Button
          onClick={openCreateModal}
          variant="primary"
          size="md"
          leftIcon={<Plus className="w-4 h-4" />}
          disabled={members.length === 0}
        >
          Mark Attendance
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
        <Card className="p-5 bg-forge-900 border-forge-800">
          <p className="text-xs font-bold uppercase tracking-wider text-forge-400 font-heading">Total Logs</p>
          <p className="text-3xl font-black font-heading text-white mt-2">{total}</p>
        </Card>
        <Card className="p-5 bg-forge-900 border-forge-800">
          <p className="text-xs font-bold uppercase tracking-wider text-forge-400 font-heading">Present Logs</p>
          <p className="text-3xl font-black font-heading text-emerald-400 mt-2">{presentCount}</p>
        </Card>
        <Card className="p-5 bg-forge-900 border-forge-800">
          <p className="text-xs font-bold uppercase tracking-wider text-forge-400 font-heading">Late Logs</p>
          <p className="text-3xl font-black font-heading text-amber-400 mt-2">{lateCount}</p>
        </Card>
        <Card className="p-5 bg-forge-900 border-forge-800">
          <p className="text-xs font-bold uppercase tracking-wider text-forge-400 font-heading">Attendance Rate</p>
          <p className="text-3xl font-black font-heading text-brand-orange mt-2">{rate}%</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-5 bg-forge-900 border-forge-800">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            placeholder="Search member by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-forge-400" />}
          />
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'All', label: 'All Statuses' },
              { value: 'Present', label: 'Present' },
              { value: 'Absent', label: 'Absent' },
              { value: 'Late', label: 'Late' },
            ]}
          />
        </div>
      </Card>

      {/* Table */}
      <Card className="p-0 bg-forge-900 border-forge-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-forge-800 text-forge-400 font-heading uppercase bg-forge-950/60">
                <th className="py-4 px-5 font-bold">Athlete</th>
                <th className="py-4 px-4 font-bold">Date</th>
                <th className="py-4 px-4 font-bold">Check In/Out</th>
                <th className="py-4 px-4 font-bold">Status</th>
                <th className="py-4 px-4 font-bold">Notes</th>
                <th className="py-4 px-5 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forge-850">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-forge-400">
                    No attendance records found.
                  </td>
                </tr>
              ) : (
                filtered.map((rec) => (
                  <tr key={rec._id} className="hover:bg-forge-800/40 transition-colors">
                    <td className="py-4 px-5 font-bold text-white font-heading">{rec.member?.name || 'Unknown'}</td>
                    <td className="py-4 px-4 text-forge-300">{formatDate(rec.date)}</td>
                    <td className="py-4 px-4 text-forge-300 font-mono">
                      {rec.checkInTime || '--'} - {rec.checkOutTime || '--'}
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant={rec.status === 'present' ? 'success' : rec.status === 'late' ? 'warning' : 'outline'}>
                        {rec.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-forge-400 truncate max-w-xs">{rec.notes || '-'}</td>
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(rec)}
                          className="p-1.5 rounded-lg bg-forge-800 hover:bg-forge-700 text-forge-300 hover:text-white transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(rec._id)}
                          className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingRecord ? 'Edit Attendance Log' : 'Mark Attendance Record'}
        description="Verify athlete session checkin details"
        maxWidth="md"
      >
        <form onSubmit={handleSave} className="space-y-4">
          {!editingRecord && (
            <Select
              label="Select Athlete"
              value={formData.memberId}
              onChange={(e) => setFormData({ ...formData, memberId: e.target.value })}
              options={members.map((m) => ({ value: m._id, label: m.name }))}
            />
          )}

          <Input
            label="Date"
            type="date"
            required
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />

          <Select
            label="Attendance Status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
            options={[
              { value: 'present', label: 'Present' },
              { value: 'absent', label: 'Absent' },
              { value: 'late', label: 'Late' },
            ]}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Check In Time"
              placeholder="e.g., 08:00 AM"
              value={formData.checkInTime}
              onChange={(e) => setFormData({ ...formData, checkInTime: e.target.value })}
            />
            <Input
              label="Check Out Time"
              placeholder="e.g., 09:30 AM"
              value={formData.checkOutTime}
              onChange={(e) => setFormData({ ...formData, checkOutTime: e.target.value })}
            />
          </div>

          <Input
            label="Log Notes"
            placeholder="Notes about check-in status..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />

          <Button
            type="submit"
            size="lg"
            variant="primary"
            className="w-full uppercase font-heading tracking-wider mt-4"
          >
            {editingRecord ? 'Update Log' : 'Record Log'}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
