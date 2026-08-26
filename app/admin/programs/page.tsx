'use client';

import React, { useState, useEffect } from 'react';
import { INITIAL_PROGRAMS } from '@/services/mockData';
import { Program } from '@/types/workout';
import { adminService } from '@/services/adminService';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/context/ToastContext';
import { Dumbbell, PlusCircle, Clock, Users, Star, Trash2 } from 'lucide-react';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

export default function AdminProgramsPage() {
  const { success, error } = useToast();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    durationWeeks: 8,
    sessionsPerWeek: 4,
    trainerName: 'Marcus Vance',
    difficulty: 'Intermediate' as const,
    shortDescription: '',
  });

  const loadPrograms = async () => {
    try {
      setIsLoading(true);
      const res = await adminService.getPrograms();
      if (res.success && res.data) {
        setPrograms(res.data);
      } else {
        setPrograms(INITIAL_PROGRAMS);
      }
    } catch {
      setPrograms(INITIAL_PROGRAMS);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPrograms();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newProgData = {
        title: formData.title,
        shortDescription: formData.shortDescription,
        fullDescription: formData.shortDescription,
        imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
        difficulty: formData.difficulty,
        durationWeeks: formData.durationWeeks,
        sessionsPerWeek: formData.sessionsPerWeek,
        estimatedCaloriesPerSession: 500,
        trainerName: formData.trainerName,
        trainerAvatar: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=300',
        trainerId: 'trn-1',
        equipment: ['Barbells', 'Dumbbells'],
      };

      const res = await adminService.createProgram(newProgData);
      if (res.success) {
        success('Program Added', `Created ${formData.title}`);
        setIsModalOpen(false);
        setFormData({
          title: '',
          durationWeeks: 8,
          sessionsPerWeek: 4,
          trainerName: 'Marcus Vance',
          difficulty: 'Intermediate' as const,
          shortDescription: '',
        });
        loadPrograms();
      } else {
        error('Error', res.message || 'Unable to add program.');
      }
    } catch (err: any) {
      error('Error', err?.message || 'Unable to add program.');
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this training program?');
    if (!confirmed) return;
    try {
      const res = await adminService.deleteProgram(id);
      if (res.success) {
        success('Program Deleted', 'The training program was removed.');
        loadPrograms();
      } else {
        error('Error', res.message || 'Unable to delete program.');
      }
    } catch (err: any) {
      error('Error', err?.message || 'Unable to delete program.');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black font-heading text-white uppercase tracking-tight">
            Training Programs Catalog
          </h1>
          <p className="text-xs text-forge-400 mt-0.5">
            Create, update curriculum, and assign lead coaches to training tracks.
          </p>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          variant="primary"
          size="md"
          leftIcon={<PlusCircle className="w-4 h-4" />}
        >
          New Program
        </Button>
      </div>

      {isLoading ? (
        <div className="pt-10 flex items-center justify-center">
          <LoadingSpinner label="Loading Training Programs..." />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((p) => {
            const programId = p.id || (p as any)._id;
            return (
              <Card key={programId} className="p-6 bg-forge-900 border-forge-800 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant={p.difficulty === 'Advanced' ? 'danger' : 'warning'}>
                      {p.difficulty}
                    </Badge>
                    <span className="text-xs text-amber-400 font-bold">★ {p.rating}</span>
                  </div>

                  <h3 className="text-xl font-bold font-heading text-white">{p.title}</h3>
                  <p className="text-xs text-forge-400 line-clamp-2">{p.shortDescription}</p>

                  <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-forge-950 border border-forge-800 text-xs">
                    <div>
                      <span className="text-forge-400 block">Duration:</span>
                      <span className="font-bold text-white">{p.durationWeeks} Wks ({p.sessionsPerWeek}x/wk)</span>
                    </div>
                    <div>
                      <span className="text-forge-400 block">Athletes:</span>
                      <span className="font-bold text-brand-orange">{p.enrolledCount}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-forge-800 flex justify-between items-center text-xs">
                  <span className="text-forge-400">Lead: {p.trainerName}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDelete(programId)}
                      className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition cursor-pointer"
                      title="Delete Program"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-emerald-400 font-semibold">Active Track</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Training Program"
        description="Configure duration, session frequency, and target difficulty"
        maxWidth="md"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Program Title"
            required
            placeholder="e.g. Olympic Hypertrophy Protocol"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Duration (Weeks)"
              type="number"
              value={formData.durationWeeks}
              onChange={(e) => setFormData({ ...formData, durationWeeks: parseInt(e.target.value) || 0 })}
            />
            <Input
              label="Sessions / Week"
              type="number"
              value={formData.sessionsPerWeek}
              onChange={(e) => setFormData({ ...formData, sessionsPerWeek: parseInt(e.target.value) || 0 })}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-forge-300 font-heading mb-1.5">
              Program Summary
            </label>
            <textarea
              rows={3}
              required
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              placeholder="Describe program objectives and target outcomes..."
              className="w-full bg-forge-950 border border-forge-750 rounded-xl p-3 text-xs text-white placeholder-forge-500 focus:outline-none focus:border-brand-red"
            />
          </div>

          <Button type="submit" size="lg" variant="primary" className="w-full uppercase font-heading tracking-wider mt-4">
            Publish Program
          </Button>
        </form>
      </Modal>
    </div>
  );
}

