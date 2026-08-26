"use client";

import React, { useEffect, useState } from "react";
import {
  Dumbbell,
  Plus,
  Trash2,
  Save,
  X,
  Users,
  RefreshCw,
  CalendarDays,
  Target,
} from "lucide-react";

import { Card } from "@/components/ui/Card";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

import {
  trainerService,
  TrainerMember,
  Workout,
  WorkoutExercise,
} from "@/services/trainerService";

const createEmptyExercise = (): WorkoutExercise => ({
  name: "",
  sets: 3,
  reps: 10,
  weight: 0,
  restSeconds: 60,
  notes: "",
});

export default function TrainerWorkoutsPage() {
  const [members, setMembers] = useState<TrainerMember[]>([]);
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);

  const [selectedMember, setSelectedMember] = useState("");
  const [workoutName, setWorkoutName] = useState("");
  const [goal, setGoal] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [exercises, setExercises] = useState<WorkoutExercise[]>([
    createEmptyExercise(),
  ]);

  const loadData = async () => {
    try {
      setIsLoading(true);

      const [membersResponse, workoutsResponse] =
        await Promise.all([
          trainerService.getMyMembers(),
          trainerService.getMyWorkouts(),
        ]);

      if (membersResponse.success && membersResponse.data) {
        setMembers(membersResponse.data);
      } else {
        setMembers([]);
      }

      if (workoutsResponse.success && workoutsResponse.data) {
        setWorkouts(workoutsResponse.data);
      } else {
        setWorkouts([]);
      }
    } catch (error) {
      console.error("Failed to load workout data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setSelectedMember("");
    setWorkoutName("");
    setGoal("");
    setStartDate("");
    setEndDate("");
    setExercises([createEmptyExercise()]);
  };

  const addExercise = () => {
    setExercises((prev) => [
      ...prev,
      createEmptyExercise(),
    ]);
  };

  const removeExercise = (index: number) => {
    if (exercises.length === 1) {
      return;
    }

    setExercises((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  const updateExercise = (
    index: number,
    field: keyof WorkoutExercise,
    value: string | number
  ) => {
    setExercises((prev) =>
      prev.map((exercise, i) =>
        i === index
          ? {
              ...exercise,
              [field]: value,
            }
          : exercise
      )
    );
  };

  const handleCreateWorkout = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!selectedMember) {
      alert("Please select a member.");
      return;
    }

    if (!workoutName.trim()) {
      alert("Please enter a workout name.");
      return;
    }

    const validExercises = exercises
      .filter((exercise) => exercise.name.trim())
      .map((exercise) => ({
        ...exercise,
        name: exercise.name.trim(),
      }));

    if (validExercises.length === 0) {
      alert("Please add at least one exercise.");
      return;
    }

    try {
      setIsSaving(true);

      const response =
        await trainerService.createWorkout({
          memberId: selectedMember,
          name: workoutName.trim(),
          goal: goal.trim() || undefined,
          exercises: validExercises,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
        });

      if (!response.success || !response.data) {
        throw new Error(
          response.message || "Failed to create workout"
        );
      }

      alert("Workout created successfully ✅");

      resetForm();
      setShowForm(false);

      await loadData();
    } catch (error) {
      console.error("Create workout error:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to create workout"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteWorkout = async (
    workoutId: string
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this workout?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response =
        await trainerService.deleteWorkout(workoutId);

      if (!response.success) {
        throw new Error(
          response.message || "Failed to delete workout"
        );
      }

      setWorkouts((prev) =>
        prev.filter((workout) => workout._id !== workoutId)
      );

      alert("Workout deleted successfully.");
    } catch (error) {
      console.error("Delete workout error:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete workout"
      );
    }
  };

  const getMemberName = (
    member: Workout["member"]
  ): string => {
    if (typeof member === "string") {
      const foundMember = members.find(
        (item) => item._id === member
      );

      return foundMember?.name || "Member";
    }

    return member.name;
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner
          label="Loading Workout Workspace..."
          size="lg"
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-orange">
            Trainer Workspace
          </p>

          <h1 className="text-3xl sm:text-4xl font-black font-heading text-white mt-2">
            WORKOUTS
          </h1>

          <p className="text-sm text-forge-400 mt-2">
            Create and assign workout plans to your assigned members.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadData}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-forge-900 border border-forge-800 text-white text-sm font-semibold hover:border-brand-red/50 transition"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>

          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-red hover:bg-brand-red/90 text-white text-sm font-semibold transition"
          >
            <Plus className="w-4 h-4" />
            Create Workout
          </button>
        </div>
      </div>

      {/* Create Workout Form */}
      {showForm && (
        <Card className="p-6 bg-forge-900 border-forge-800">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold font-heading text-white">
                Create Workout Plan
              </h2>

              <p className="text-xs text-forge-400 mt-1">
                Build a custom workout for one of your members.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                resetForm();
                setShowForm(false);
              }}
              className="w-9 h-9 rounded-lg bg-forge-950 border border-forge-800 flex items-center justify-center text-forge-400 hover:text-white"
              aria-label="Close workout form"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form
            onSubmit={handleCreateWorkout}
            className="space-y-7"
          >
            {/* Basic workout information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-forge-300 mb-2">
                  Member
                </label>

                <select
                  value={selectedMember}
                  onChange={(e) =>
                    setSelectedMember(e.target.value)
                  }
                  className="w-full bg-forge-950 border border-forge-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-red"
                >
                  <option value="">
                    Select assigned member
                  </option>

                  {members.map((member) => (
                    <option
                      key={member._id}
                      value={member._id}
                    >
                      {member.name}
                    </option>
                  ))}
                </select>

                {members.length === 0 && (
                  <p className="text-xs text-amber-400 mt-2">
                    No assigned members found. Assign a member first.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-forge-300 mb-2">
                  Workout Name
                </label>

                <input
                  type="text"
                  value={workoutName}
                  onChange={(e) =>
                    setWorkoutName(e.target.value)
                  }
                  placeholder="Weight Loss - Week 1"
                  className="w-full bg-forge-950 border border-forge-800 rounded-xl px-4 py-3 text-sm text-white placeholder-forge-500 focus:outline-none focus:border-brand-red"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-forge-300 mb-2">
                  Goal
                </label>

                <div className="relative">
                  <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-forge-500" />

                  <input
                    type="text"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    placeholder="Fat loss / Strength / Muscle gain"
                    className="w-full bg-forge-950 border border-forge-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-forge-500 focus:outline-none focus:border-brand-red"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-forge-300 mb-2">
                    Start Date
                  </label>

                  <div className="relative">
                    <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-forge-500" />

                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) =>
                        setStartDate(e.target.value)
                      }
                      className="w-full bg-forge-950 border border-forge-800 rounded-xl pl-10 pr-3 py-3 text-sm text-white focus:outline-none focus:border-brand-red"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-forge-300 mb-2">
                    End Date
                  </label>

                  <div className="relative">
                    <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-forge-500" />

                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) =>
                        setEndDate(e.target.value)
                      }
                      className="w-full bg-forge-950 border border-forge-800 rounded-xl pl-10 pr-3 py-3 text-sm text-white focus:outline-none focus:border-brand-red"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Exercises */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Exercises
                  </h3>

                  <p className="text-xs text-forge-400 mt-1">
                    Add exercises with sets, reps, weight and rest.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addExercise}
                  className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-forge-950 border border-forge-800 text-white text-xs font-semibold hover:border-brand-red/50 transition"
                >
                  <Plus className="w-4 h-4" />
                  Add Exercise
                </button>
              </div>

              <div className="space-y-4">
                {exercises.map((exercise, index) => (
                  <div
                    key={index}
                    className="p-5 rounded-2xl bg-forge-950 border border-forge-800"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
                      <div className="sm:col-span-2 lg:col-span-2">
                        <label className="block text-[11px] uppercase tracking-wider text-forge-400 mb-2">
                          Exercise
                        </label>

                        <input
                          type="text"
                          value={exercise.name}
                          onChange={(e) =>
                            updateExercise(
                              index,
                              "name",
                              e.target.value
                            )
                          }
                          placeholder="Barbell Squat"
                          className="w-full bg-forge-900 border border-forge-800 rounded-xl px-3 py-2.5 text-sm text-white placeholder-forge-500 focus:outline-none focus:border-brand-red"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-forge-400 mb-2">
                          Sets
                        </label>

                        <input
                          type="number"
                          min={1}
                          value={exercise.sets}
                          onChange={(e) =>
                            updateExercise(
                              index,
                              "sets",
                              Math.max(1, Number(e.target.value))
                            )
                          }
                          className="w-full bg-forge-900 border border-forge-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-brand-red"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-forge-400 mb-2">
                          Reps
                        </label>

                        <input
                          type="number"
                          min={1}
                          value={exercise.reps}
                          onChange={(e) =>
                            updateExercise(
                              index,
                              "reps",
                              Math.max(1, Number(e.target.value))
                            )
                          }
                          className="w-full bg-forge-900 border border-forge-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-brand-red"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-forge-400 mb-2">
                          Weight (kg)
                        </label>

                        <input
                          type="number"
                          min={0}
                          value={exercise.weight ?? 0}
                          onChange={(e) =>
                            updateExercise(
                              index,
                              "weight",
                              Math.max(
                                0,
                                Number(e.target.value)
                              )
                            )
                          }
                          className="w-full bg-forge-900 border border-forge-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-brand-red"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-forge-400 mb-2">
                          Rest (sec)
                        </label>

                        <input
                          type="number"
                          min={0}
                          value={exercise.restSeconds ?? 60}
                          onChange={(e) =>
                            updateExercise(
                              index,
                              "restSeconds",
                              Math.max(
                                0,
                                Number(e.target.value)
                              )
                            )
                          }
                          className="w-full bg-forge-900 border border-forge-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-brand-red"
                        />
                      </div>

                      <div className="sm:col-span-2 lg:col-span-5">
                        <label className="block text-[11px] uppercase tracking-wider text-forge-400 mb-2">
                          Notes
                        </label>

                        <input
                          type="text"
                          value={exercise.notes ?? ""}
                          onChange={(e) =>
                            updateExercise(
                              index,
                              "notes",
                              e.target.value
                            )
                          }
                          placeholder="Controlled movement, proper form..."
                          className="w-full bg-forge-900 border border-forge-800 rounded-xl px-3 py-2.5 text-sm text-white placeholder-forge-500 focus:outline-none focus:border-brand-red"
                        />
                      </div>

                      <div className="flex items-end">
                        <button
                          type="button"
                          disabled={exercises.length === 1}
                          onClick={() =>
                            removeExercise(index)
                          }
                          className="w-full inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 disabled:opacity-30 disabled:cursor-not-allowed transition text-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setShowForm(false);
                }}
                className="px-5 py-2.5 rounded-xl bg-forge-950 border border-forge-800 text-forge-300 hover:text-white text-sm font-semibold transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSaving || members.length === 0}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand-red hover:bg-brand-red/90 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition"
              >
                <Save className="w-4 h-4" />

                {isSaving
                  ? "Saving..."
                  : "Save Workout"}
              </button>
            </div>
          </form>
        </Card>
      )}

      {/* Existing Workouts */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">
          <div>
            <h2 className="text-xl font-bold font-heading text-white">
              My Workout Plans
            </h2>

            <p className="text-xs text-forge-400 mt-1">
              Workout plans created by you.
            </p>
          </div>

          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-orange/10 text-brand-orange text-xs font-semibold">
            <Dumbbell className="w-3.5 h-3.5" />
            {workouts.length} Plans
          </span>
        </div>

        {workouts.length === 0 ? (
          <Card className="p-12 bg-forge-900 border-forge-800 text-center">
            <Dumbbell className="w-12 h-12 mx-auto text-forge-600 mb-4" />

            <h3 className="text-lg font-bold text-white">
              No Workout Plans Yet
            </h3>

            <p className="text-sm text-forge-400 mt-2">
              Create your first workout plan for an assigned member.
            </p>

            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-red text-white text-sm font-semibold"
            >
              <Plus className="w-4 h-4" />
              Create First Workout
            </button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {workouts.map((workout) => {
              const memberName = getMemberName(
                workout.member
              );

              return (
                <Card
                  key={workout._id}
                  className="p-6 bg-forge-900 border-forge-800"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <Dumbbell className="w-5 h-5 text-brand-orange" />

                        <h3 className="text-lg font-bold text-white">
                          {workout.name}
                        </h3>
                      </div>

                      <p className="text-xs text-forge-400 mt-2 flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        {memberName}
                      </p>

                      {workout.goal && (
                        <p className="text-xs text-forge-500 mt-1">
                          Goal: {workout.goal}
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleDeleteWorkout(workout._id)
                      }
                      className="w-9 h-9 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 flex items-center justify-center"
                      aria-label="Delete workout"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mt-5 space-y-2">
                    {workout.exercises.map(
                      (exercise, index) => (
                        <div
                          key={`${workout._id}-${index}`}
                          className="p-3 rounded-xl bg-forge-950 border border-forge-800"
                        >
                          <div className="flex items-center justify-between gap-4">
                            <p className="font-semibold text-white text-sm">
                              {exercise.name}
                            </p>

                            <p className="text-xs text-brand-orange">
                              {exercise.sets} × {exercise.reps}
                            </p>
                          </div>

                          <p className="text-[11px] text-forge-500 mt-1">
                            {exercise.weight
                              ? `${exercise.weight} kg`
                              : "Bodyweight"}{" "}
                            • Rest{" "}
                            {exercise.restSeconds ?? 0}s
                          </p>

                          {exercise.notes && (
                            <p className="text-[11px] text-forge-400 mt-2">
                              {exercise.notes}
                            </p>
                          )}
                        </div>
                      )
                    )}
                  </div>

                  <div className="mt-5 pt-4 border-t border-forge-800 flex items-center justify-between gap-3">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase">
                      {workout.status}
                    </span>

                    <div className="text-right">
                      {workout.startDate && (
                        <p className="text-[11px] text-forge-500">
                          Start:{" "}
                          {new Date(
                            workout.startDate
                          ).toLocaleDateString()}
                        </p>
                      )}

                      {workout.endDate && (
                        <p className="text-[11px] text-forge-500">
                          End:{" "}
                          {new Date(
                            workout.endDate
                          ).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}