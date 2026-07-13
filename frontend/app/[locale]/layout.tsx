import { NextIntlClientProvider } from 'next-intl';
import { getMessages, unstable_setRequestLocale } from 'next-intl/server';
import { ReactNode } from 'react';
import { Cairo, Inter } from 'next/font/google';
import '../globals.css';
import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import SocialFloatingButtons from '@/components/SocialFloatingButtons';
import { Analytics } from '@vercel/analytics/react';
import CookieBanner from '@/components/CookieBanner';

const cairo = Cairo({
  subsets: ['arabic'],
  variable: '--font-cairo',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
});

import { Viewport } from 'next';

export const viewport: Viewport = {
  themeColor: '#020617',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Prevents zooming which breaks mobile app feel
  viewportFit: 'cover', // Ensures full screen on notched phones
};

export function generateStaticParams() {
  return [{ locale: 'ar' }, { locale: 'en' }];
}

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const messages = (await import(`../../messages/${locale}.json`)).default;
  return {
    metadataBase: new URL('https://tawjihihub.com'),
    manifest: '/manifest.json',
    appleWebApp: {
      capable: true,
      statusBarStyle: 'black-translucent',
      title: messages.navigation.brandName,
    },
    alternates: {
      canonical: `/${locale}`,
      languages: {
        'ar': '/ar',
        'en': '/en',
      },
    },
    title: {
      template: `%s | ${messages.navigation.brandName}`,
      default: messages.meta.title,
    },
    description: messages.meta.description,
    keywords: locale === 'ar' 
      ? [
          'توجيهي الأردن', 'امتحان التوجيهي 2026', 'أسئلة توجيهي سابقة', 'نتائج التوجيهي',
          'نظام BTEC', 'منهاج BTEC', 'تعليم مهني توجيهي',
          'مكثف رياضيات توجيهي', 'ملخص أحياء', 'قواعد إنجليزي',
          'بيتك هندسة', 'بيتك أعمال', 'بيتك تكنولوجيا معلومات', 'بيتك ميديا',
          'دليل دراسة التوجيهي', 'نماذج امتحانات توجيهي', 'مواد تخصص BTEC',
          'وزارة التربية والتعليم الأردنية', 'معادلة التوجيهي', 'رقم جلوس التوجيهي', 'توجيهي هب'
        ] 
      : [
          'Tawjihi Jordan', 'Tawjihi exam 2026', 'Tawjihi past papers', 'Tawjihi results',
          'BTEC Jordan', 'BTEC curriculum', 'Pearson BTEC', 'BTEC vocational',
          'Tawjihi Math revision', 'Tawjihi Biology summary', 'English grammar',
          'BTEC Engineering', 'BTEC Business', 'BTEC IT', 'Digital Media BTEC',
          'Tawjihi study guide', 'Tawjihi model exams', 'BTEC training materials',
          'Ministry of Education Jordan', 'Tawjihi equivalency', 'Tawjihi seat number', 'Tawjihi Hub'
        ],
    openGraph: {
      title: messages.meta.title,
      description: messages.meta.description,
      url: 'https://tawjihihub.com', // Replace with real domain when available
      siteName: messages.navigation.brandName,
      images: [
        {
          url: 'https://tawjihihub.com/og-image.png',
          width: 1200,
          height: 630,
        },
      ],
      locale: locale === 'ar' ? 'ar_JO' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: messages.meta.title,
      description: messages.meta.description,
      images: ['https://tawjihihub.com/og-image.png'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

interface LayoutProps {
  children: ReactNode;
  params: { locale: string };
}

export default async function LocaleLayout({
  children,
  params: { locale }
}: LayoutProps) {
  unstable_setRequestLocale(locale);
  const messages = await getMessages();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir} className={`${cairo.variable} ${inter.variable}`}>
      <body className={`bg-[#020617] text-slate-100 ${locale === 'ar' ? 'font-arabic' : 'font-sans'} antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          {children}
          <SocialFloatingButtons />
          <CookieBanner />
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
