export const BRAND = {
  name: 'IRONFORGE',
  tagline: 'BUILD YOUR STRONGEST SELF',
  subtitle: 'Train harder. Live stronger. Become unstoppable.',
  phone: '+91 98765 43210',
  whatsapp: '919876543210',
  email: 'support@ironforgegym.com',
  address: 'Level 4, Titanium Heights, Prime Hub Road, Mumbai, Maharashtra 400053',
  googleMapsUrl: 'https://maps.google.com/?q=Titanium+Heights+Mumbai',
  hours: {
    weekdays: '05:00 AM – 11:00 PM',
    saturday: '06:00 AM – 10:00 PM',
    sunday: '07:00 AM – 08:00 PM',
  },
  socials: {
    instagram: 'https://instagram.com/ironforgefitness',
    youtube: 'https://youtube.com/@ironforgefitness',
    twitter: 'https://twitter.com/ironforgefit',
    facebook: 'https://facebook.com/ironforgegym',
  },
};

export const HERO_STATS = [
  { label: 'Active Members', value: '500+', numeric: 500, suffix: '+' },
  { label: 'Expert Trainers', value: '20+', numeric: 20, suffix: '+' },
  { label: 'Dynamic Programs', value: '15+', numeric: 15, suffix: '+' },
  { label: 'Years Experience', value: '10+', numeric: 10, suffix: '+' },
];

export const NAV_LINKS = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Programs', href: '/programs' },
  { name: 'Trainers', href: '/trainers' },
  { name: 'Membership', href: '/membership' },
  { name: 'Workouts', href: '/workouts' },
  { name: 'Calculators', href: '/calculators' },
  { name: 'Products', href: '/products' },
  { name: 'Contact', href: '/contact' },
];

export const USER_NAV_LINKS = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Progress Tracker', href: '/dashboard/progress' },
  { name: 'Attendance', href: '/dashboard/attendance' },
  { name: 'My Bookings', href: '/dashboard/bookings' },
  { name: 'Profile Settings', href: '/dashboard/profile' },
];

export const ADMIN_NAV_LINKS = [
  { name: 'Analytics', href: '/admin', icon: 'BarChart3' },
  { name: 'Users', href: '/admin/users', icon: 'Users' },
  { name: 'Trainers', href: '/admin/trainers', icon: 'UserCheck' },
  { name: 'Memberships', href: '/admin/memberships', icon: 'CreditCard' },
  { name: 'Programs', href: '/admin/programs', icon: 'Dumbbell' },
  { name: 'Workouts', href: '/admin/workouts', icon: 'Activity' },
  { name: 'Bookings', href: '/admin/bookings', icon: 'Calendar' },
  { name: 'Attendance', href: '/admin/attendance', icon: 'Clock' },
  { name: 'Payments', href: '/admin/payments', icon: 'Receipt' },
  { name: 'Products', href: '/admin/products', icon: 'Package' },
  { name: 'Settings', href: '/admin/settings', icon: 'Settings' },
];

export const FAQS = [
  {
    question: 'What are the operating hours of IRONFORGE?',
    answer: 'We are open Monday through Friday from 5:00 AM to 11:00 PM, Saturday from 6:00 AM to 10:00 PM, and Sunday from 7:00 AM to 8:00 PM.',
  },
  {
    question: 'Can I freeze or cancel my membership?',
    answer: 'Yes! You can freeze your membership for up to 30 days once per year directly from your member dashboard or by contacting front desk.',
  },
  {
    question: 'Are personal training sessions included in the membership?',
    answer: 'Pro memberships include 2 personal training sessions per month, and Elite memberships include 8 sessions per month with custom nutrition planning.',
  },
  {
    question: 'How do I book a trainer or class?',
    answer: 'Simply log into your dashboard, go to the Bookings section or click on any trainer profile, choose your desired time slot and confirm.',
  },
  {
    question: 'Is there a trial period available?',
    answer: 'Yes, we provide a complimentary 1-day guest pass for new visitors. Contact us or visit our front desk to activate your trial pass.',
  },
  {
    question: 'What amenities are available at the facility?',
    answer: 'Our state-of-the-art facility includes premium Olympic lifting platforms, recovery saunas, steam rooms, luxury locker facilities, a dedicated CrossFit arena, and a protein shake bar.',
  },
];

export const TESTIMONIALS = [
  {
    id: '1',
    name: 'Vikram Malhotra',
    role: 'Member since 2022',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    content: 'IRONFORGE completely transformed my physique and mindset. The trainers push you to your absolute best and the equipment is top tier. Dropped 14kg in 5 months!',
    rating: 5,
    achievement: 'Lost 14kg • Gained 6kg Muscle',
  },
  {
    id: '2',
    name: 'Ananya Sharma',
    role: 'Pro Member',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    content: 'The energy here is infectious! The HIIT and CrossFit classes are high voltage. The dashboard app makes tracking my attendance and workouts effortless.',
    rating: 5,
    achievement: 'CrossFit Athlete • 150 Class Streak',
  },
  {
    id: '3',
    name: 'Rahul Sen',
    role: 'Elite Member',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    content: 'Having an assigned coach and personalized diet plan through the Elite plan made all the difference. Cleanest gym in the city with world-class gear.',
    rating: 5,
    achievement: 'Bench: 140kg • Squat: 190kg',
  },
];
