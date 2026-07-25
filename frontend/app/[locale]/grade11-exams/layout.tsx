import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Grade 11 Free Exams | Tawjihi Hub',
  description: 'Free interactive exams for Grade 11 English students. Practice grammar, vocabulary, and reading comprehension.',
  openGraph: {
    title: 'Grade 11 Free Exams | Tawjihi Hub',
    description: 'Free interactive exams for Grade 11 English students. Practice grammar, vocabulary, and reading comprehension.',
    images: [
      {
        url: '/og-grade11.png',
        width: 500,
        height: 500,
        alt: 'Grade 11 Exams Open Graph Image',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Grade 11 Free Exams | Tawjihi Hub',
    description: 'Free interactive exams for Grade 11 English students. Practice grammar, vocabulary, and reading comprehension.',
    images: ['/og-grade11.png'],
  },
};

export default function Grade11ExamsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
