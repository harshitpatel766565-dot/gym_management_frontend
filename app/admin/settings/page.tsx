'use client';

import React, { useState, useEffect } from 'react';
import { homepageService, HomepageContent } from '@/services/homepageService';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { useToast } from '@/context/ToastContext';
import { Edit, Image as ImageIcon, Save, RefreshCw, AlertCircle } from 'lucide-react';

export default function AdminSettingsPage() {
  const { success, error } = useToast();
  const [content, setContent] = useState<HomepageContent>({
    heroTitle: '',
    heroSubtitle: '',
    heroBadgeText: '',
    heroBackgroundImage: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      const res = await homepageService.getHomepageContent();
      if (res.success && res.data) {
        setContent(res.data);
      }
    } catch (err) {
      console.error('Failed to load homepage settings:', err);
      error('Error', 'Failed to retrieve website settings.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await homepageService.updateHomepageContent(content);
      if (res.success) {
        success('Settings Saved', 'Homepage banner updated successfully.');
        if (res.data) {
          setContent(res.data);
        }
      } else {
        error('Error', res.message || 'Failed to save settings.');
      }
    } catch (err) {
      console.error('Save error:', err);
      error('Error', 'Unable to save settings.');
    } finally {
      setIsSaving(false);
    }
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
          setContent((prev) => ({
            ...prev,
            heroBackgroundImage: resData.url,
          }));
          success('Uploaded', 'Homepage banner image uploaded successfully.');
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

  if (isLoading) {
    return (
      <div className="pt-20 flex items-center justify-center min-h-screen bg-forge-950">
        <LoadingSpinner label="Retrieving homepage telemetry settings..." />
      </div>
    );
  }

  return (
    <div className="space-y-8 text-white">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black font-heading text-white uppercase tracking-tight">
          Website Settings &amp; Content Management
        </h1>
        <p className="text-xs text-forge-400 mt-0.5">
          Modify landing page hero titles, subtles, banner alerts and cover graphics live.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Editor Form */}
        <div className="lg:col-span-2">
          <Card className="p-6 bg-forge-900 border-forge-800 space-y-6">
            <h3 className="text-base font-bold uppercase tracking-wider font-heading text-white border-b border-forge-800 pb-3 flex items-center gap-2">
              <Edit className="w-4 h-4 text-brand-orange" />
              Hero Banner Content Configuration
            </h3>

            <form onSubmit={handleSave} className="space-y-5">
              <Input
                label="Hero Alert/Badge Text"
                value={content.heroBadgeText}
                onChange={(e) => setContent({ ...content, heroBadgeText: e.target.value })}
                placeholder="e.g., New Summer Transformation Protocols Live"
                required
              />

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-forge-300 font-heading mb-1.5">
                  Hero Title (HTML/Br tags allowed)
                </label>
                <textarea
                  rows={3}
                  value={content.heroTitle}
                  onChange={(e) => setContent({ ...content, heroTitle: e.target.value })}
                  placeholder="e.g. BUILD YOUR STRONGEST SELF"
                  required
                  className="w-full bg-forge-950 border border-forge-750 rounded-xl p-3.5 text-xs text-white placeholder-forge-500 focus:outline-none focus:border-brand-red font-heading font-black tracking-wide"
                />
                <span className="text-[10px] text-forge-500 mt-1 block">
                  Tip: Use `&lt;br /&gt;` to break titles onto multiple lines.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-forge-300 font-heading mb-1.5">
                  Hero Subtitle
                </label>
                <textarea
                  rows={2}
                  value={content.heroSubtitle}
                  onChange={(e) => setContent({ ...content, heroSubtitle: e.target.value })}
                  placeholder="e.g. Train harder. Live stronger. Become unstoppable."
                  required
                  className="w-full bg-forge-950 border border-forge-750 rounded-xl p-3.5 text-xs text-white placeholder-forge-500 focus:outline-none focus:border-brand-red"
                />
              </div>

              {/* Graphic Banner settings */}
              <div className="border border-forge-850 p-4 bg-forge-950/30 rounded-xl space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-forge-400 font-heading">
                  Banner Background Media
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-forge-300 mb-1.5 font-heading">
                      Upload Local Banner Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                      className="block w-full text-xs text-forge-300 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:uppercase file:font-heading file:bg-forge-850 file:text-white hover:file:bg-forge-800 cursor-pointer disabled:opacity-50"
                    />
                    {isUploading && (
                      <p className="text-[10px] text-brand-orange animate-pulse font-bold mt-1.5">
                        Uploading banner...
                      </p>
                    )}
                    {uploadError && (
                      <p className="text-[10px] text-brand-red font-bold mt-1.5">
                        {uploadError}
                      </p>
                    )}
                  </div>

                  <Input
                    label="Or Banner Image URL"
                    value={content.heroBackgroundImage}
                    onChange={(e) => setContent({ ...content, heroBackgroundImage: e.target.value })}
                    placeholder="https://example.com/background.jpg"
                    leftIcon={<ImageIcon className="w-4 h-4 text-forge-400" />}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="submit"
                  isLoading={isSaving}
                  disabled={isSaving || isUploading}
                  variant="primary"
                  className="flex-1 uppercase font-heading tracking-wider"
                  leftIcon={<Save className="w-4 h-4" />}
                >
                  Publish Changes Live
                </Button>
                <Button
                  type="button"
                  onClick={loadSettings}
                  variant="secondary"
                  className="uppercase font-heading tracking-wider"
                  leftIcon={<RefreshCw className="w-4 h-4" />}
                >
                  Discard
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Live Preview Display Card */}
        <div>
          <div className="sticky top-24 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-forge-400 font-heading">
              Hero Section Preview
            </h3>

            <Card className="overflow-hidden p-0 border-forge-800 bg-forge-900 relative shadow-2xl">
              {/* Fake Browser Top bar */}
              <div className="bg-forge-950 border-b border-forge-850 px-4 py-2 flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                <span className="text-[9px] font-bold text-forge-500 ml-4 tracking-wider uppercase font-mono">
                  ironforgefitness.com
                </span>
              </div>

              {/* Banner Area */}
              <div className="relative min-h-[300px] flex items-center justify-center p-6 text-center overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0 transition-all duration-300"
                  style={{
                    backgroundImage: `url('${content.heroBackgroundImage || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800'}')`,
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forge-950 via-forge-950/80 to-black/70 z-0" />

                <div className="relative z-10 space-y-3.5 w-full">
                  {content.heroBadgeText && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forge-900/80 border border-brand-red/30 backdrop-blur-sm text-[9px] uppercase font-bold text-forge-200 tracking-wider">
                      <span className="w-1 h-1 rounded-full bg-brand-orange animate-ping" />
                      {content.heroBadgeText}
                    </div>
                  )}

                  <h3
                    className="text-lg sm:text-2xl font-black font-heading tracking-tight text-white uppercase leading-tight"
                    dangerouslySetInnerHTML={{ __html: content.heroTitle || 'BUILD YOUR STRONGEST SELF' }}
                  />

                  <p className="text-[10px] text-forge-300 leading-relaxed max-w-sm mx-auto">
                    {content.heroSubtitle || 'Train harder. Live stronger. Become unstoppable.'}
                  </p>

                  <div className="flex justify-center gap-2 pt-1.5">
                    <div className="px-3.5 py-1 text-[9px] uppercase font-bold tracking-wider rounded bg-brand-red text-white">
                      Join Now
                    </div>
                    <div className="px-3.5 py-1 text-[9px] uppercase font-bold tracking-wider rounded border border-forge-700 bg-forge-950/30 text-white">
                      Explore
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <div className="flex items-center gap-2 p-3.5 rounded-xl bg-amber-950/20 border border-amber-900/30 text-[10px] text-amber-300">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                Note: Updating these settings saves the changes to the central MongoDB database and reflects immediately for all users on the homepage.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
