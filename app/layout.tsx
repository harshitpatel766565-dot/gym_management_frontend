import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { ToastProvider } from '@/context/ToastContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppButton } from '@/components/shared/WhatsAppButton';
import { BRAND } from '@/lib/constants';

export const metadata: Metadata = {
  title: `${BRAND.name} | Elite Gym & High-Performance Fitness Management`,
  description: `${BRAND.tagline}. Train harder. Live stronger. Become unstoppable with Olympic-grade equipment, master coaches, and scientific transformation protocols.`,
  keywords: [
    'gym',
    'fitness',
    'bodybuilding',
    'crossfit',
    'weight training',
    'personal trainer',
    'workout programs',
    'IRONFORGE',
    'diet planning',
    'fitness management',
  ],
  authors: [{ name: 'IRONFORGE Fitness' }],
  openGraph: {
    title: `${BRAND.name} - Build Your Strongest Self`,
    description: 'Transform your body with premier strength coaching, Olympic facilities, and tailored fitness regimens.',
    url: 'https://ironforgefitness.com',
    siteName: BRAND.name,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&auto=format&fit=crop&q=80',
        width: 1200,
        height: 630,
        alt: 'IRONFORGE Elite Training Arena',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${BRAND.name} Fitness`,
    description: 'Elite Gym & High-Performance Fitness Management Platform.',
    images: ['https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'HealthClub',
              name: BRAND.name,
              description: BRAND.subtitle,
              url: 'https://ironforgefitness.com',
              telephone: BRAND.phone,
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'Level 4, Titanium Heights, Prime Hub Road',
                addressLocality: 'Mumbai',
                addressRegion: 'MH',
                postalCode: '400053',
                addressCountry: 'IN',
              },
              openingHours: ['Mo-Fr 05:00-23:00', 'Sa 06:00-22:00', 'Su 07:00-20:00'],
              priceRange: '₹₹',
            }),
          }}
        />
      </head>
      <body className="min-h-screen bg-forge-950 text-forge-100 antialiased flex flex-col justify-between selection:bg-brand-red selection:text-white">
        <ThemeProvider>
          <ToastProvider>
            <AuthProvider>
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
                <WhatsAppButton />
              </div>
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
