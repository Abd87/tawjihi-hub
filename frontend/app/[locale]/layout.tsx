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
import SocialProofPopup from '@/components/SocialProofPopup';

const cairo = Cairo({
  subsets: ['arabic'],
  variable: '--font-cairo',
  display: 'swap',
  weight: ['400', '500', '700', '800'],
  preload: true,
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['400', '500', '700', '800'],
  preload: true,
});

import { Viewport } from 'next';

export const viewport: Viewport = {
  themeColor: '#020617',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover', // Ensures full screen on notched phones
};

export function generateStaticParams() {
  return [{ locale: 'ar' }, { locale: 'en' }];
}

import { headers } from 'next/headers';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const safeLocale = (locale === 'en' || locale === 'ar') ? locale : 'ar';
  let messages: any;
  try {
    messages = (await import(`../../messages/${safeLocale}.json`)).default;
  } catch (e) {
    messages = {
      navigation: { brandName: 'Tawjihi Hub' },
      meta: { title: 'توجيهي هب | Tawjihi Hub', description: 'المنصة الأولى لطلاب التوجيهي والأكاديمي وBTEC في الأردن' }
    };
  }
  
  // Try to get current URL from middleware header, fallback to domain root
  let canonicalUrl = `https://tawjihihub.com/${safeLocale}`;
  try {
    const headersList = headers();
    const currentUrl = headersList.get('x-url');
    if (currentUrl) {
      canonicalUrl = currentUrl.split('?')[0];
    }
  } catch (e) {
    // fallback
  }

  return {
    metadataBase: new URL('https://tawjihihub.com'),
    manifest: '/manifest.json',
    appleWebApp: {
      capable: true,
      statusBarStyle: 'black-translucent',
      title: messages.navigation?.brandName || 'Tawjihi Hub',
    },
    verification: {
      other: {
        'msvalidate.01': 'A667B4E5B55CF7D805DD70BD90E62656',
      },
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'ar': '/ar',
        'en': '/en',
      },
    },
    title: {
      template: `%s | ${messages.navigation?.brandName || 'Tawjihi Hub'}`,
      default: messages.meta?.title || 'توجيهي هب | Tawjihi Hub',
    },
    description: messages.meta?.description || 'المنصة الأولى لطلاب التوجيهي والأكاديمي وBTEC في الأردن',
    keywords: safeLocale === 'ar' 
      ? [
          'توجيهي', 'توجيهي هب', 'توجيهي الأردن', 'امتحان التوجيهي', 'امتحان التوجيهي 2026', 'أسئلة توجيهي سابقة', 'نتائج التوجيهي',
          'منصة توجيهي', 'موقع توجيهي', 'دورات توجيهي', 'أوائل التوجيهي',
          'نظام BTEC', 'منهاج BTEC', 'تعليم مهني توجيهي', 'بيتك توجيهي',
          'BTEC', 'بتيك', 'بتك', 'بيتيك', 'بيتك',
          'مكثف رياضيات توجيهي', 'ملخص أحياء توجيهي', 'قواعد إنجليزي توجيهي',
          'توجيهي هندسة', 'توجيهي أعمال', 'توجيهي تكنولوجيا معلومات', 'توجيهي ميديا',
          'دليل دراسة التوجيهي', 'نماذج امتحانات توجيهي', 'مواد توجيهي',
          'وزارة التربية والتعليم الأردنية توجيهي', 'معادلة التوجيهي', 'رقم جلوس التوجيهي'
        ] 
      : [
          'Tawjihi', 'Tawjihi Hub', 'Tawjihi Jordan', 'Tawjihi exam', 'Tawjihi exam 2026', 'Tawjihi past papers', 'Tawjihi results',
          'Tawjihi platform', 'Tawjihi website', 'Tawjihi courses', 'Tawjihi top students',
          'BTEC Jordan', 'BTEC curriculum', 'Pearson BTEC Tawjihi', 'BTEC vocational Tawjihi',
          'Tawjihi Math revision', 'Tawjihi Biology summary', 'Tawjihi English grammar',
          'Tawjihi BTEC Engineering', 'Tawjihi BTEC Business', 'Tawjihi BTEC IT', 'Tawjihi Digital Media',
          'Tawjihi study guide', 'Tawjihi model exams', 'Tawjihi training materials',
          'Ministry of Education Jordan Tawjihi', 'Tawjihi equivalency', 'Tawjihi seat number'
        ],
    openGraph: {
      title: messages.meta?.title || 'توجيهي هب | Tawjihi Hub',
      description: messages.meta?.description || 'المنصة الأولى لطلاب التوجيهي في الأردن',
      url: 'https://tawjihihub.com',
      siteName: messages.navigation?.brandName || 'Tawjihi Hub',
      images: [
        {
          url: 'https://tawjihihub.com/og-image.png',
          width: 1200,
          height: 630,
        },
      ],
      locale: safeLocale === 'ar' ? 'ar_JO' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: messages.meta?.title || 'توجيهي هب | Tawjihi Hub',
      description: messages.meta?.description || 'المنصة الأولى لطلاب التوجيهي في الأردن',
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

import { CSPostHogProvider } from '@/components/providers/PostHogProvider';
import SuspendedPostHogPageView from '@/components/providers/PostHogPageView';

interface LayoutProps {
  children: ReactNode;
  params: { locale: string };
}

export default async function LocaleLayout({
  children,
  params: { locale }
}: LayoutProps) {
  const safeLocale = (locale === 'en' || locale === 'ar') ? locale : 'ar';
  unstable_setRequestLocale(safeLocale);
  let messages: any;
  try {
    messages = await getMessages();
  } catch (e) {
    try {
      messages = (await import(`../../messages/${safeLocale}.json`)).default;
    } catch (err) {
      messages = {};
    }
  }
  const dir = safeLocale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={safeLocale} dir={dir} className={`print:bg-white ${cairo.variable} ${inter.variable}`}>
      <CSPostHogProvider>
        <body className={`bg-[#020617] print:bg-white text-slate-100 print:text-black ${safeLocale === 'ar' ? 'font-arabic' : 'font-sans'} antialiased`}>
          <SuspendedPostHogPageView />
          <NextIntlClientProvider messages={messages}>
            <Navbar />
            {children}
            <SocialFloatingButtons />
            <SocialProofPopup isRtl={safeLocale === 'ar'} />
            <CookieBanner />
          </NextIntlClientProvider>
          <Analytics />
        </body>
      </CSPostHogProvider>
    </html>
  );
}

