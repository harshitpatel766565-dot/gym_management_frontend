"use client";

import React, { useEffect, useState } from "react";
import {
  Users,
  Search,
  UserMinus,
  UserPlus,
  RefreshCw,
  Plus,
  X,
} from "lucide-react";

import { Card } from "@/components/ui/Card";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

import {
  trainerService,
  TrainerMember,
} from "@/services/trainerService";

export default function TrainerMembersPage() {
  const [members, setMembers] = useState<TrainerMember[]>([]);
  const [availableMembers, setAvailableMembers] = useState<
    TrainerMember[]
  >([]);

  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAssigning, setIsAssigning] = useState<string | null>(null);
  const [isRemoving, setIsRemoving] = useState<string | null>(null);

  // Add Member Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const loadData = async () => {
    try {
      setIsLoading(true);

      const [assignedResponse, availableResponse] = await Promise.all([
        trainerService.getMyMembers(),
        trainerService.getAvailableMembers(),
      ]);

      if (assignedResponse.success && assignedResponse.data) {
        setMembers(assignedResponse.data);
      } else {
        setMembers([]);
      }

      if (availableResponse.success && availableResponse.data) {
        setAvailableMembers(availableResponse.data);
      } else {
        setAvailableMembers([]);
      }
    } catch (error) {
      console.error("Failed to load members:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Add New Member Handler
  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      alert("Name and Email are required!");
      return;
    }

    try {
      setIsSubmitting(true);
      // Ensure trainerService has addMember function or similar API call
      const response = await (trainerService as any).addMember(formData);

      if (response && response.success) {
        alert("Member added successfully!");
        setFormData({ name: "", email: "", phone: "" });
        setIsAddModalOpen(false);
        await loadData();
      } else {
        throw new Error(response?.message || "Failed to add member");
      }
    } catch (error) {
      console.error("Add member error:", error);
      alert(
        error instanceof Error ? error.message : "Failed to add member"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAssign = async (memberId: string) => {
    try {
      setIsAssigning(memberId);

      const response = await trainerService.assignMember(memberId);

      if (!response.success) {
        throw new Error(response.message || "Failed to assign member");
      }

      await loadData();
    } catch (error) {
      console.error("Assign member error:", error);
      alert(
        error instanceof Error ? error.message : "Failed to assign member"
      );
    } finally {
      setIsAssigning(null);
    }
  };

  const handleRemove = async (memberId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to remove this member?"
    );

    if (!confirmed) return;

    try {
      setIsRemoving(memberId);

      const response = await trainerService.removeMember(memberId);

      if (!response.success) {
        throw new Error(response.message || "Failed to remove member");
      }

      await loadData();
    } catch (error) {
      console.error("Remove member error:", error);
      alert(
        error instanceof Error ? error.message : "Failed to remove member"
      );
    } finally {
      setIsRemoving(null);
    }
  };

  // SAFE SEARCH FILTER LOGIC (Fixes the crashing search issue)
  const query = search.toLowerCase().trim();

  const filterMember = (member: TrainerMember) => {
    if (!query) return true;
    const nameMatch = member.name?.toLowerCase().includes(query) ?? false;
    const emailMatch = member.email?.toLowerCase().includes(query) ?? false;
    const phoneMatch = member.phone?.toLowerCase().includes(query) ?? false;
    return nameMatch || emailMatch || phoneMatch;
  };

  const filteredMembers = members.filter(filterMember);
  const filteredAvailableMembers = availableMembers.filter(filterMember);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner label="Loading Members..." size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-orange">
            Trainer Workspace
          </p>

          <h1 className="text-3xl sm:text-4xl font-black font-heading text-white mt-2">
            MY MEMBERS
          </h1>

          <p className="text-sm text-forge-400 mt-2">
            Assign new members and manage your current athletes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-red hover:bg-brand-red/90 text-white text-sm font-semibold transition"
          >
            <Plus className="w-4 h-4" />
            Add New Member
          </button>

          <button
            type="button"
            onClick={loadData}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-forge-900 border border-forge-800 hover:border-brand-red/50 text-white text-sm font-semibold transition"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <Card className="p-5 bg-forge-900 border-forge-800">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-forge-500" />

          <input
            type="text"
            placeholder="Search members by name, email or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-forge-950 border border-forge-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-forge-500 focus:outline-none focus:border-brand-red"
          />
        </div>
      </Card>

      {/* Available Members Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold font-heading text-white">
              Available Members
            </h2>

            <p className="text-xs text-forge-400 mt-1">
              Members who are not assigned to a trainer.
            </p>
          </div>

          <span className="text-xs px-3 py-1 rounded-full bg-brand-orange/10 text-brand-orange">
            {filteredAvailableMembers.length} Available
          </span>
        </div>

        {filteredAvailableMembers.length === 0 ? (
          <Card className="p-10 bg-forge-900 border-forge-800 text-center">
            <UserPlus className="w-10 h-10 mx-auto text-forge-600 mb-3" />

            <p className="text-sm text-forge-300">
              No available members found.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredAvailableMembers.map((member) => (
              <Card
                key={member._id}
                className="p-6 bg-forge-900 border-forge-800 hover:border-brand-orange/40 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange font-bold">
                    {member.name?.charAt(0).toUpperCase() || "M"}
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-bold text-white truncate">
                      {member.name}
                    </h3>

                    <p className="text-xs text-forge-500">
                      Available Member
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-2 text-sm">
                  <p className="text-forge-300 break-all">
                    <span className="text-forge-500">Email:</span>{" "}
                    {member.email}
                  </p>

                  {member.phone && (
                    <p className="text-forge-300">
                      <span className="text-forge-500">Phone:</span>{" "}
                      {member.phone}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  disabled={isAssigning === member._id}
                  onClick={() => handleAssign(member._id)}
                  className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-red hover:bg-brand-red/90 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition"
                >
                  <UserPlus className="w-4 h-4" />

                  {isAssigning === member._id
                    ? "Assigning..."
                    : "Assign to Me"}
                </button>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Assigned Members Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold font-heading text-white">
              Assigned Members
            </h2>

            <p className="text-xs text-forge-400 mt-1">
              Members currently assigned to you.
            </p>
          </div>

          <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400">
            {filteredMembers.length} Assigned
          </span>
        </div>

        {filteredMembers.length === 0 ? (
          <Card className="p-10 bg-forge-900 border-forge-800 text-center">
            <Users className="w-10 h-10 mx-auto text-forge-600 mb-3" />

            <p className="text-sm text-forge-300">
              No members assigned to you yet.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredMembers.map((member) => (
              <Card
                key={member._id}
                className="p-6 bg-forge-900 border-forge-800 hover:border-emerald-500/30 transition"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-brand-red/10 flex items-center justify-center text-brand-orange font-bold">
                      {member.name?.charAt(0).toUpperCase() || "M"}
                    </div>

                    <div>
                      <h3 className="font-bold text-white">
                        {member.name}
                      </h3>

                      <p className="text-xs text-forge-500 mt-1">
                        Gym Member
                      </p>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
                    ASSIGNED
                  </span>
                </div>

                <div className="mt-5 space-y-2 text-sm">
                  <p className="text-forge-300 break-all">
                    <span className="text-forge-500">Email:</span>{" "}
                    {member.email}
                  </p>

                  {member.phone && (
                    <p className="text-forge-300">
                      <span className="text-forge-500">Phone:</span>{" "}
                      {member.phone}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  disabled={isRemoving === member._id}
                  onClick={() => handleRemove(member._id)}
                  className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm font-semibold"
                >
                  <UserMinus className="w-4 h-4" />

                  {isRemoving === member._id
                    ? "Removing..."
                    : "Remove Member"}
                </button>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Add New Member Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-forge-900 border border-forge-800 rounded-2xl w-full max-w-md p-6 relative">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 text-forge-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold font-heading text-white mb-4">
              Add New Member
            </h3>

            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-forge-400 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full bg-forge-950 border border-forge-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-red"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-forge-400 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full bg-forge-950 border border-forge-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-red"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-forge-400 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+91 9876543210"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full bg-forge-950 border border-forge-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-red"
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-forge-800 text-forge-300 hover:bg-forge-800 text-sm font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-1/2 py-2.5 rounded-xl bg-brand-red hover:bg-brand-red/90 text-white text-sm font-semibold transition disabled:opacity-50"
                >
                  {isSubmitting ? "Adding..." : "Add Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}