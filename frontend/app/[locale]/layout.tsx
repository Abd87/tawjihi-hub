import { NextIntlClientProvider } from 'next-intl';
import { getMessages, unstable_setRequestLocale } from 'next-intl/server';
import { ReactNode } from 'react';
import { Cairo, Inter } from 'next/font/google';
import '../globals.css';
import { Metadata } from 'next';

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

export function generateStaticParams() {
  return [{ locale: 'ar' }, { locale: 'en' }];
}

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const messages = (await import(`../../messages/${locale}.json`)).default;
  return {
    title: {
      template: `%s | ${messages.navigation.brandName}`,
      default: messages.meta.title,
    },
    description: messages.meta.description,
    keywords: locale === 'ar' 
      ? ['توجيهي', 'الأردن', 'BTEC', 'تعليم', 'منصة دراسية', 'توجيهي هب'] 
      : ['Tawjihi', 'Jordan', 'BTEC', 'Education', 'E-learning', 'Tawjihi Hub'],
    openGraph: {
      title: messages.meta.title,
      description: messages.meta.description,
      url: 'https://tawjihihub.com', // Replace with real domain when available
      siteName: messages.navigation.brandName,
      images: [
        {
          url: 'https://tawjihihub.com/og-image.jpg', // Placeholder for actual OG image
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
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
