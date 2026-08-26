'use client';

import React, { useState, useMemo } from 'react';
import {
  calculateBMI,
  calculateCalories,
  BmiResult,
  CalorieResult,
  ActivityLevel,
  FitnessGoal,
} from '@/lib/calculators';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import {
  Scale,
  Flame,
  Activity,
  Info,
  ArrowRight,
  Target,
  Droplets,
  Apple,
} from 'lucide-react';
import Link from 'next/link';

export default function CalculatorsPage() {
  const [activeTab, setActiveTab] = useState<'bmi' | 'calorie'>('bmi');

  // Shared Biometric States
  const [age, setAge] = useState<number>(26);
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [height, setHeight] = useState<number>(178);
  const [weight, setWeight] = useState<number>(76.5);

  // Calorie-specific States
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('very_active');
  const [goal, setGoal] = useState<FitnessGoal>('muscle_gain');

  // Calculated Results
  const bmiResult: BmiResult = useMemo(() => {
    return calculateBMI(height, weight, age, gender);
  }, [height, weight, age, gender]);

  const calorieResult: CalorieResult = useMemo(() => {
    return calculateCalories(age, gender, height, weight, activityLevel, goal);
  }, [age, gender, height, weight, activityLevel, goal]);

  return (
    <div className="pt-28 pb-20 bg-forge-950 text-forge-100 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-forge-900 border border-brand-red/40 text-xs font-bold uppercase tracking-widest text-brand-orange font-heading mb-4">
            <Activity className="w-4 h-4 animate-pulse text-brand-red" />
            <span>Biometric Analytics & Tools</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black font-heading text-white tracking-tight uppercase">
            FITNESS <span className="text-brand-red">CALCULATORS</span>
          </h1>
          <p className="text-forge-300 text-sm sm:text-base mt-2">
            Compute your body stats, identify healthy target weights, and formulate precision macronutrient guidelines for your physique goals.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-forge-900 p-1.5 rounded-2xl border border-forge-750 max-w-md mx-auto mb-10 shadow-lg">
          <button
            onClick={() => setActiveTab('bmi')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold uppercase font-heading tracking-wide transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'bmi'
                ? 'bg-gradient-to-r from-brand-red to-brand-orange text-white shadow-lg shadow-brand-red/20'
                : 'text-forge-400 hover:text-white'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>BMI Calculator</span>
          </button>
          <button
            onClick={() => setActiveTab('calorie')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold uppercase font-heading tracking-wide transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'calorie'
                ? 'bg-gradient-to-r from-brand-red to-brand-orange text-white shadow-lg shadow-brand-red/20'
                : 'text-forge-400 hover:text-white'
            }`}
          >
            <Flame className="w-4 h-4" />
            <span>Calorie & TDEE</span>
          </button>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Inputs Column */}
          <Card className="lg:col-span-5 p-8 bg-forge-900 border-forge-800 shadow-2xl space-y-6">
            <h3 className="text-xl font-bold font-heading text-white uppercase tracking-wide flex items-center gap-2">
              <Activity className="w-5 h-5 text-brand-orange" />
              Your Measurements
            </h3>

            {/* Gender Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-forge-300 font-heading mb-2">
                Biological Gender
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['male', 'female', 'other'] as const).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGender(g)}
                    className={`py-2 rounded-xl text-xs font-bold uppercase font-heading transition-all cursor-pointer ${
                      gender === g
                        ? 'bg-brand-red text-white shadow-md'
                        : 'bg-forge-950 border border-forge-800 text-forge-400 hover:text-white'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Age Slider */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-forge-300 font-heading uppercase">Age:</span>
                <span className="text-brand-orange font-bold font-heading">{age} years</span>
              </div>
              <input
                type="range"
                min="14"
                max="85"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full accent-brand-red bg-forge-950 cursor-pointer"
              />
            </div>

            {/* Height Slider */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-forge-300 font-heading uppercase">Height:</span>
                <span className="text-brand-orange font-bold font-heading">
                  {height} cm ({Math.floor(height / 30.48)}&apos;{Math.round((height % 30.48) / 2.54)}&quot;)
                </span>
              </div>
              <input
                type="range"
                min="120"
                max="230"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-full accent-brand-red bg-forge-950 cursor-pointer"
              />
            </div>

            {/* Weight Slider */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-forge-300 font-heading uppercase">Current Weight:</span>
                <span className="text-brand-orange font-bold font-heading">{weight} kg</span>
              </div>
              <input
                type="range"
                min="35"
                max="180"
                step="0.5"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full accent-brand-red bg-forge-950 cursor-pointer"
              />
            </div>

            {/* Calorie Specific Inputs */}
            {activeTab === 'calorie' && (
              <div className="pt-4 border-t border-forge-800 space-y-4">
                <Select
                  label="Activity Level"
                  value={activityLevel}
                  onChange={(e) => setActivityLevel(e.target.value as ActivityLevel)}
                  options={[
                    { value: 'sedentary', label: 'Sedentary (Desk Job, little exercise)' },
                    { value: 'light', label: 'Light Activity (Exercise 1-3 days/week)' },
                    { value: 'moderate', label: 'Moderate Activity (Exercise 3-5 days/week)' },
                    { value: 'very_active', label: 'Very Active (Intense Exercise 6-7 days/week)' },
                    { value: 'extra_active', label: 'Extra Active (Physical Job or 2x Daily)' },
                  ]}
                />

                <Select
                  label="Primary Physique Goal"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value as FitnessGoal)}
                  options={[
                    { value: 'maintain', label: 'Maintain Weight & Body Recomposition' },
                    { value: 'mild_loss', label: 'Mild Fat Loss (-250 kcal/day)' },
                    { value: 'weight_loss', label: 'Standard Weight Loss (-500 kcal/day)' },
                    { value: 'extreme_loss', label: 'Intense Cut (-750 kcal/day)' },
                    { value: 'mild_gain', label: 'Lean Bulk (+300 kcal/day)' },
                    { value: 'muscle_gain', label: 'Aggressive Hypertrophy (+500 kcal/day)' },
                  ]}
                />
              </div>
            )}

            <div className="p-4 rounded-2xl bg-forge-950 border border-forge-850 text-xs text-forge-400 space-y-1">
              <span className="font-bold text-forge-300 flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-brand-orange" />
                Shared Biometrics:
              </span>
              <p>
                Your biological settings are shared between both calculators. Switch tabs freely without re-entering your height and weight.
              </p>
            </div>
          </Card>

          {/* Results Output Column */}
          <div className="lg:col-span-7 space-y-6">
            {activeTab === 'bmi' ? (
              // BMI Tab Results
              <>
                <Card className="p-8 bg-forge-900 border-2 border-brand-red/30 shadow-forge-glow relative overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-forge-800">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-forge-400 font-heading">
                        Calculated Score
                      </span>
                      <div className="flex items-baseline gap-3 mt-1">
                        <span className="text-5xl sm:text-6xl font-black font-heading text-white tracking-tight">
                          {bmiResult.bmi}
                        </span>
                        <span
                          className="text-xs font-bold uppercase font-heading px-3 py-1 rounded-full border"
                          style={{ color: bmiResult.color, borderColor: bmiResult.color }}
                        >
                          {bmiResult.category}
                        </span>
                      </div>
                    </div>

                    <div className="text-right sm:border-l sm:border-forge-800 sm:pl-6">
                      <span className="text-xs text-forge-400 block font-heading uppercase">Healthy Target</span>
                      <span className="text-xl font-bold font-heading text-emerald-400">
                        {bmiResult.minHealthyWeight} – {bmiResult.maxHealthyWeight} kg
                      </span>
                    </div>
                  </div>

                  {/* Visual Gauge Bar */}
                  <div className="my-6 space-y-2">
                    <div className="flex justify-between text-[9px] sm:text-[11px] font-bold text-forge-400 uppercase font-heading">
                      <span>Underweight (&lt;18.5)</span>
                      <span>Normal (18.5-24.9)</span>
                      <span>Overweight (25-29.9)</span>
                      <span>Obese (30+)</span>
                    </div>

                    <div className="relative h-4 rounded-full bg-forge-950 overflow-hidden flex">
                      <div className="w-1/4 h-full bg-blue-500/70" title="Underweight" />
                      <div className="w-1/4 h-full bg-emerald-500/70" title="Normal" />
                      <div className="w-1/4 h-full bg-amber-500/70" title="Overweight" />
                      <div className="w-1/4 h-full bg-red-500/70" title="Obese" />
                    </div>

                    {/* Cursor Needle */}
                    <div className="relative w-full h-3">
                      <div
                        className="absolute top-0 -translate-x-1/2 transition-all duration-500 flex flex-col items-center"
                        style={{ left: `${bmiResult.gaugePercentage}%` }}
                      >
                        <div className="w-3 h-3 bg-white rotate-45 border-2 border-brand-red shadow-md" />
                      </div>
                    </div>
                  </div>

                  {/* Recommendation Card */}
                  <div className="p-5 rounded-2xl bg-forge-950 border border-forge-800 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-brand-orange font-heading flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-brand-orange" />
                      Tailored IRONFORGE Recommendation
                    </h4>
                    <p className="text-xs sm:text-sm text-forge-200 leading-relaxed">
                      {bmiResult.recommendation}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => setActiveTab('calorie')}
                      className="w-full sm:w-auto flex-1 inline-flex items-center justify-center transition-all duration-200 cursor-pointer font-heading tracking-wide uppercase px-5 py-2.5 text-sm font-semibold rounded-xl gap-2 bg-forge-800 hover:bg-forge-750 text-forge-100 border border-forge-700 hover:border-forge-600"
                    >
                      <span>Calculate Daily Calories</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <Link href="/programs" className="w-full sm:w-auto flex-1">
                      <Button variant="primary" size="md" className="w-full">
                        View Matching Programs
                      </Button>
                    </Link>
                  </div>
                </Card>

                {/* Benchmark Table */}
                <Card className="p-6 bg-forge-900 border-forge-800 text-xs">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white font-heading mb-3">
                    Standard BMI Categories Breakdown
                  </h4>
                  <div className="divide-y divide-forge-800">
                    <div className="py-2 flex justify-between">
                      <span className="text-blue-400 font-semibold">Underweight</span>
                      <span className="text-forge-300">Less than 18.5</span>
                    </div>
                    <div className="py-2 flex justify-between">
                      <span className="text-emerald-400 font-semibold">Normal Weight</span>
                      <span className="text-forge-300">18.5 – 24.9</span>
                    </div>
                    <div className="py-2 flex justify-between">
                      <span className="text-amber-400 font-semibold">Overweight</span>
                      <span className="text-forge-300">25.0 – 29.9</span>
                    </div>
                    <div className="py-2 flex justify-between">
                      <span className="text-red-400 font-semibold">Obese</span>
                      <span className="text-forge-300">30.0 and above</span>
                    </div>
                  </div>
                </Card>
              </>
            ) : (
              // Calories Tab Results
              <Card className="p-8 bg-forge-900 border-2 border-brand-red/40 shadow-forge-glow relative">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-forge-800">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-orange font-heading">
                      Target Daily Intake
                    </span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-5xl sm:text-6xl font-black font-heading text-white tracking-tight">
                        {calorieResult.targetCalories.toLocaleString()}
                      </span>
                      <span className="text-base text-forge-400 font-bold font-heading">kcal / day</span>
                    </div>
                    <p className="text-xs text-emerald-400 font-semibold mt-1 flex items-center gap-1">
                      <Target className="w-3.5 h-3.5" /> {calorieResult.goalLabel}
                    </p>
                  </div>

                  <div className="space-y-2 sm:text-right sm:border-l sm:border-forge-800 sm:pl-6">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-forge-400 font-heading block">
                        BMR (Basal Rate)
                      </span>
                      <span className="text-lg font-bold font-heading text-white">
                        {calorieResult.bmr} kcal
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-forge-400 font-heading block">
                        TDEE (Maintenance)
                      </span>
                      <span className="text-lg font-bold font-heading text-forge-300">
                        {calorieResult.tdee} kcal
                      </span>
                    </div>
                  </div>
                </div>

                {/* Macronutrient Split Breakdown */}
                <div className="my-6 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white font-heading flex items-center gap-2">
                    <Apple className="w-4 h-4 text-brand-orange" />
                    Target Macronutrient Profile
                  </h4>

                  <div className="grid grid-cols-3 gap-3">
                    {/* Protein */}
                    <div className="p-3 sm:p-4 rounded-2xl bg-brand-red/10 border border-brand-red/30 text-center">
                      <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-brand-red font-heading block">
                        Protein ({calorieResult.macros.protein.percentage}%)
                      </span>
                      <span className="text-xl sm:text-2xl font-black font-heading text-white mt-1 block">
                        {calorieResult.macros.protein.grams}g
                      </span>
                      <span className="text-[9px] sm:text-[10px] text-forge-400">
                        {calorieResult.macros.protein.calories} kcal
                      </span>
                    </div>

                    {/* Carbs */}
                    <div className="p-3 sm:p-4 rounded-2xl bg-blue-950/40 border border-blue-800/40 text-center">
                      <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-blue-400 font-heading block">
                        Carbs ({calorieResult.macros.carbs.percentage}%)
                      </span>
                      <span className="text-xl sm:text-2xl font-black font-heading text-white mt-1 block">
                        {calorieResult.macros.carbs.grams}g
                      </span>
                      <span className="text-[9px] sm:text-[10px] text-forge-400">
                        {calorieResult.macros.carbs.calories} kcal
                      </span>
                    </div>

                    {/* Fats */}
                    <div className="p-3 sm:p-4 rounded-2xl bg-amber-950/40 border border-amber-800/40 text-center">
                      <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-amber-400 font-heading block">
                        Fats ({calorieResult.macros.fats.percentage}%)
                      </span>
                      <span className="text-xl sm:text-2xl font-black font-heading text-white mt-1 block">
                        {calorieResult.macros.fats.grams}g
                      </span>
                      <span className="text-[9px] sm:text-[10px] text-forge-400">
                        {calorieResult.macros.fats.calories} kcal
                      </span>
                    </div>
                  </div>

                  {/* Macro Bar representation */}
                  <div className="h-3 rounded-full overflow-hidden flex bg-forge-950">
                    <div
                      style={{ width: `${calorieResult.macros.protein.percentage}%` }}
                      className="bg-brand-red"
                      title="Protein"
                    />
                    <div
                      style={{ width: `${calorieResult.macros.carbs.percentage}%` }}
                      className="bg-blue-500"
                      title="Carbs"
                    />
                    <div
                      style={{ width: `${calorieResult.macros.fats.percentage}%` }}
                      className="bg-amber-500"
                      title="Fats"
                    />
                  </div>
                </div>

                {/* Water requirement */}
                <div className="p-4 rounded-2xl bg-forge-950 border border-forge-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Droplets className="w-6 h-6 text-blue-400 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-white font-heading">
                        Recommended Daily Hydration
                      </p>
                      <p className="text-[9px] sm:text-[10px] text-forge-400">
                        Based on your body mass and active training volume
                      </p>
                    </div>
                  </div>
                  <span className="text-xl font-black font-heading text-blue-400">
                    {calorieResult.waterIntakeLiters} Liters
                  </span>
                </div>

                {/* Next Steps */}
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <Link href="/trainers" className="w-full sm:w-auto flex-1">
                    <Button variant="secondary" size="md" className="w-full">
                      Consult Nutrition Coach
                    </Button>
                  </Link>
                  <Link href="/programs" className="w-full sm:w-auto flex-1">
                    <Button variant="primary" size="md" className="w-full" rightIcon={<ArrowRight className="w-4 h-4" />}>
                      Start Program Now
                    </Button>
                  </Link>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
