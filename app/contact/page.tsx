'use client';

import React, { useState } from 'react';
import { BRAND } from '@/lib/constants';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useToast } from '@/context/ToastContext';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageCircle,
  Flame,
} from 'lucide-react';

export default function ContactPage() {
  const { success } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    interest: 'Membership Inquiries',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const apiBaseUrl = process.env.NEXT_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiBaseUrl}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send message');
      }

      success(
        'Message Dispatched!',
        'Our front desk team will contact you within 2 business hours.'
      );

      setFormData({
        name: '',
        email: '',
        phone: '',
        interest: 'Membership Inquiries',
        message: '',
      });
    } catch (error) {
      console.error('Contact form error:', error);

      success(
        'Message Failed',
        error instanceof Error
          ? error.message
          : 'Unable to send your message. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-28 pb-20 bg-forge-950 text-forge-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-forge-900 border border-brand-red/40 text-xs font-bold uppercase tracking-widest text-brand-orange font-heading mb-4">
            <Flame className="w-4 h-4" />
            <span>Connect with Front Desk</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black font-heading text-white tracking-tight uppercase">
            GET IN <span className="text-brand-red">TOUCH</span>
          </h1>

          <p className="text-forge-300 text-sm sm:text-base mt-2">
            Schedule a private gym tour, ask questions about our coaching
            tiers, or activate your complimentary guest pass.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* Contact Form */}
          <div className="lg:col-span-7">
            <Card className="p-8 bg-forge-900 border-forge-800 shadow-2xl space-y-6">

              <div>
                <h3 className="text-2xl font-bold font-heading text-white uppercase">
                  Send Us A Message
                </h3>

                <p className="text-xs text-forge-400 mt-1">
                  Fill out the form below and an IRONFORGE coach will respond
                  promptly.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  <Input
                    label="Full Name"
                    required
                    placeholder="Alex Johnson"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        name: e.target.value,
                      })
                    }
                  />

                  <Input
                    label="Email Address"
                    type="email"
                    required
                    placeholder="alex@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        email: e.target.value,
                      })
                    }
                  />

                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  <Input
                    label="Phone / Mobile Number"
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        phone: e.target.value,
                      })
                    }
                  />

                  <Select
                    label="Area of Interest"
                    value={formData.interest}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        interest: e.target.value,
                      })
                    }
                    options={[
                      {
                        value: 'Membership Inquiries',
                        label: 'Membership Tiers & Pricing',
                      },
                      {
                        value: 'Personal Training',
                        label: '1-on-1 Personal Coaching',
                      },
                      {
                        value: 'Free Guest Pass',
                        label: '1-Day Free Trial Pass',
                      },
                      {
                        value: 'Facility Tour',
                        label: 'Private Facility Walkthrough',
                      },
                      {
                        value: 'Corporate Partnerships',
                        label: 'Corporate Wellness Pass',
                      },
                    ]}
                  />

                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-forge-300 font-heading mb-1.5">
                    Your Message / Goals
                  </label>

                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us about your fitness background and goals..."
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        message: e.target.value,
                      })
                    }
                    className="w-full bg-forge-950 border border-forge-750 rounded-xl p-3 text-xs text-white placeholder-forge-500 focus:outline-none focus:border-brand-red"
                  />
                </div>

                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  size="lg"
                  variant="primary"
                  className="w-full uppercase font-heading tracking-wider"
                  rightIcon={<Send className="w-4 h-4" />}
                >
                  {isSubmitting ? 'Sending...' : 'Dispatch Message'}
                </Button>

              </form>
            </Card>
          </div>

          {/* Contact Info & Map */}
          <div className="lg:col-span-5 space-y-6">

            <Card className="p-8 bg-forge-900 border-forge-800 space-y-6">

              <h3 className="text-xl font-bold font-heading text-white uppercase tracking-wide">
                Facility Coordinates
              </h3>

              <div className="space-y-4 text-xs">

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />

                  <div>
                    <span className="font-bold text-white block">
                      Location
                    </span>

                    <p className="text-forge-300 mt-0.5">
                      {BRAND.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-brand-red shrink-0 mt-0.5" />

                  <div>
                    <span className="font-bold text-white block">
                      Telephone Hotline
                    </span>

                    <a
                      href={`tel:${BRAND.phone}`}
                      className="text-brand-orange hover:underline mt-0.5 block"
                    >
                      {BRAND.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />

                  <div>
                    <span className="font-bold text-white block">
                      Email Desk
                    </span>

                    <a
                      href={`mailto:${BRAND.email}`}
                      className="text-forge-300 hover:underline mt-0.5 block"
                    >
                      {BRAND.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-2 border-t border-forge-800">

                  <Clock className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />

                  <div>
                    <span className="font-bold text-white block">
                      Gym Operating Hours
                    </span>

                    <p className="text-forge-400 mt-1">
                      Weekdays: {BRAND.hours.weekdays}
                    </p>

                    <p className="text-forge-400">
                      Saturday: {BRAND.hours.saturday}
                    </p>

                    <p className="text-forge-400">
                      Sunday: {BRAND.hours.sunday}
                    </p>
                  </div>

                </div>

              </div>

              {/* WhatsApp */}
              <a
                href={`https://wa.me/${BRAND.whatsapp}?text=Hi%20IRONFORGE%20Team!`}
                target="_blank"
                rel="noreferrer"
                className="block"
              >
                <Button
                  variant="secondary"
                  size="md"
                  className="w-full bg-emerald-950/40 border-emerald-800 text-emerald-400 hover:bg-emerald-900/50"
                  leftIcon={<MessageCircle className="w-4 h-4" />}
                >
                  Chat Directly on WhatsApp
                </Button>
              </a>

            </Card>

            {/* Map */}
            <div className="rounded-3xl overflow-hidden border border-forge-800 h-64 bg-forge-900 relative">

              <iframe
                title="IRONFORGE Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.588478440361!2d72.8310!3d19.1250!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDA3JzMwLjAiTiA3MsKwNDknNTEuNiJF!5e0!3m2!1sen!2sin!4v1600000000000!5m2!1sen!2sin"
                className="w-full h-full border-0 filter invert contrast-125 opacity-80"
                allowFullScreen
                loading="lazy"
              />

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}