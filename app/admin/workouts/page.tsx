'use client';

import React, { useState, useEffect } from 'react';
import { workoutService } from '@/services/workoutService';
import { Exercise, MuscleGroup } from '@/types/workout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { Activity, PlusCircle, Search, Trash2, Upload, Image } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export default function AdminWorkoutsPage() {
  const { success, error } = useToast();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    targetMuscle: 'Chest' as MuscleGroup,
    difficulty: 'Beginner' as any,
    sets: 3,
    reps: '10-12',
    restTimeSeconds: 60,
    caloriesBurnedEstimate: 80,
    equipmentNeeded: '',
    instructions: '',
    imageUrl: '',
  });

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const fetchExercises = async () => {
    try {
      setIsLoading(true);
      const res = await workoutService.getExercises();
      if (res.success && res.data) {
        setExercises(res.data);
      }
    } catch (err) {
      console.error('Failed to load exercises:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  const openModal = () => {
    setFormData({
      name: '',
      targetMuscle: 'Chest' as MuscleGroup,
      difficulty: 'Beginner' as any,
      sets: 3,
      reps: '10-12',
      restTimeSeconds: 60,
      caloriesBurnedEstimate: 80,
      equipmentNeeded: '',
      instructions: '',
      imageUrl: '',
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
        const response = await fetch(`${process.env.NEXT_API_URL || 'http://localhost:5000'}/api/upload`, {
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
            imageUrl: resData.url,
          }));
          success('Uploaded', 'Exercise image uploaded successfully.');
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

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    const instructionsArray = formData.instructions
      .split('\n')
      .map((i) => i.trim())
      .filter(Boolean);

    if (instructionsArray.length === 0) {
      error('Error', 'At least one instruction step is required.');
      return;
    }

    const payload = {
      name: formData.name,
      targetMuscle: formData.targetMuscle,
      difficulty: formData.difficulty,
      sets: formData.sets,
      reps: formData.reps,
      restTimeSeconds: formData.restTimeSeconds,
      caloriesBurnedEstimate: formData.caloriesBurnedEstimate,
      equipmentNeeded: formData.equipmentNeeded,
      instructions: instructionsArray,
      imageUrl: formData.imageUrl || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400',
    };

    try {
      await workoutService.createExercise(payload);
      success('Exercise Added', `${formData.name} added to movement database.`);
      setIsModalOpen(false);
      fetchExercises();
    } catch {
      error('Error', 'Unable to add exercise.');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Remove exercise ${name}?`)) {
      try {
        await workoutService.deleteExercise(id);
        success('Exercise Removed', `${name} deleted.`);
        fetchExercises();
      } catch {
        error('Error', 'Unable to delete exercise.');
      }
    }
  };

  const filtered = exercises.filter(
    (e) =>
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.targetMuscle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black font-heading text-white uppercase tracking-tight">
            Workouts &amp; Exercise Database
          </h1>
          <p className="text-xs text-forge-400 mt-0.5">
            Manage movement encyclopedia, target muscle groups, and prescription tempos.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Input
            placeholder="Filter exercises..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-xs"
            leftIcon={<Search className="w-4 h-4" />}
          />
          <Button
            onClick={openModal}
            variant="primary"
            size="md"
            leftIcon={<PlusCircle className="w-4 h-4" />}
          >
            Add Exercise
          </Button>
        </div>
      </div>

      <Card className="p-0 bg-forge-900 border-forge-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-forge-800 text-forge-400 font-heading uppercase bg-forge-950/60">
                <th className="py-4 px-5">Exercise</th>
                <th className="py-4 px-4">Target Muscle</th>
                <th className="py-4 px-4">Difficulty</th>
                <th className="py-4 px-4">Standard Sets / Reps</th>
                <th className="py-4 px-4">Rest Time</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forge-850">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-forge-400">
                    Loading exercise database...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-forge-400">
                    No exercises found.
                  </td>
                </tr>
              ) : (
                filtered.map((e) => (
                  <tr key={e.id} className="hover:bg-forge-800/40 transition-colors">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <img
                          src={e.imageUrl || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400'}
                          alt={e.name}
                          className="w-10 h-10 rounded-xl object-cover border border-forge-700"
                        />
                        <div>
                          <p className="font-bold text-white font-heading">{e.name}</p>
                          <span className="text-[10px] text-forge-400">{e.equipmentNeeded}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant="flame">{e.targetMuscle}</Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant={e.difficulty === 'Advanced' ? 'danger' : 'warning'}>
                        {e.difficulty}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-forge-200">{e.sets} sets × {e.reps}</td>
                    <td className="py-4 px-4 text-forge-400">{e.restTimeSeconds}s</td>
                    <td className="py-4 px-5 text-right">
                      <button
                        onClick={() => handleDelete(e.id, e.name)}
                        className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-905/40 text-red-400 transition-colors cursor-pointer"
                        title="Delete exercise"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Exercise Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Exercise Movement"
        description="Configure dynamic movements inside target routines catalog"
        maxWidth="lg"
      >
        <form onSubmit={handleCreate} className="space-y-4 text-white">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Exercise Name"
              required
              placeholder="e.g. Incline Bench Press"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />

            <Input
              label="Equipment Needed"
              required
              placeholder="e.g. Barbell, Adjustable Bench"
              value={formData.equipmentNeeded}
              onChange={(e) => setFormData({ ...formData, equipmentNeeded: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <Select
              label="Target Muscle"
              value={formData.targetMuscle}
              onChange={(e) => setFormData({ ...formData, targetMuscle: e.target.value as MuscleGroup })}
              options={[
                { value: 'Chest', label: 'Chest' },
                { value: 'Back', label: 'Back' },
                { value: 'Legs', label: 'Legs' },
                { value: 'Arms', label: 'Arms' },
                { value: 'Shoulders', label: 'Shoulders' },
                { value: 'Abs', label: 'Abs' },
                { value: 'Full Body', label: 'Full Body' },
                { value: 'Cardio', label: 'Cardio' },
              ]}
            />

            <Select
              label="Difficulty"
              value={formData.difficulty}
              onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
              options={[
                { value: 'Beginner', label: 'Beginner' },
                { value: 'Intermediate', label: 'Intermediate' },
                { value: 'Advanced', label: 'Advanced' },
              ]}
            />

            <Input
              label="Rest Time (Sec)"
              type="number"
              required
              value={formData.restTimeSeconds}
              onChange={(e) => setFormData({ ...formData, restTimeSeconds: parseInt(e.target.value) || 0 })}
            />

            <Input
              label="Est Calories (3 Sets)"
              type="number"
              required
              value={formData.caloriesBurnedEstimate}
              onChange={(e) => setFormData({ ...formData, caloriesBurnedEstimate: parseInt(e.target.value) || 0 })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Standard Sets"
              type="number"
              required
              value={formData.sets}
              onChange={(e) => setFormData({ ...formData, sets: parseInt(e.target.value) || 0 })}
            />

            <Input
              label="Standard Reps"
              required
              placeholder="e.g. 8-12, or 5, or To Failure"
              value={formData.reps}
              onChange={(e) => setFormData({ ...formData, reps: e.target.value })}
            />
          </div>

          <div className="border border-forge-800 bg-forge-950/40 p-4 rounded-xl space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-forge-400 font-heading">
              Exercise Cover Image Settings
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
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://example.com/exercise.jpg"
                />
              </div>

              {/* Preview image */}
              <div className="flex flex-col items-center justify-center p-3 border border-forge-850 bg-forge-900/60 rounded-xl h-full min-h-[140px]">
                {formData.imageUrl ? (
                  <div className="relative group w-full h-32 flex items-center justify-center">
                    <img
                      src={formData.imageUrl}
                      alt="Exercise Preview"
                      className="max-h-full max-w-full object-contain rounded-lg border border-forge-800"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '';
                      }}
                    />
                  </div>
                ) : (
                  <div className="text-center space-y-1.5 py-4">
                    <Image className="w-8 h-8 text-forge-600 mx-auto" />
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
              Step-by-step Instructions (One sentence per line)
            </label>
            <textarea
              rows={3}
              required
              value={formData.instructions}
              onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
              placeholder="e.g.&#10;Lie flat on the bench.&#10;Grip bar wider than shoulder-width.&#10;Press upward vertically..."
              className="w-full bg-forge-950 border border-forge-750 rounded-xl p-3 text-xs text-white placeholder-forge-500 focus:outline-none focus:border-brand-red"
            />
          </div>

          <Button type="submit" size="lg" variant="primary" className="w-full uppercase font-heading tracking-wider mt-4">
            Add Exercise option
          </Button>
        </form>
      </Modal>
    </div>
  );
}
