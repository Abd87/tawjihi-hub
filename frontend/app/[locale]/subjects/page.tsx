import { Metadata } from 'next';
import SubjectsClient from './SubjectsClient';

export const metadata: Metadata = {
  title: 'مواد التوجيهي الأردني | المنهاج الجديد - Tawjihi Hub',
  description: 'دليل شامل لجميع مواد التوجيهي الأردني للفرعين العلمي والأدبي والفروع المهنية. شروحات تفصيلية لمواد الرياضيات، الفيزياء، الكيمياء، الأحياء، واللغتين العربية والإنجليزية.',
  keywords: ['توجيهي', 'الأردن', 'مواد التوجيهي', 'رياضيات علمي', 'فيزياء', 'كيمياء', 'عربي تخصص', 'تاريخ الأردن', 'منصة تعليمية', 'Tawjihi Jordan', 'الفرع العلمي', 'الفرع الأدبي'],
  alternates: {
    canonical: '/ar/subjects',
    languages: {
      'ar': '/ar/subjects',
      'en': '/en/subjects',
    },
  },
};

export default function SubjectsPage({ params: { locale } }: { params: { locale: string } }) {
  return <SubjectsClient locale={locale} />;
}
