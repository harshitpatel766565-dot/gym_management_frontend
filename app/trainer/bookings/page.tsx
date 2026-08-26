"use client";

import React, { useEffect, useState } from "react";
import {
  CalendarCheck,
  Plus,
  RefreshCw,
  Trash2,
  X,
  Clock3,
  Users,
} from "lucide-react";

import { Card } from "@/components/ui/Card";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

import {
  trainerService,
  TrainerMember,
  Booking,
  BookingStatus,
} from "@/services/trainerService";

const getMemberName = (
  member: Booking["member"]
): string => {
  if (typeof member === "string") {
    return "Member";
  }

  return member.name;
};

export default function TrainerBookingsPage() {
  const [members, setMembers] = useState<TrainerMember[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);

  const [selectedMember, setSelectedMember] = useState("");
  const [title, setTitle] = useState("");
  const [sessionType, setSessionType] =
    useState("Personal Training");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [notes, setNotes] = useState("");

  const loadData = async () => {
    try {
      setIsLoading(true);

      const [membersResponse, bookingsResponse] =
        await Promise.all([
          trainerService.getMyMembers(),
          trainerService.getMyBookings(),
        ]);

      if (membersResponse.success && membersResponse.data) {
        setMembers(membersResponse.data);
      } else {
        setMembers([]);
      }

      if (bookingsResponse.success && bookingsResponse.data) {
        setBookings(bookingsResponse.data);
      } else {
        setBookings([]);
      }
    } catch (error) {
      console.error("Failed to load booking data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setSelectedMember("");
    setTitle("");
    setSessionType("Personal Training");
    setDate("");
    setStartTime("");
    setEndTime("");
    setNotes("");
  };

  const closeForm = () => {
    resetForm();
    setShowForm(false);
  };

  const handleCreateBooking = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!selectedMember) {
      alert("Please select a member.");
      return;
    }

    if (!title.trim()) {
      alert("Please enter session title.");
      return;
    }

    if (!date) {
      alert("Please select a date.");
      return;
    }

    if (!startTime) {
      alert("Please select start time.");
      return;
    }

    try {
      setIsSaving(true);

      const response = await trainerService.createBooking({
        memberId: selectedMember,
        title: title.trim(),
        sessionType,
        date,
        startTime,
        endTime: endTime || undefined,
        notes: notes.trim() || undefined,
      });

      if (!response.success || !response.data) {
        throw new Error(
          response.message || "Failed to create booking"
        );
      }

      alert("Booking created successfully ✅");

      closeForm();
      await loadData();
    } catch (error) {
      console.error("Create booking error:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to create booking"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleStatusChange = async (
    bookingId: string,
    status: BookingStatus
  ) => {
    try {
      const response =
        await trainerService.updateBookingStatus(
          bookingId,
          status
        );

      if (!response.success) {
        throw new Error(
          response.message || "Failed to update booking"
        );
      }

      await loadData();
    } catch (error) {
      console.error(
        "Update booking status error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to update booking"
      );
    }
  };

  const handleDeleteBooking = async (
    bookingId: string
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this booking?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response =
        await trainerService.deleteBooking(bookingId);

      if (!response.success) {
        throw new Error(
          response.message || "Failed to delete booking"
        );
      }

      setBookings((prev) =>
        prev.filter(
          (booking) => booking._id !== bookingId
        )
      );
    } catch (error) {
      console.error("Delete booking error:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete booking"
      );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner
          label="Loading Bookings..."
          size="lg"
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-orange">
            Trainer Workspace
          </p>

          <h1 className="text-3xl sm:text-4xl font-black font-heading text-white mt-2">
            BOOKINGS
          </h1>

          <p className="text-sm text-forge-400 mt-2">
            Schedule and manage your member training sessions.
          </p>
        </div>

        <div className="flex items-center gap-2">

          {/* REFRESH */}
          <button
            type="button"
            onClick={loadData}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-forge-900 border border-forge-800 text-white text-sm font-semibold hover:border-brand-red/50 transition"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>

          {/* NEW SESSION */}
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-red hover:bg-brand-red/90 text-white text-sm font-semibold transition"
          >
            <Plus className="w-4 h-4" />
            New Session
          </button>
        </div>
      </div>

      {/* CREATE BOOKING FORM */}
      {showForm && (
        <Card className="p-6 bg-forge-900 border-forge-800">

          {/* FORM HEADER */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold font-heading text-white">
                Create Training Session
              </h2>

              <p className="text-xs text-forge-400 mt-1">
                Schedule a session for one of your assigned members.
              </p>
            </div>

            <button
              type="button"
              onClick={closeForm}
              className="w-9 h-9 rounded-lg bg-forge-950 border border-forge-800 flex items-center justify-center text-forge-400 hover:text-white transition"
              aria-label="Close form"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form
            onSubmit={handleCreateBooking}
            className="space-y-6"
          >

            {/* BASIC FIELDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* MEMBER */}
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

              {/* SESSION TITLE */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-forge-300 mb-2">
                  Session Title
                </label>

                <input
                  type="text"
                  value={title}
                  onChange={(e) =>
                    setTitle(e.target.value)
                  }
                  placeholder="Strength Training Session"
                  className="w-full bg-forge-950 border border-forge-800 rounded-xl px-4 py-3 text-sm text-white placeholder-forge-500 focus:outline-none focus:border-brand-red"
                />
              </div>

              {/* SESSION TYPE */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-forge-300 mb-2">
                  Session Type
                </label>

                <select
                  value={sessionType}
                  onChange={(e) =>
                    setSessionType(e.target.value)
                  }
                  className="w-full bg-forge-950 border border-forge-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-red"
                >
                  <option value="Personal Training">
                    Personal Training
                  </option>

                  <option value="Strength Training">
                    Strength Training
                  </option>

                  <option value="Weight Loss">
                    Weight Loss
                  </option>

                  <option value="Cardio">
                    Cardio
                  </option>

                  <option value="Functional Training">
                    Functional Training
                  </option>

                  <option value="Assessment">
                    Assessment
                  </option>
                </select>
              </div>

              {/* DATE */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-forge-300 mb-2">
                  Date
                </label>

                <input
                  type="date"
                  value={date}
                  onChange={(e) =>
                    setDate(e.target.value)
                  }
                  className="w-full bg-forge-950 border border-forge-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-red"
                />
              </div>

              {/* START TIME */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-forge-300 mb-2">
                  Start Time
                </label>

                <input
                  type="time"
                  value={startTime}
                  onChange={(e) =>
                    setStartTime(e.target.value)
                  }
                  className="w-full bg-forge-950 border border-forge-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-red"
                />
              </div>

              {/* END TIME */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-forge-300 mb-2">
                  End Time
                </label>

                <input
                  type="time"
                  value={endTime}
                  onChange={(e) =>
                    setEndTime(e.target.value)
                  }
                  className="w-full bg-forge-950 border border-forge-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-red"
                />
              </div>
            </div>

            {/* NOTES */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-forge-300 mb-2">
                Notes
              </label>

              <textarea
                rows={4}
                value={notes}
                onChange={(e) =>
                  setNotes(e.target.value)
                }
                placeholder="Session goals, special instructions..."
                className="w-full bg-forge-950 border border-forge-800 rounded-xl px-4 py-3 text-sm text-white placeholder-forge-500 focus:outline-none focus:border-brand-red resize-none"
              />
            </div>

            {/* FORM BUTTONS */}
            <div className="flex flex-col sm:flex-row justify-end gap-3">

              <button
                type="button"
                onClick={closeForm}
                className="px-5 py-2.5 rounded-xl bg-forge-950 border border-forge-800 text-forge-300 hover:text-white text-sm font-semibold transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={
                  isSaving ||
                  members.length === 0
                }
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand-red hover:bg-brand-red/90 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition"
              >
                <CalendarCheck className="w-4 h-4" />

                {isSaving
                  ? "Creating..."
                  : "Create Session"}
              </button>
            </div>
          </form>
        </Card>
      )}

      {/* BOOKINGS LIST */}
      <section>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <div>
            <h2 className="text-xl font-bold font-heading text-white">
              Training Sessions
            </h2>

            <p className="text-xs text-forge-400 mt-1">
              Your scheduled member sessions.
            </p>
          </div>

          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-orange/10 text-brand-orange text-xs font-semibold">
            <CalendarCheck className="w-3.5 h-3.5" />
            {bookings.length} Sessions
          </span>
        </div>

        {bookings.length === 0 ? (
          <Card className="p-12 bg-forge-900 border-forge-800 text-center">
            <CalendarCheck className="w-12 h-12 mx-auto text-forge-600 mb-4" />

            <h3 className="text-lg font-bold text-white">
              No Bookings Yet
            </h3>

            <p className="text-sm text-forge-400 mt-2">
              Create your first training session for a member.
            </p>

            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-red hover:bg-brand-red/90 text-white text-sm font-semibold transition"
            >
              <Plus className="w-4 h-4" />
              Create First Session
            </button>
          </Card>
        ) : (
          <div className="space-y-4">

            {bookings.map((booking) => (
              <Card
                key={booking._id}
                className="p-5 bg-forge-900 border-forge-800 hover:border-brand-red/30 transition"
              >
                <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">

                  {/* LEFT */}
                  <div className="flex items-start gap-4">

                    <div className="w-12 h-12 rounded-xl bg-brand-red/10 flex items-center justify-center shrink-0">
                      <CalendarCheck className="w-6 h-6 text-brand-orange" />
                    </div>

                    <div>
                      <h3 className="font-bold text-white">
                        {booking.title}
                      </h3>

                      <p className="text-xs text-forge-400 mt-1 flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        {getMemberName(booking.member)}
                      </p>

                      <p className="text-xs text-forge-500 mt-1">
                        {booking.sessionType || "Personal Training"}
                      </p>
                    </div>
                  </div>

                  {/* DATE + TIME */}
                  <div className="flex flex-wrap items-center gap-5">

                    <div>
                      <p className="text-xs text-forge-500">
                        Date
                      </p>

                      <p className="text-sm font-semibold text-white">
                        {new Date(
                          booking.date
                        ).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-forge-500 flex items-center gap-1">
                        <Clock3 className="w-3 h-3" />
                        Time
                      </p>

                      <p className="text-sm font-semibold text-white">
                        {booking.startTime}

                        {booking.endTime
                          ? ` - ${booking.endTime}`
                          : ""}
                      </p>
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex flex-wrap items-center gap-2">

                    <select
                      value={booking.status}
                      onChange={(e) =>
                        handleStatusChange(
                          booking._id,
                          e.target.value as BookingStatus
                        )
                      }
                      className="bg-forge-950 border border-forge-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-red"
                    >
                      <option value="pending">
                        Pending
                      </option>

                      <option value="confirmed">
                        Confirmed
                      </option>

                      <option value="completed">
                        Completed
                      </option>

                      <option value="cancelled">
                        Cancelled
                      </option>
                    </select>

                    <button
                      type="button"
                      onClick={() =>
                        handleDeleteBooking(
                          booking._id
                        )
                      }
                      className="w-9 h-9 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 flex items-center justify-center transition"
                      aria-label="Delete booking"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* NOTES */}
                {booking.notes && (
                  <div className="mt-4 pt-4 border-t border-forge-800">
                    <p className="text-xs text-forge-400">
                      <span className="font-semibold text-forge-300">
                        Notes:
                      </span>{" "}
                      {booking.notes}
                    </p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}