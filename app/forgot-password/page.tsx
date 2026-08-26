"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, KeyRound, ArrowLeft } from "lucide-react";

import { authService } from "@/services/authService";

type Step = "email" | "otp" | "password";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [step, setStep] = useState<Step>("email");

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const handleSendOtp = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!email.trim()) {
      alert("Please enter your email.");
      return;
    }

    try {
      setIsLoading(true);

      const response =
        await authService.forgotPassword(
          email.trim()
        );

      if (!response.success) {
        throw new Error(
          response.message || "Failed to send OTP"
        );
      }

      alert(
        "OTP has been sent to your email."
      );

      setStep("otp");
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Failed to send OTP"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!otp.trim()) {
      alert("Please enter the OTP.");
      return;
    }

    if (otp.length !== 6) {
      alert("OTP must be 6 digits.");
      return;
    }

    try {
      setIsLoading(true);

      const response =
        await authService.verifyResetOtp(
          email.trim(),
          otp.trim()
        );

      if (!response.success) {
        throw new Error(
          response.message || "Invalid OTP"
        );
      }

      alert("OTP verified successfully.");

      setStep("password");
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "OTP verification failed"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      alert(
        "Password must be at least 6 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      setIsLoading(true);

      const response =
        await authService.resetPassword(
          email.trim(),
          newPassword
        );

      if (!response.success) {
        throw new Error(
          response.message ||
            "Failed to reset password"
        );
      }

      alert(
        "Password reset successfully. Please login."
      );

      router.push("/login");
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Password reset failed"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-forge-950 text-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        <div className="bg-forge-900 border border-forge-800 rounded-3xl p-6 sm:p-8 shadow-2xl">

          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-brand-red/10 flex items-center justify-center">
              {step === "email" && (
                <Mail className="w-7 h-7 text-brand-orange" />
              )}

              {step === "otp" && (
                <KeyRound className="w-7 h-7 text-brand-orange" />
              )}

              {step === "password" && (
                <Lock className="w-7 h-7 text-brand-orange" />
              )}
            </div>

            <h1 className="text-2xl font-black font-heading mt-4">
              {step === "email" && "FORGOT PASSWORD"}

              {step === "otp" && "VERIFY OTP"}

              {step === "password" &&
                "RESET PASSWORD"}
            </h1>

            <p className="text-sm text-forge-400 mt-2">
              {step === "email" &&
                "Enter your email to receive a reset OTP."}

              {step === "otp" &&
                `Enter the 6-digit OTP sent to ${email}.`}

              {step === "password" &&
                "Create a new password for your account."}
            </p>
          </div>

          {/* STEP 1 */}
          {step === "email" && (
            <form
              onSubmit={handleSendOtp}
              className="space-y-5"
            >
              <div>
                <label className="block text-sm font-semibold text-forge-300 mb-2">
                  Email
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="harshitpatel766565@gmail.com"
                  className="w-full bg-forge-950 border border-forge-800 rounded-xl px-4 py-3 text-sm text-white placeholder-forge-500 focus:outline-none focus:border-brand-red"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-xl bg-brand-red hover:bg-brand-red/90 disabled:opacity-50 px-4 py-3 text-sm font-semibold transition"
              >
                {isLoading
                  ? "Sending OTP..."
                  : "Send OTP"}
              </button>
            </form>
          )}

          {/* STEP 2 */}
          {step === "otp" && (
            <form
              onSubmit={handleVerifyOtp}
              className="space-y-5"
            >
              <div>
                <label className="block text-sm font-semibold text-forge-300 mb-2">
                  Enter OTP
                </label>

                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={(e) =>
                    setOtp(
                      e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 6)
                    )
                  }
                  placeholder="123456"
                  className="w-full bg-forge-950 border border-forge-800 rounded-xl px-4 py-3 text-center text-2xl tracking-[0.5em] text-white placeholder-forge-600 focus:outline-none focus:border-brand-red"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={
                  isLoading || otp.length !== 6
                }
                className="w-full rounded-xl bg-brand-red hover:bg-brand-red/90 disabled:opacity-50 px-4 py-3 text-sm font-semibold transition"
              >
                {isLoading
                  ? "Verifying..."
                  : "Verify OTP"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setOtp("");
                  setStep("email");
                }}
                className="w-full text-xs text-forge-400 hover:text-white"
              >
                Use different email
              </button>
            </form>
          )}

          {/* STEP 3 */}
          {step === "password" && (
            <form
              onSubmit={handleResetPassword}
              className="space-y-5"
            >
              <div>
                <label className="block text-sm font-semibold text-forge-300 mb-2">
                  New Password
                </label>

                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) =>
                    setNewPassword(e.target.value)
                  }
                  placeholder="Enter new password"
                  className="w-full bg-forge-950 border border-forge-800 rounded-xl px-4 py-3 text-sm text-white placeholder-forge-500 focus:outline-none focus:border-brand-red"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-forge-300 mb-2">
                  Confirm Password
                </label>

                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value
                    )
                  }
                  placeholder="Confirm new password"
                  className="w-full bg-forge-950 border border-forge-800 rounded-xl px-4 py-3 text-sm text-white placeholder-forge-500 focus:outline-none focus:border-brand-red"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-xl bg-brand-red hover:bg-brand-red/90 disabled:opacity-50 px-4 py-3 text-sm font-semibold transition"
              >
                {isLoading
                  ? "Resetting..."
                  : "Reset Password"}
              </button>
            </form>
          )}

          <div className="mt-6 pt-5 border-t border-forge-800 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-sm text-brand-orange hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}