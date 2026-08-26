export interface BmiResult {
  bmi: number;
  category: 'Underweight' | 'Normal weight' | 'Overweight' | 'Obese Class I' | 'Obese Class II / Extreme';
  color: string;
  minHealthyWeight: number;
  maxHealthyWeight: number;
  healthyWeightDifference: number; // difference from midpoint
  recommendation: string;
  gaugePercentage: number; // 0 to 100 for gauge visualization
}

export function calculateBMI(
  heightCm: number,
  weightKg: number,
  age: number,
  gender: 'male' | 'female' | 'other'
): BmiResult {
  if (heightCm <= 0 || weightKg <= 0) {
    return {
      bmi: 0,
      category: 'Normal weight',
      color: '#10B981',
      minHealthyWeight: 0,
      maxHealthyWeight: 0,
      healthyWeightDifference: 0,
      recommendation: 'Please enter valid height and weight values.',
      gaugePercentage: 0,
    };
  }

  const heightM = heightCm / 100;
  const bmi = parseFloat((weightKg / (heightM * heightM)).toFixed(1));
  
  // Healthy range is BMI 18.5 - 24.9
  const minHealthyWeight = parseFloat((18.5 * heightM * heightM).toFixed(1));
  const maxHealthyWeight = parseFloat((24.9 * heightM * heightM).toFixed(1));
  const midHealthyWeight = (minHealthyWeight + maxHealthyWeight) / 2;
  const healthyWeightDifference = parseFloat((weightKg - midHealthyWeight).toFixed(1));

  let category: BmiResult['category'];
  let color: string;
  let recommendation: string;
  let gaugePercentage: number;

  if (bmi < 18.5) {
    category = 'Underweight';
    color = '#3B82F6'; // Blue
    recommendation = `You are currently below the ideal weight range. Focus on nutrient-dense calorie surplus, progressive resistance training, and high protein intake to build lean muscle safely. Aim to reach around ${minHealthyWeight} kg.`;
    gaugePercentage = Math.min(25, (bmi / 18.5) * 25);
  } else if (bmi <= 24.9) {
    category = 'Normal weight';
    color = '#10B981'; // Green
    recommendation = `Great job! Your BMI is within the ideal healthy range. Maintain your current lifestyle with balanced macronutrients, consistent strength training 3-4x weekly, and adequate recovery.`;
    gaugePercentage = 25 + ((bmi - 18.5) / (24.9 - 18.5)) * 25;
  } else if (bmi <= 29.9) {
    category = 'Overweight';
    color = '#F59E0B'; // Amber
    recommendation = `You are slightly above the standard range. A moderate calorie deficit of 300-500 kcal, combined with HIIT cardio and compound lifting at IRONFORGE, will help optimize your body composition. Target weight: ${maxHealthyWeight} kg.`;
    gaugePercentage = 50 + ((bmi - 25) / (29.9 - 25)) * 25;
  } else if (bmi <= 34.9) {
    category = 'Obese Class I';
    color = '#F97316'; // Orange
    recommendation = `Consider consulting with our IRONFORGE certified nutrition coaches. A structured progressive deficit and low-impact functional training will steadily bring your body fat percentage to a healthy zone.`;
    gaugePercentage = 75 + ((bmi - 30) / (34.9 - 30)) * 12.5;
  } else {
    category = 'Obese Class II / Extreme';
    color = '#EF4444'; // Red
    recommendation = `We recommend a tailored fitness and metabolic regimen supervised by a dedicated personal trainer. Focus on consistent daily steps, wholesome whole foods, and cardiovascular strengthening.`;
    gaugePercentage = Math.min(100, 87.5 + ((bmi - 35) / 10) * 12.5);
  }

  return {
    bmi,
    category,
    color,
    minHealthyWeight,
    maxHealthyWeight,
    healthyWeightDifference,
    recommendation,
    gaugePercentage: Math.min(100, Math.max(0, gaugePercentage)),
  };
}

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'very_active' | 'extra_active';
export type FitnessGoal = 'mild_loss' | 'weight_loss' | 'extreme_loss' | 'maintain' | 'mild_gain' | 'muscle_gain';

export interface CalorieResult {
  bmr: number;
  tdee: number;
  targetCalories: number;
  calorieDifference: number;
  goalLabel: string;
  macros: {
    protein: { grams: number; calories: number; percentage: number };
    carbs: { grams: number; calories: number; percentage: number };
    fats: { grams: number; calories: number; percentage: number };
  };
  waterIntakeLiters: number;
}

export function calculateCalories(
  age: number,
  gender: 'male' | 'female' | 'other',
  heightCm: number,
  weightKg: number,
  activityLevel: ActivityLevel,
  goal: FitnessGoal
): CalorieResult {
  // Mifflin-St Jeor Equation
  let bmr: number;
  if (gender === 'female') {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  } else {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  }

  const activityMultipliers: Record<ActivityLevel, number> = {
    sedentary: 1.2,       // Little to no exercise
    light: 1.375,         // Exercise 1-3 times/week
    moderate: 1.55,       // Exercise 4-5 times/week
    very_active: 1.725,   // Daily intense exercise
    extra_active: 1.9,    // 2x daily or physical labor
  };

  const tdee = Math.round(bmr * (activityMultipliers[activityLevel] || 1.55));

  let targetCalories = tdee;
  let calorieDifference = 0;
  let goalLabel = 'Maintain Current Weight';

  switch (goal) {
    case 'mild_loss':
      targetCalories = tdee - 250;
      calorieDifference = -250;
      goalLabel = 'Mild Weight Loss (-0.25 kg/week)';
      break;
    case 'weight_loss':
      targetCalories = tdee - 500;
      calorieDifference = -500;
      goalLabel = 'Weight Loss (-0.5 kg/week)';
      break;
    case 'extreme_loss':
      targetCalories = tdee - 750;
      calorieDifference = -750;
      goalLabel = 'Intense Weight Loss (-0.75 kg/week)';
      break;
    case 'mild_gain':
      targetCalories = tdee + 300;
      calorieDifference = +300;
      goalLabel = 'Lean Bulk (+0.3 kg/week)';
      break;
    case 'muscle_gain':
      targetCalories = tdee + 500;
      calorieDifference = +500;
      goalLabel = 'Muscle Hypertrophy (+0.5 kg/week)';
      break;
    case 'maintain':
    default:
      targetCalories = tdee;
      calorieDifference = 0;
      goalLabel = 'Maintain Weight & Tone';
      break;
  }

  // Macronutrient split calculation:
  // High protein for lifters: 2.2g per kg bodyweight
  const proteinGrams = Math.round(Math.min(targetCalories * 0.35 / 4, weightKg * 2.2));
  const proteinCalories = proteinGrams * 4;

  // Fats: 25% of total calories
  const fatCalories = Math.round(targetCalories * 0.25);
  const fatGrams = Math.round(fatCalories / 9);

  // Remainder: Carbohydrates
  const carbCalories = Math.max(0, targetCalories - proteinCalories - fatCalories);
  const carbGrams = Math.round(carbCalories / 4);

  const totalCalculated = proteinCalories + fatCalories + carbCalories;

  const waterIntakeLiters = parseFloat(((weightKg * 0.033) + (activityLevel !== 'sedentary' ? 0.7 : 0)).toFixed(1));

  return {
    bmr: Math.round(bmr),
    tdee,
    targetCalories,
    calorieDifference,
    goalLabel,
    macros: {
      protein: {
        grams: proteinGrams,
        calories: proteinCalories,
        percentage: Math.round((proteinCalories / totalCalculated) * 100),
      },
      carbs: {
        grams: carbGrams,
        calories: carbCalories,
        percentage: Math.round((carbCalories / totalCalculated) * 100),
      },
      fats: {
        grams: fatGrams,
        calories: fatCalories,
        percentage: Math.round((fatCalories / totalCalculated) * 100),
      },
    },
    waterIntakeLiters,
  };
}
