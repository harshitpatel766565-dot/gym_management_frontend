import React from 'react';
import { HeroSection } from '@/components/home/HeroSection';
import { ProgramsPreview } from '@/components/home/ProgramsPreview';
import { MembershipPreview } from '@/components/home/MembershipPreview';
import { TrainersPreview } from '@/components/home/TrainersPreview';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { FAQSection } from '@/components/home/FAQSection';
import { CTASection } from '@/components/home/CTASection';

export default function HomePage() {
  return (
    <div className="flex flex-col gap-0 overflow-hidden">
      <HeroSection />
      <FeaturesSection />
      <ProgramsPreview />
      <MembershipPreview />
      <TrainersPreview />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
    </div>
  );
}
