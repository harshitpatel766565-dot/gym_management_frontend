'use client';

import React, { useState, useEffect } from 'react';
import { adminService } from '@/services/adminService';
import { Trainer, TrainerSpecialization } from '@/types/trainer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/context/ToastContext';
import { formatINR } from '@/lib/utils';
import { UserCheck, PlusCircle, Star, Award, Trash2, Edit2, Clock, Upload, User } from 'lucide-react';

export default function AdminTrainersPage() {
  const { success, error } = useToast();
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState<Trainer | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    email: '',
    phone: '',
    specialization: 'Strength Coach' as TrainerSpecialization,
    experienceYears: 5,
    hourlyRate: 1400,
    bio: '',
    avatarUrl: '',
  });

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const openModal = () => {
    setEditingTrainer(null);
    setFormData({
      name: '',
      title: '',
      email: '',
      phone: '',
      specialization: 'Strength Coach' as TrainerSpecialization,
      experienceYears: 5,
      hourlyRate: 1400,
      bio: '',
      avatarUrl: '',
    });
    setUploadError('');
    setIsUploading(false);
    setIsModalOpen(true);
  };

  const openEditModal = (t: Trainer) => {
    setEditingTrainer(t);
    setFormData({
      name: t.name,
      title: t.title,
      email: t.email,
      phone: t.phone || '',
      specialization: t.specialization,
      experienceYears: t.experienceYears,
      hourlyRate: t.hourlyRate,
      bio: t.bio || '',
      avatarUrl: t.avatarUrl || '',
    });
    setUploadError('');
    setIsUploading(false);
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Image size should be less than 10MB');
      return;
    }

    setUploadError('');
    setIsUploading(true);

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64Data = reader.result as string;
        const apiBaseUrl =
          process.env.NEXT_API_URL ||
          "https://gym-management-backend-phi.vercel.app";
        const response = await fetch(`${apiBaseUrl}/api/upload`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ image: base64Data }),
        });

        const resData = await response.json();
        if (resData.success && resData.url) {
          setFormData((prev) => ({
            ...prev,
            avatarUrl: resData.url,
          }));
          success('Uploaded', 'Coach image uploaded successfully.');
        } else {
          setUploadError(resData.message || 'Image upload failed.');
        }
      } catch (err) {
        console.error('Upload error:', err);
        setUploadError('Network error during image upload.');
      } finally {
        setIsUploading(false);
      }
    };

    reader.onerror = () => {
      setUploadError('Failed to read file.');
      setIsUploading(false);
    };

    reader.readAsDataURL(file);
  };

  const loadTrainers = async () => {
    try {
      const res = await adminService.getTrainers();
      setTrainers(res.data);
    } catch {
      // Fallback
    }
  };

  useEffect(() => {
    loadTrainers();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTrainer) {
        await adminService.updateTrainer(editingTrainer.id, formData);
        success('Trainer Updated', `Coach ${formData.name}'s profile has been updated.`);
      } else {
        await adminService.createTrainer(formData);
        success('Trainer Added', `Coach ${formData.name} added to staff roster.`);
      }
      setIsModalOpen(false);
      loadTrainers();
    } catch {
      error('Error', editingTrainer ? 'Unable to update trainer.' : 'Unable to add trainer.');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete coach ${name}?`)) {
      try {
        await adminService.deleteTrainer(id);
        success('Trainer Deleted', `Coach ${name} has been removed from staff roster.`);
        loadTrainers();
      } catch {
        error('Error', 'Unable to delete trainer.');
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black font-heading text-white uppercase tracking-tight">
            Trainer &amp; Coach Management
          </h1>
          <p className="text-xs text-forge-400 mt-0.5">
            Manage personal trainers, assign specialty tracks, and monitor client load.
          </p>
        </div>

        <Button
          onClick={openModal}
          variant="primary"
          size="md"
          leftIcon={<PlusCircle className="w-4 h-4" />}
        >
          Add Master Coach
        </Button>
      </div>

      {/* Grid of Trainers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trainers.map((t) => (
          <Card key={t.id} className="p-6 bg-forge-900 border-forge-800 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex justify-between items-start gap-4 w-full">
                <div className="flex items-start gap-4">
                  <img
                    src={t.avatarUrl}
                    alt={t.name}
                    className="w-16 h-16 rounded-2xl object-cover border border-brand-red/40 shrink-0"
                  />
                  <div>
                    <h3 className="text-lg font-bold font-heading text-white">{t.name}</h3>
                    <p className="text-xs text-forge-400">{t.title}</p>
                    <div className="mt-2">
                      <Badge variant="flame">{t.specialization}</Badge>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => openEditModal(t)}
                    className="p-1.5 rounded-lg bg-forge-800 hover:bg-forge-700 text-forge-300 hover:text-white transition-colors cursor-pointer"
                    title="Edit Coach"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(t.id, t.name)}
                    className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 transition-colors cursor-pointer"
                    title="Delete Coach"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-xs text-forge-300 pt-2 border-t border-forge-800">
                <div className="flex justify-between">
                  <span className="text-forge-400">Experience:</span>
                  <span className="font-semibold text-white">{t.experienceYears}+ Years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-forge-400">Rating:</span>
                  <span className="text-amber-400 font-bold">★ {t.rating} ({t.reviewCount})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-forge-400">Active Roster:</span>
                  <span className="text-emerald-400 font-bold">{t.activeClientsCount} Clients</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-forge-400">Rate:</span>
                  <span className="text-brand-orange font-bold font-heading">{formatINR(t.hourlyRate)}/hr</span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-forge-800 flex justify-between items-center text-xs">
              <span className="text-forge-400">{t.availableDays ? t.availableDays.length : 0} Days/Wk</span>
              <span className="text-emerald-400 font-semibold">Active Coach</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Add/Edit Trainer Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTrainer ? "Edit Master Coach Profile" : "Add Master Coach Profile"}
        description={editingTrainer ? `Modify settings and profile details for Coach ${editingTrainer.name}` : "Register a new certified coach to the IRONFORGE training directory"}
        maxWidth="lg"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Coach Full Name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <Input
            label="Professional Title"
            required
            placeholder="e.g. Head Strength & Conditioning Coach"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <Input
              label="Phone"
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="Specialization Track"
              value={formData.specialization}
              onChange={(e) => setFormData({ ...formData, specialization: e.target.value as TrainerSpecialization })}
              options={[
                { value: 'Strength Coach', label: 'Strength Coach' },
                { value: 'Nutrition Coach', label: 'Nutrition Coach' },
                { value: 'CrossFit Coach', label: 'CrossFit Coach' },
                { value: 'Weight Loss Coach', label: 'Weight Loss Coach' },
                { value: 'Yoga Instructor', label: 'Yoga Instructor' },
                { value: 'Master Coach', label: 'Master Coach' },
              ]}
            />

            <Input
              label="Experience (Years)"
              type="number"
              value={formData.experienceYears}
              onChange={(e) => setFormData({ ...formData, experienceYears: parseInt(e.target.value) || 0 })}
            />

            <Input
              label="Hourly Rate (INR)"
              type="number"
              value={formData.hourlyRate}
              onChange={(e) => setFormData({ ...formData, hourlyRate: parseInt(e.target.value) || 0 })}
            />
          </div>

          <div className="border border-forge-800 bg-forge-950/40 p-4 rounded-xl space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-forge-400 font-heading">
              Coach Profile Image Settings
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-forge-300 mb-1.5 font-heading">
                    Upload Local Image
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                      className="block w-full text-xs text-forge-300 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:uppercase file:font-heading file:bg-forge-850 file:text-white hover:file:bg-forge-800 cursor-pointer disabled:opacity-50"
                    />
                  </div>
                  {isUploading && (
                    <p className="text-[10px] text-brand-orange animate-pulse font-bold mt-1.5">
                      Uploading image...
                    </p>
                  )}
                  {uploadError && (
                    <p className="text-[10px] text-brand-red font-bold mt-1.5">
                      {uploadError}
                    </p>
                  )}
                </div>
                <Input
                  label="Or Image URL"
                  value={formData.avatarUrl}
                  onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                  placeholder="https://example.com/coach.jpg"
                />
              </div>

              {/* Preview image */}
              <div className="flex flex-col items-center justify-center p-3 border border-forge-850 bg-forge-900/60 rounded-xl h-full min-h-[140px]">
                {formData.avatarUrl ? (
                  <div className="relative group w-full h-32 flex items-center justify-center">
                    <img
                      src={formData.avatarUrl}
                      alt="Coach Preview"
                      className="max-h-full max-w-full object-contain rounded-lg border border-forge-800"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '';
                      }}
                    />
                  </div>
                ) : (
                  <div className="text-center space-y-1.5 py-4">
                    <User className="w-8 h-8 text-forge-600 mx-auto" />
                    <p className="text-[10px] text-forge-500 font-bold uppercase tracking-wider">
                      No Image Preview
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-forge-300 font-heading mb-1.5">
              Biography &amp; Coaching Philosophy
            </label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Detail coaching background..."
              className="w-full bg-forge-950 border border-forge-750 rounded-xl p-3 text-xs text-white placeholder-forge-500 focus:outline-none focus:border-brand-red"
            />
          </div>

          <Button type="submit" size="lg" variant="primary" className="w-full uppercase font-heading tracking-wider mt-4">
            {editingTrainer ? 'Save Coach Details' : 'Register Coach'}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
