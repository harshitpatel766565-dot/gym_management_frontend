'use client';

import React, { useState, useEffect } from 'react';
import { adminService } from '@/services/adminService';
import { User, UserRole } from '@/types/user';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/context/ToastContext';
import { formatDate } from '@/lib/utils';
import {
  Users,
  Search,
  UserPlus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Filter,
  Shield,
} from 'lucide-react';

export default function AdminUsersPage() {
  const { success, error } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [isLoading, setIsLoading] = useState(true);

  // Modal State for Create / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'user' as UserRole,
    isActive: true,
  });

  const loadUsers = async () => {
    try {
      const res = await adminService.getUsers();
      setUsers(res.data);
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const openCreateModal = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'user',
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (u: User) => {
    setEditingUser(u);
    setFormData({
      name: u.name,
      email: u.email,
      phone: u.phone,
      role: u.role,
      isActive: u.isActive,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await adminService.updateUser(editingUser.id, formData);
        success('User Updated', `Changes to ${formData.name} saved.`);
      } else {
        await adminService.createUser(formData);
        success('User Created', `Added ${formData.name} to system.`);
      }
      setIsModalOpen(false);
      loadUsers();
    } catch {
      error('Operation Failed', 'Could not save user.');
    }
  };

  const handleDelete = async (userId: string, userName: string) => {
    if (confirm(`Are you sure you want to delete ${userName}?`)) {
      try {
        await adminService.deleteUser(userId);
        success('User Deleted', `${userName} has been removed.`);
        loadUsers();
      } catch {
        error('Error', 'Unable to delete user.');
      }
    }
  };

  const handleToggleStatus = async (user: User) => {
    try {
      await adminService.updateUser(user.id, { isActive: !user.isActive });
      success('Status Changed', `${user.name} is now ${!user.isActive ? 'Active' : 'Inactive'}.`);
      loadUsers();
    } catch {
      error('Error', 'Unable to update status.');
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phone.includes(searchQuery);

    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    const matchesStatus =
      statusFilter === 'All' ||
      (statusFilter === 'Active' && u.isActive) ||
      (statusFilter === 'Inactive' && !u.isActive);

    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black font-heading text-white uppercase tracking-tight">
            User Management &amp; Access Control
          </h1>
          <p className="text-xs text-forge-400 mt-0.5">
            Manage athletes, trainers, and administrators across the IRONFORGE platform.
          </p>
        </div>

        <Button
          onClick={openCreateModal}
          variant="primary"
          size="md"
          leftIcon={<UserPlus className="w-4 h-4" />}
        >
          Add New User
        </Button>
      </div>

      {/* Filter & Search Bar */}
      <Card className="p-5 bg-forge-900 border-forge-800">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            placeholder="Search by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-forge-400" />}
          />

          <Select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            options={[
              { value: 'All', label: 'All Roles' },
              { value: 'user', label: 'Athletes / Members' },
              { value: 'trainer', label: 'Coaches / Trainers' },
              { value: 'admin', label: 'Administrators' },
            ]}
          />

          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'All', label: 'All Statuses' },
              { value: 'Active', label: 'Active Only' },
              { value: 'Inactive', label: 'Inactive / Suspended' },
            ]}
          />
        </div>
      </Card>

      {/* Users Data Table */}
      <Card className="p-0 bg-forge-900 border-forge-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-forge-800 text-forge-400 font-heading uppercase bg-forge-950/60">
                <th className="py-4 px-5 font-bold">User</th>
                <th className="py-4 px-4 font-bold">Contact</th>
                <th className="py-4 px-4 font-bold">Role</th>
                <th className="py-4 px-4 font-bold">Status</th>
                <th className="py-4 px-4 font-bold">Joined Date</th>
                <th className="py-4 px-5 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forge-850">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-forge-800/40 transition-colors">
                  {/* Avatar & Name */}
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <img
                        src={u.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                        alt={u.name}
                        className="w-9 h-9 rounded-full object-cover border border-forge-700"
                      />
                      <div>
                        <p className="font-bold text-white font-heading text-sm">{u.name}</p>
                        <span className="text-[10px] text-forge-400 font-mono">ID: {u.id}</span>
                      </div>
                    </div>
                  </td>

                  {/* Email & Phone */}
                  <td className="py-4 px-4 text-forge-300">
                    <p>{u.email}</p>
                    <span className="text-[10px] text-forge-400">{u.phone}</span>
                  </td>

                  {/* Role */}
                  <td className="py-4 px-4">
                    <Badge variant={u.role === 'admin' ? 'danger' : u.role === 'trainer' ? 'flame' : 'default'}>
                      {u.role}
                    </Badge>
                  </td>

                  {/* Status Toggle */}
                  <td className="py-4 px-4">
                    <button
                      onClick={() => handleToggleStatus(u)}
                      className="cursor-pointer"
                      title="Click to toggle status"
                    >
                      <Badge variant={u.isActive ? 'success' : 'outline'}>
                        {u.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </button>
                  </td>

                  {/* Joined Date */}
                  <td className="py-4 px-4 text-forge-400">{formatDate(u.createdAt)}</td>

                  {/* Action Buttons */}
                  <td className="py-4 px-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(u)}
                        className="p-1.5 rounded-lg bg-forge-800 hover:bg-forge-700 text-forge-300 hover:text-white transition-colors cursor-pointer"
                        title="Edit User"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(u.id, u.name)}
                        className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 transition-colors cursor-pointer"
                        title="Delete User"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* User Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? `Edit ${editingUser.name}` : 'Create New User Profile'}
        description="Configure account credentials and permission roles"
        maxWidth="md"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Full Name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <Input
            label="Email Address"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />

          <Input
            label="Phone Number"
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />

          <Select
            label="Account Role"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
            options={[
              { value: 'user', label: 'Athlete / Member' },
              { value: 'trainer', label: 'Coach / Personal Trainer' },
              { value: 'admin', label: 'System Administrator' },
            ]}
          />

          <div className="pt-2 flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs font-semibold text-white cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="rounded accent-brand-red bg-forge-950"
              />
              <span>Account Active &amp; Allowed Facility Entry</span>
            </label>
          </div>

          <Button
            type="submit"
            size="lg"
            variant="primary"
            className="w-full uppercase font-heading tracking-wider mt-4"
          >
            {editingUser ? 'Save User Changes' : 'Create User Account'}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
